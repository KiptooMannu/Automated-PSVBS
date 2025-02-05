import { Context } from "hono";
import { getAllPaymentsService, getPaymentByIdService, createPaymentService, updatePaymentService, deletePaymentService } from "./Payment.Service";
import Stripe from "stripe";
import { stripe } from "../drizzle/db"; // Ensure stripe is correctly set up
// import { ClientURL } from "./utils"; // Define your client URL for redirects
import {createTicket} from "../Ticketing/Ticketing.Service"
import { paymentsTable ,bookingTable} from "../drizzle/schema";
import db from "../drizzle/db";
import { eq } from "drizzle-orm";





// Get all payments// ✅ Get all payments
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
// ✅ Get payment by ID
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

        // Ensure correct default payment status
        const newPayment = await createPaymentService({
            ...payment,
            payment_date: new Date(),
            payment_status: "pending", // Ensure all new payments start as "pending"
        });

        if (!newPayment) {
            return c.text("Payment not created", 400);
        }

        return c.json({ message: "Payment created successfully", payment: newPayment }, 201);
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
        const updatedPayment = await updatePaymentService(payment.payment_id, {
            ...(payment.payment_status && { payment_status: payment.payment_status }),
            updated_at: new Date(),
        });
        
        
        if (!updatedPayment) {
            return c.text("Payment not updated", 400);
        }
        return c.json({ message: "Payment updated successfully" }, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// ✅ Delete a payment
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
                booking_id: paymentsTable.booking_id,
            })
            .from(paymentsTable)
            .innerJoin(bookingTable, eq(bookingTable.booking_id, paymentsTable.booking_id)) // ✅ Use proper column references
            .where(eq(bookingTable.user_id, user_id)) // ✅ Use bookingsTable.user_id
            .execute();

        return c.json(payments, 200);
    } catch (error) {
        console.error("❌ Error fetching user payments:", error);
        return c.json({ message: "Internal server error" }, 500);
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

    // ✅ Ensure booking_id is provided
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
            metadata: {
                booking_id: booking.booking_id.toString(), 
                user_id: booking.user_id.toString(), // Store as string, convert later
            },
            success_url: "http://localhost:5173/dashboard/payment-success",
            cancel_url: "http://localhost:5173/dashboard/payment-canceled",
        };
        
        const session: Stripe.Checkout.Session = await stripe.checkout.sessions.create(sessionParams);

        // ✅ Return session details to frontend, but DO NOT create a ticket yet
        return c.json({ sessionId: session.id, url: session.url }, 200);

    } catch (error: any) {
        console.error("Error creating checkout session:", error);
        return c.json({ message: error.message }, 400);
    }
};

// Webhook handler (for Stripe)
// ✅ Webhook for Stripe Payments
// ✅ Ensure payment status updates to "completed" on successful checkout
export const stripeWebhookController = async (c: Context) => {
    try {
        const payload = await c.req.text();
        const sig = c.req.header('stripe-signature');

        if (!sig) {
            console.error("❌ No signature provided.");
            return c.json({ message: "Webhook signature verification failed" }, 400);
        }

        console.log("🔍 Incoming Webhook Event: ", payload);

        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET as string || '');
        } catch (error: any) {
            console.error("❌ Webhook signature verification failed:", error);
            return c.json({ message: "Webhook signature verification failed" }, 400);
        }

        console.log(`✅ Stripe Event Received: ${event.type}`);

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            console.log("✅ Stripe checkout completed. Session ID:", session.id);

            const booking_id = Number(session.metadata?.booking_id);
            const user_id = session.metadata?.user_id ? Number(session.metadata.user_id) : 0;
            const amount = session.amount_total ? (session.amount_total / 100).toString() : "0";

            console.log(`🔍 Processing Payment for Booking ID: ${booking_id}, Amount: ${amount}`);

            if (!booking_id || amount === "0") {
                console.error("❌ Missing required fields from Stripe session.");
                return c.json({ message: "Invalid payment data" }, 400);
            }

            // ✅ Fetch the payment record from the database
            const existingPayment = await db.query.paymentsTable.findFirst({
                where: eq(paymentsTable.booking_id, booking_id),
            });

            if (existingPayment?.payment_status === "completed") {
                console.log(`ℹ️ Payment ID ${existingPayment.payment_id} is already completed.`);
                return c.json({ message: "Payment already completed" }, 200);
            }

            // ✅ Update or create payment record with transaction reference
            if (existingPayment?.payment_id) {
                console.log(`ℹ️ Updating payment status for payment ID: ${existingPayment.payment_id}`);
                await updatePaymentService(existingPayment.payment_id, {
                    payment_status: "completed",
                    transaction_reference: session.id, // 🔍 Ensure transaction reference is stored
                    updated_at: new Date(),
                });
            } else {
                console.log(`ℹ️ Creating new payment record for booking ${booking_id}`);
                await createPaymentService({
                    booking_id,
                    amount,
                    payment_date: new Date(),
                    payment_method: 'card',
                    transaction_reference: session.id, // 🔍 Ensure transaction reference is stored
                    payment_status: "completed",
                });
            }

            // ✅ Update booking status to "confirmed"
            console.log(`🔄 Updating Booking ID ${booking_id} to "confirmed"`);
            await db.update(bookingTable)
                .set({ booking_status: "confirmed" })
                .where(eq(bookingTable.booking_id, booking_id))
                .execute();

            console.log(`✅ Payment and booking status updated successfully.`);
            return c.json({ message: "Payment recorded successfully" }, 200);
        }

        return c.json({ message: "Unhandled event type" }, 200);
    } catch (error) {
        console.error("❌ Unexpected error in webhook:", error);
        return c.json({ message: "Internal server error" }, 500);
    }
};
