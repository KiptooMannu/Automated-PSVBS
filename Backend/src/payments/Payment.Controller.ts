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
            metadata: {
                booking_id: booking.booking_id.toString(), 
                user_id: booking.user_id.toString(),
            },
            success_url: "http://localhost:5173/dashboard/payment-success",
            cancel_url: "http://localhost:5173/dashboard/payment-canceled",
        };
        
        const session: Stripe.Checkout.Session = await stripe.checkout.sessions.create(sessionParams);


        
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

        return c.json({ sessionId: session.id, url: session.url }, 200);

    } catch (error: any) {
        console.error("Error creating checkout session:", error);
        return c.json({ message: error.message }, 400);
    }
};
// Webhook handler (for Stripe)
// ✅ Webhook for Stripe Payments
export const stripeWebhookController = async (c: Context) => {
    try {
        const payload = await c.req.text();
        const sig = c.req.header('stripe-signature');

        if (!sig) {
            console.error("❌ No signature provided.");
            return c.json({ message: "Webhook signature verification failed" }, 400);
        }

        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET as string || '');
        } catch (error: any) {
            console.error("❌ Webhook signature verification failed:", error);
            return c.json({ message: "Webhook signature verification failed" }, 400);
        }

        switch (event.type) {
            case 'checkout.session.completed':

            
                const session = event.data.object as Stripe.Checkout.Session;
                console.log("✅ Stripe checkout completed. Session ID:", session.id);


        
                const booking_id = Number(session.metadata?.booking_id);
                const amount = session.amount_total ? (session.amount_total / 100).toString() : "0";

                if (!booking_id || amount === "0") {
                    console.error("❌ Missing required fields from Stripe session.");
                    return c.json({ message: "Invalid payment data" }, 400);
                }

                // ✅ Fetch `user_id` from the `bookingTable`
                const booking = await db.query.bookingTable.findFirst({
                    where: eq(bookingTable.booking_id, booking_id),
                });

                if (!booking) {
                    console.error(`❌ No booking found for booking_id: ${booking_id}`);
                    return c.json({ message: "Booking not found" }, 404);
                }

                const user_id = booking.user_id; // ✅ Get `user_id` from the booking

                // ✅ Check if a payment already exists
                const existingPayment = await db.query.paymentsTable.findFirst({
                    where: eq(paymentsTable.booking_id, booking_id),
                });


                if (existingPayment?.payment_status === "completed") {
                    console.log(`ℹ️ Payment ID ${existingPayment.payment_id} is already completed. Skipping update.`);
                    return c.json({ message: "Payment already completed" }, 200);
                }
                

                if (existingPayment?.payment_id) {
                    console.log(`ℹ️ Updating payment status for payment ID: ${existingPayment.payment_id}`);
                    await updatePaymentService(existingPayment.payment_id, {
                        payment_status: "completed",
                        updated_at: new Date(),
                    });
                } else {
                    console.log(`ℹ️ Creating new payment for booking ${booking_id}`);
                    const newPayment = await createPaymentService({
                        booking_id, // ✅ Keep only necessary fields
                        amount,
                        payment_date: new Date(),
                        payment_method: 'card',
                        transaction_reference: session.id,
                        payment_status: "completed",
                    });

                    if (!newPayment) {
                        console.error(`❌ Error creating payment for session ${session.id}`);
                        return c.json({ message: "Error creating payment record" }, 500);
                    }
                    console.log("✅ Payment successfully created:", newPayment);
                }

                return c.json({ message: "Payment recorded successfully" }, 200);

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return c.json({ message: "Event handled successfully" }, 200);
    } catch (error) {
        console.error("❌ Unexpected error in webhook:", error);
        return c.json({ message: "Internal server error" }, 500);
    }
};
