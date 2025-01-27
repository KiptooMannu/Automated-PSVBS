import { Context } from "hono";
import { getAllPaymentsService, getPaymentByIdService, createPaymentService, updatePaymentService, deletePaymentService } from "./Payment.Service";
import Stripe from "stripe";
import { stripe } from "../drizzle/db"; // Ensure stripe is correctly set up
import { ClientURL } from "./utils"; // Define your client URL for redirects
import {createTicket} from "../Ticketing/Ticketing.Service"

// Get all payments
export const getAllPaymentsController = async (c: Context) => {
    try {
        const payments = await getAllPaymentsService();
        if (!payments || payments.length === 0) {
            return c.text("No payments found", 404);
        }
        return c.json(payments, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// Get payment by ID
export const getPaymentByIdController = async (c: Context) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) {
            return c.text("Invalid id", 400);
        }
        const payment = await getPaymentByIdService(id);
        if (!payment) {
            return c.text("Payment not found", 404);
        }
        return c.json(payment, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// Create payment
export const createPaymentController = async (c: Context) => {
    try {
        const payment = await c.req.json();
        // Convert date fields to Date objects
        payment.payment_date = new Date(payment.payment_date);
        const newPayment = await createPaymentService(payment);
        if (!newPayment) {
            return c.text("Payment not created", 400);
        }
        return c.json({ message: "Payment created successfully" }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// Update payment
export const updatePaymentController = async (c: Context) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) {
            return c.text("Invalid id", 400);
        }
        const payment = await c.req.json();
        // Convert date fields to Date objects
        payment.payment_date = new Date(payment.payment_date);
        const updatedPayment = await updatePaymentService(id, payment);
        if (!updatedPayment) {
            return c.text("Payment not updated", 400);
        }
        return c.json({ message: "Payment updated successfully" }, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// Delete payment
export const deletePaymentController = async (c: Context) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) {
            return c.text("Invalid id", 400);
        }
        const deletedPayment = await deletePaymentService(id);
        if (!deletedPayment) {
            return c.text("Payment not deleted", 400);
        }
        return c.json({ message: "Payment deleted successfully" }, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// Checkout session (for Stripe)
export const createCheckoutSessionController = async (c: Context) => {
    let booking;
    try {
        booking = await c.req.json();
    } catch (error: any) {
        return c.json({ message: "Booking not found" }, 404);
    }

    // Validate booking data
    if (!booking.booking_id) {
        return c.json({ message: "Booking id is required" }, 400);
    }

    try {
        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Public Service Vehicle Booking',
                },
                unit_amount: Math.round(booking.total_price * 100), // Convert to cents
            },
            quantity: 1,
        }];

        const sessionParams: Stripe.Checkout.SessionCreateParams = {
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            // success_url: `${ClientURL}dashboard/payment-success`,
            // cancel_url: `${ClientURL}dashboard/payment-canceled`,
            success_url: "http://localhost:5173/dashboard/payment-success",
            cancel_url: "http://localhost:5173/dashboard/payment-canceled",
        };

        const session: Stripe.Checkout.Session = await stripe.checkout.sessions.create(sessionParams);

        const paymentDetails = {
            booking_id: booking.booking_id,
            amount: booking.total_price.toString(),
            user_id: booking.user_id,
            payment_date: new Date(),
            payment_method: 'card',
            transaction_id: session.id,
            transaction_reference: session.id, // Assuming transaction_reference is the same as the session ID
        };
      
        const createPayment = await createPaymentService(paymentDetails);
        
        // Create a support ticket after successful payment
        const ticketDetails = {
            user_id: booking.user_id,
            subject: `Payment received for booking ${booking.booking_id}`,
            description: `Payment of ${booking.total_price} received for booking ${booking.booking_id}. Payment reference: ${session.id}`,
            status: 'paid' as 'paid' | 'failed' | 'refunded' | null,
            created_at: new Date(), 
        };
    
        // Call the service to create the ticket
        await createTicket(ticketDetails);

        return c.json({ sessionId: session.id, url: session.url, payment: createPayment }, 200);
    } catch (error: any) {
        console.error("Error creating checkout session:", error);
        return c.json({ message: error.message }, 400);
    }
};
