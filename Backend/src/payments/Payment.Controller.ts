import { Context } from "hono";
import {
  getAllPaymentsService,
  getPaymentByIdService,
  createPaymentService,
  updatePaymentService,
  deletePaymentService,
} from "./Payment.Service";
import { initiateMpesaPayment } from "./mpesa.service";

// ✅ Get all payments
export const getAllPaymentsController = async (c: Context) => {
  try {
    const payments = await getAllPaymentsService();
    if (!payments || payments.length === 0) {
      return c.json({ message: "No payments found" }, 404);
    }
    return c.json(payments, 200);
  } catch (error: any) {
    console.error("Error fetching payments:", error);
    return c.json({ error: error?.message || "Internal server error" }, 500);
  }
};

// ✅ Get payment by ID
export const getPaymentByIdController = async (c: Context) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) {
      return c.json({ error: "Invalid payment ID" }, 400);
    }

    const payment = await getPaymentByIdService(id);
    if (!payment) {
      return c.json({ message: "Payment not found" }, 404);
    }

    return c.json(payment, 200);
  } catch (error: any) {
    console.error(`Error fetching payment ID ${c.req.param("id")}:`, error);
    return c.json({ error: error?.message || "Internal server error" }, 500);
  }
};

export const createPaymentController = async (c: Context) => {
  try {
    const { amount, phone_number, booking_id } = await c.req.json();

    if (!amount || !phone_number || !booking_id) {
      return c.json(
        { error: "Amount, phone number, and booking ID are required" },
        400
      );
    }

    // Initiate M-Pesa Payment
    const mpesaResponse = await initiateMpesaPayment(phone_number, amount);

    if (!mpesaResponse.CheckoutRequestID) {
      return c.json(
        {
          error:
            mpesaResponse.errorMessage || "Failed to initiate M-Pesa payment",
        },
        400
      );
    }

    // Save payment to the database
    const newPayment = await createPaymentService({
      amount,
      phone_number,
      payment_method: "M-Pesa", // ✅ Explicitly setting payment method
      transaction_reference: mpesaResponse.CheckoutRequestID,
      payment_status: "pending",
      payment_date: new Date(),
      booking_id,
    });

    return c.json(
      { message: "M-Pesa payment initiated", payment: newPayment },
      201
    );
  } catch (error: any) {
    console.error("Error creating payment:", error);
    return c.json({ error: error?.message || "Internal server error" }, 500);
  }
};

// ✅ Update payment
export const updatePaymentController = async (c: Context) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) {
      return c.json({ error: "Invalid payment ID" }, 400);
    }

    const payment = await c.req.json();
    const updatedPayment = await updatePaymentService(id, {
      ...(payment.payment_status && { payment_status: payment.payment_status }),
      updated_at: new Date(),
    });

    if (!updatedPayment) {
      return c.json({ error: "Payment update failed" }, 400);
    }
    return c.json({ message: "Payment updated successfully" }, 200);
  } catch (error: any) {
    console.error(`Error updating payment ID ${c.req.param("id")}:`, error);
    return c.json({ error: error?.message || "Internal server error" }, 500);
  }
};

// ✅ Delete a payment
export const deletePaymentController = async (c: Context) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) {
      return c.json({ error: "Invalid payment ID" }, 400);
    }

    const deletedPayment = await deletePaymentService(id);
    if (!deletedPayment) {
      return c.json({ error: "Payment deletion failed" }, 400);
    }
    return c.json({ message: "Payment deleted successfully" }, 200);
  } catch (error: any) {
    console.error(`Error deleting payment ID ${c.req.param("id")}:`, error);
    return c.json({ error: error?.message || "Internal server error" }, 500);
  }
};
