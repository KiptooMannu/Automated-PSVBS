// mpesa service

import { Hono, Context } from "hono";
import dotenv from "dotenv";
import { MiddlewareHandler } from "hono";
import db from "../drizzle/db";
import { paymentsTable ,bookingsSeatsTable,bookingTable} from "../drizzle/schema";
import { eq } from "drizzle-orm";

// Load environment variables
dotenv.config();

// Log environment variable to the terminal
console.log(`MPESA_ENV: ${process.env.MPESA_ENV}`);

const app = new Hono();

// Ensure MPESA_ENV is set
const MPESA_ENV = process.env.MPESA_ENV?.trim();
if (!MPESA_ENV) {
  throw new Error("MPESA_ENV is not set. Please check your .env file.");
}

// M-Pesa Configuration
const mpesa = {
  businessShortCode: process.env.MPESA_BUSINESS_SHORTCODE || "174379",
  passKey: process.env.MPESA_PASSKEY || "default_passkey",
  consumerKey: process.env.MPESA_CONSUMER_KEY || "default_consumer_key",
  consumerSecret: process.env.MPESA_CONSUMER_SECRET || "default_consumer_secret",
  callBackURL: process.env.MPESA_CALLBACK_URL || "default_callback_url",
  partyB: process.env.MPESA_PARTY_B || "174379",
  tokenUrl: `https://${MPESA_ENV}.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials`,
  stkUrl: `https://${MPESA_ENV}.safaricom.co.ke/mpesa/stkpush/v1/processrequest`,
};

console.log("M-Pesa Configuration:", mpesa);

interface MpesaResponse {
  MerchantRequestID?: string;
  CheckoutRequestID?: string;
  ResponseCode?: string;
  ResponseDescription?: string;
  CustomerMessage?: string;
  errorCode?: string;
  errorMessage?: string;
}

// ✅ Function to Generate M-Pesa OAuth Token
const getMpesaToken = async (): Promise<string> => {
  const auth = Buffer.from(
    `${mpesa.consumerKey}:${mpesa.consumerSecret}`
  ).toString("base64");

  const response = await fetch(mpesa.tokenUrl, {
    method: "GET",
    headers: { Authorization: `Basic ${auth}` },
  });

  if (!response.ok)
    throw new Error(`M-Pesa Token Error: ${response.statusText}`);

  const data = (await response.json()) as { access_token: string };
  return data.access_token;
};

// ✅ Function to Initiate STK Push
export const stkPush = async (c: Context) => {
  try {
    const { phone_number, amount } = await c.req.json();

    // Trim and log the phone number
    const trimmedPhone = phone_number.trim();
    console.log("Received phone number:", trimmedPhone);

    // Validate Inputs
    if (!/^254\d{9}$/.test(trimmedPhone)) {
      console.error("Invalid phone number format:", trimmedPhone);
      return c.json({ error: "Invalid phone format. Use 254XXXXXXXXX." }, 400);
    }
    if (amount <= 0) {
      return c.json({ error: "Amount must be greater than zero." }, 400);
    }

    // Generate OAuth token
    const token = await getMpesaToken();
    console.log("OAuth Token:", token);

    // Generate timestamp and password
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, 14);
    const password = Buffer.from(
      `${mpesa.businessShortCode}${mpesa.passKey}${timestamp}`
    ).toString("base64");

    console.log("Timestamp:", timestamp);
    console.log("Password:", password);

    // Prepare payload
    const payload = {
      BusinessShortCode: mpesa.businessShortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: trimmedPhone,
      PartyB: mpesa.partyB,
      PhoneNumber: trimmedPhone,
      CallBackURL: mpesa.callBackURL,
      AccountReference: "TestPayment",
      TransactionDesc: "Payment for services",
    };

    console.log("STK Push Payload:", JSON.stringify(payload, null, 2));

    // Send request to M-Pesa API
    const response = await fetch(mpesa.stkUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorResponse = await response.text();
      console.error("M-Pesa STK Push Failed:", errorResponse);
      throw new Error(`M-Pesa STK Push Failed: ${response.statusText}`);
    }

    const result = (await response.json()) as MpesaResponse;
    if (result.errorCode)
      return c.json({ error: result.errorMessage || "STK push failed" }, 400);

    return c.json({ message: "STK push initiated successfully", data: result });
  } catch (error: any) {
    console.error("STK Push Error:", error);
    return c.json({ error: error.message }, 500);
  }
};



export const initiateMpesaPayment = async (
  phone_number: string,
  amount: number,
  booking_id: number
): Promise<MpesaResponse & { CheckoutRequestID: string }> => {
  const token = await getMpesaToken();
  const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, 14);
  const password = Buffer.from(
    `${mpesa.businessShortCode}${mpesa.passKey}${timestamp}`
  ).toString("base64");

  const payload = {
    BusinessShortCode: mpesa.businessShortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: phone_number,
    PartyB: mpesa.partyB,
    PhoneNumber: phone_number,
    CallBackURL: mpesa.callBackURL,
    AccountReference: `Booking_${booking_id}`, // Use booking_id as the reference
    TransactionDesc: "Payment for booking",
  };

  const response = await fetch(mpesa.stkUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`M-Pesa STK Push Failed: ${response.statusText}`);
  }

  const responseData = (await response.json()) as MpesaResponse;

  // Ensure CheckoutRequestID is defined
  if (!responseData.CheckoutRequestID) {
    throw new Error("CheckoutRequestID is missing in the STK Push response");
  }

  const checkoutRequestID: string = responseData.CheckoutRequestID;

  // Save the payment record in the database with status "pending"
  try {
    await db.insert(paymentsTable).values({
      booking_id,
      amount: amount.toString(), // Convert to string to match the schema
      payment_method: "M-Pesa",
      payment_status: "pending", // Default status
      transaction_reference: checkoutRequestID, // Use CheckoutRequestID from STK Push response
      phone_number: phone_number, // Add phone number from the request
      payment_date: new Date(), // Use current timestamp
    });

    console.log("Payment record created with status: pending");
  } catch (error) {
    console.error("Failed to create payment record:", error);
    throw new Error("Failed to create payment record");
  }

  return {
    ...responseData,
    CheckoutRequestID: checkoutRequestID,
  };
};

export const mpesaCallback: MiddlewareHandler = async (c: Context) => {
  try {
    const body = await c.req.json();
    console.log("M-Pesa Callback received:", JSON.stringify(body, null, 2));

    const stkCallback = body.Body?.stkCallback;
    if (!stkCallback) {
      console.error("Invalid callback structure: Missing stkCallback");
      return c.json({ ResultCode: 1, ResultDesc: "Invalid callback structure" }, 400);
    }

    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = stkCallback;

    // Determine transaction status based on ResultCode
    const paymentStatus = ResultCode === 0 ? "completed" : "failed";
    let MpesaReceiptNumber = "";

    // Extract MpesaReceiptNumber from CallbackMetadata (if available)
    if (ResultCode === 0 && CallbackMetadata?.Item) {
      const receiptItem = CallbackMetadata.Item.find(
        (item: { Name: string; Value: string }) => item.Name === "MpesaReceiptNumber"
      );
      if (receiptItem) {
        MpesaReceiptNumber = receiptItem.Value;
      } else {
        console.error("MpesaReceiptNumber not found in CallbackMetadata");
      }
    }

    // Update the database with transaction status
    if (!CheckoutRequestID) {
      console.error("CheckoutRequestID is missing in the callback");
      return c.json({ ResultCode: 1, ResultDesc: "CheckoutRequestID is required" }, 400);
    }

    // Find the payment associated with the CheckoutRequestID
    const payment = await db.query.paymentsTable.findFirst({
      where: eq(paymentsTable.transaction_reference, CheckoutRequestID),
    });

    if (!payment) {
      console.error("Payment not found for CheckoutRequestID:", CheckoutRequestID);
      return c.json({ ResultCode: 1, ResultDesc: "Payment not found" }, 404);
    }

    // Update the payment status and store the MpesaReceiptNumber
    await db.update(paymentsTable)
      .set({ 
        payment_status: paymentStatus, 
        mpesa_receipt_number: MpesaReceiptNumber || null // Store receipt number or null if not available
      })
      .where(eq(paymentsTable.payment_id, payment.payment_id));

    if (paymentStatus === "failed") {
      // Rollback: Delete the booking and associated seats
      await db.delete(bookingTable).where(eq(bookingTable.booking_id, payment.booking_id));
      await db.delete(bookingsSeatsTable).where(eq(bookingsSeatsTable.booking_id, payment.booking_id));

      console.log("Booking rolled back due to payment failure.");
      return c.json({ ResultCode: 1, ResultDesc: "Payment failed. Booking rolled back." }, 200);
    }

    // Update the booking status to "confirmed"
    await db.update(bookingTable)
      .set({ booking_status: "confirmed" })
      .where(eq(bookingTable.booking_id, payment.booking_id));

    console.log(
      `Payment status updated: ${paymentStatus}, Reference: ${MpesaReceiptNumber || CheckoutRequestID}`
    );

    // Return success response to M-Pesa
    return c.json({
      ResultCode: 0,
      ResultDesc: "Callback processed successfully",
    });
  } catch (error) {
    console.error("Error processing M-Pesa callback:", error);
    return c.json({ ResultCode: 1, ResultDesc: "Internal server error" }, 500);
  }
};



































// export const mpesaCallback: MiddlewareHandler = async (c: Context) => {
//   try {
//     const body = await c.req.json();
//     console.log("M-Pesa Callback received:", JSON.stringify(body, null, 2));

//     const stkCallback = body.Body?.stkCallback;
//     if (!stkCallback) {
//       console.error("Invalid callback structure: Missing stkCallback");
//       return c.json({ error: "Invalid callback structure" }, 400);
//     }

//     const {
//       MerchantRequestID,
//       CheckoutRequestID,
//       ResultCode,
//       ResultDesc,
//       CallbackMetadata,
//     } = stkCallback;

//     // Determine transaction status
//     const paymentStatus = ResultCode === 0 ? "completed" : "failed";
//     let MpesaReceiptNumber = "";

//     // Extract MpesaReceiptNumber from CallbackMetadata (if available)
//     if (ResultCode === 0 && CallbackMetadata?.Item) {
//       const receiptItem = CallbackMetadata.Item.find(
//         (item: { Name: string; Value: string }) => item.Name === "MpesaReceiptNumber"
//       );
//       if (receiptItem) {
//         MpesaReceiptNumber = receiptItem.Value;
//       } else {
//         console.error("MpesaReceiptNumber not found in CallbackMetadata");
//       }
//     }

//     // Update the database with transaction status
//     if (!CheckoutRequestID) {
//       console.error("CheckoutRequestID is missing in the callback");
//       return c.json({ error: "CheckoutRequestID is required" }, 400);
//     }

//     const updateResult = await db
//       .update(paymentsTable)
//       .set({
//         payment_status: paymentStatus,
//         transaction_reference: MpesaReceiptNumber || CheckoutRequestID, // Fallback to CheckoutRequestID if MpesaReceiptNumber is missing
//       })
//       .where(eq(paymentsTable.transaction_reference, CheckoutRequestID));

//     if (!updateResult) {
//       console.error("Failed to update payment status: No matching record found");
//       return c.json({ error: "Payment record not found" }, 404);
//     }

//     console.log(
//       `Payment status updated: ${paymentStatus}, Reference: ${MpesaReceiptNumber || CheckoutRequestID}`
//     );

//     return c.json({
//       message: "Callback processed successfully",
//       status: paymentStatus,
//       transaction_reference: MpesaReceiptNumber || CheckoutRequestID,
//       description: ResultDesc,
//     });
//   } catch (error) {
//     console.error("Error processing M-Pesa callback:", error);
//     return c.json({ error: "Internal server error" }, 500);
//   }
// };