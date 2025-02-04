import { Context } from "hono";
import { getAllPaymentsService, getPaymentByIdService, createPaymentService, updatePaymentService, deletePaymentService } from "./Payment.Service";
import Stripe from "stripe";
import { stripe } from "../drizzle/db"; // Ensure stripe is correctly set up
// import { ClientURL } from "./utils"; // Define your client URL for redirects
import {createTicket} from "../Ticketing/Ticketing.Service"
import { paymentsTable } from "../drizzle/schema";
import db from "../drizzle/db";
import { eq } from "drizzle-orm";


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
//get all user payments by user id
export const getUserPaymentsByUserIdController = async (c: Context) => {
    try {
        const user_id = Number(c.req.param("id"));
        if (isNaN(user_id)) {
            return c.json({ message: "Invalid user_id. Must be a number." }, 400);
        }

        const payments = await db
            .select({
                payment_id: paymentsTable.payment_id,
                amount: paymentsTable.amount,
                payment_date: paymentsTable.payment_date,
                payment_method: paymentsTable.payment_method,
                transaction_id: paymentsTable.transaction_reference,
                transaction_reference: paymentsTable.transaction_reference,
            })
            .from(paymentsTable)
            .where(eq(paymentsTable.payment_id, user_id)) // ✅ Now user_id is correctly typed
            .execute();

        return c.json(payments, 200);
    } catch (error) {
        console.error("Error fetching payments:", error);
        return c.json({ message: "Internal server error" }, 500);
    }
}


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
// Webhook handler (for Stripe)
export const stripeWebhookController = async (c: Context) => {
    try {
        const payload = await c.req.text(); // Ensure we await the text() response
        const sig = c.req.header('stripe-signature');

        if (!sig) {
            console.error("Error verifying webhook signature: No signature provided");
            return c.json({ message: "Webhook signature verification failed" }, 400);
        }

        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET as string || '');
        } catch (error: any) {
            console.error("Error verifying webhook signature:", error);
            return c.json({ message: "Webhook signature verification failed" }, 400);
        }

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object as Stripe.Checkout.Session;

                // Ensure correct ID type (number/string)
                const payment = await getPaymentByIdService(Number(session.id)); // Convert to number if necessary
                if (!payment) {
                    console.error("Payment not found for session:", session.id);
                    return c.json({ message: "Payment not found" }, 404);
                }

                // Update payment status
                const updatedPayment = await updatePaymentService(payment.payment_id, { payment_status: 'completed' });
                if (!updatedPayment) {
                    console.error("Error updating payment status for session:", session.id);
                    return c.json({ message: "Error updating payment status" }, 500);
                }

                return c.json({ message: "Payment updated successfully" }, 200);
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return c.json({ message: "Event handled successfully" }, 200);
    } catch (error) {
        console.error("Unexpected error in webhook:", error);
        return c.json({ message: "Internal server error" }, 500);
    }
};