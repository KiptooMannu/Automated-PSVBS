import { Hono, Context } from "hono";
import dotenv from "dotenv";
import { MiddlewareHandler } from "hono";
import db from "../drizzle/db"
import {paymentsTable} from "../drizzle/schema"
import { eq } from "drizzle-orm";


// ✅ Dynamic Import for `node-fetch`
const fetch = (...args: Parameters<typeof import("node-fetch")>) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

dotenv.config();

const app = new Hono();
const {
  MPESA_ENV, // 'sandbox' or 'production'
} = process.env;

// ✅ Extract M-Pesa Credentials from `.env`
const mpesa = {
  businessShortCode: process.env.MPESA_BUSINESS_SHORTCODE || "174379",
  passKey:
    process.env.MPESA_PASSKEY ||
    "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919",
  consumerKey:
    process.env.MPESA_CONSUMER_KEY ||
    "9AQyjfoahLboUEsixGB3c40hljkB7oJc2fU3RB6B5tc1AjXj",
  consumerSecret:
    process.env.MPESA_CONSUMER_SECRET ||
    "3euoJezUOiqiv5OjZ8zgBDssQwH2avgfhAVfk8OcnQRxyAmZj2FzY6TAegGAS9b1",
  callBackURL:
    process.env.MPESA_CALLBACK_URL ||
    "https://8516-105-163-157-220.ngrok-free.app/api/v1/callback",
  partyB: process.env.MPESA_PARTY_B || "174379",
  tokenUrl: `https://${MPESA_ENV}.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials`,
  stkUrl: `https://${MPESA_ENV}.safaricom.co.ke/mpesa/stkpush/v1/processrequest`,
};

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
    const { phone, amount } = await c.req.json();

    // Validate Inputs
    if (!/^254\d{9}$/.test(phone))
      return c.json({ error: "Invalid phone format. Use 254XXXXXXXXX." }, 400);
    if (amount <= 0)
      return c.json({ error: "Amount must be greater than zero." }, 400);

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
      PartyA: phone,
      PartyB: mpesa.partyB,
      PhoneNumber: phone,
      CallBackURL: mpesa.callBackURL,
      AccountReference: "TestPayment",
      TransactionDesc: "Payment for services",
    };

    const response = await fetch(mpesa.stkUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok)
      throw new Error(`M-Pesa STK Push Failed: ${response.statusText}`);

    const result = (await response.json()) as MpesaResponse;
    if (result.errorCode)
      return c.json({ error: result.errorMessage || "STK push failed" }, 400);

    return c.json({ message: "STK push initiated successfully", data: result });
  } catch (error: any) {
    console.error("STK Push Error:", error);
    return c.json({ error: error.message }, 500);
  }
};

// ✅ Function to Handle M-Pesa Callback
export const mpesaCallback: MiddlewareHandler = async (c: Context) => {
  const body = await c.req.json();
  console.log("M-Pesa Callback received:", JSON.stringify(body, null, 2));

  const stkCallback = body.Body?.stkCallback;
  if (!stkCallback) {
    return c.json({ error: "Invalid callback structure" }, 400);
  }

  const {
    MerchantRequestID,
    CheckoutRequestID,
    ResultCode,
    ResultDesc,
    CallbackMetadata,
  } = stkCallback;

  // Determine transaction status
  const paymentStatus = ResultCode === 0 ? "completed" : "failed";
  let MpesaReceiptNumber = "";

  if (ResultCode === 0 && CallbackMetadata) {
    // Define the type of items in CallbackMetadata.Item
    const receiptItem = CallbackMetadata.Item.find(
      (item: { Name: string; Value: string }) => item.Name === "MpesaReceiptNumber"
    );
  
    MpesaReceiptNumber = receiptItem ? receiptItem.Value : "";
  }
  

  // Update the database with transaction status
  try {
    await db
      .update(paymentsTable)
      .set({
        payment_status: paymentStatus,
        transaction_reference: MpesaReceiptNumber,
      })
      .where(eq(paymentsTable.transaction_reference, CheckoutRequestID));

    console.log(
      `Payment status updated: ${paymentStatus}, Reference: ${MpesaReceiptNumber}`
    );
  } catch (error) {
    console.error("Database update error:", error);
  }

  return c.json({
    message: "Callback processed successfully",
    status: paymentStatus,
    transaction_reference: MpesaReceiptNumber,
    description: ResultDesc,
  });
};

// ✅ Function to Initiate M-Pesa Payment (Can Be Used Independently)
export const initiateMpesaPayment = async (
  phone: string,
  amount: number
): Promise<MpesaResponse> => {
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
    PartyA: phone,
    PartyB: mpesa.partyB,
    PhoneNumber: phone,
    CallBackURL: mpesa.callBackURL,
    AccountReference: "TestPayment",
    TransactionDesc: "Payment for services",
  };

  const response = await fetch(mpesa.stkUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok)
    throw new Error(`M-Pesa STK Push Failed: ${response.statusText}`);

  return (await response.json()) as MpesaResponse;
};


export default app;
