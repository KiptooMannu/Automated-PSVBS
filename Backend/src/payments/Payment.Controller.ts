import { Context } from "hono";
import { getAllPaymentsService, getPaymentByIdService, createPaymentService, updatePaymentService, deletePaymentService } from "./Payment.Service";
import Stripe from "stripe";
import { stripe } from "../drizzle/db"; // Ensure stripe is correctly set up
// import { ClientURL } from "./utils"; // Define your client URL for redirects
import {createTicket} from "../Ticketing/Ticketing.Service"
import { paymentsTable ,bookingTable} from "../drizzle/schema";
import db from "../drizzle/db";
import { eq } from "drizzle-orm";
import { paymentStatusEnum } from "../drizzle/schema"; // ✅ Import the enum





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
        const newPayment = await createPaymentService({
            ...payment,
            payment_date: new Date(),
            payment_status: payment.payment_status ?? "pending", // Ensure "pending" is set if null/undefined
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
                transaction_reference: paymentsTable.transaction_reference, // ✅ Ensure transaction_reference is included
                payment_status: paymentsTable.payment_status, // ✅ Include payment status
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

    if (!booking.booking_id) {
        return c.json({ message: "Booking ID is required" }, 400);
    }

    try {
        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Car Rental',
                },
                unit_amount: Math.round(booking.total_price * 100), // Convert to cents
            },
            quantity: 1,
        }];

        const sessionParams: Stripe.Checkout.SessionCreateParams = {
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `http://localhost:5173/payment_success`, 
            cancel_url: `http://localhost:5173/payment_failed`,
        };  

        const session: Stripe.Checkout.Session = await stripe.checkout.sessions.create(sessionParams);
        console.log(`Checkout Session URL: ${session.url}`);

        // ✅ Store session_id in `transaction_reference`
        const paymentDetails = {
            booking_id: booking.booking_id,
            amount: booking.total_price.toString(),
            user_id: booking.user_id,
            payment_date: new Date(),
            payment_method: 'card',
            transaction_reference: session.id, 
            payment_status: "pending" as typeof paymentStatusEnum.enumValues[number], // ✅ Cast to enum type
        };
        


        await createPaymentService(paymentDetails);
        return c.json({ sessionId: session.id, url: session.url }, 200);
    } catch (error: any) {
        return c.json({ message: error.message }, 400);
    }
};



export const handleStripeWebhook = async (c: Context) => {
    const sig = c.req.header('stripe-signature');
    const rawBody = await c.req.text();

    if (!sig) {
        console.log('❌ Signature not provided');
        return c.json({ message: 'Invalid Signature' }, 400);
    }

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_ENDPOINT_SECRET as string);
    } catch (error: any) {
        console.log("❌ Webhook Error:", error.message);
        return c.json({ message: `Webhook Error: ${error.message}` }, 400);
    }

    console.log(`✅ Stripe Webhook Event Received: ${event.type}`);

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const session_id = session.id;
        console.log(`🔍 Updating payment with transaction_reference: ${session_id}`);

        // ✅ Check if payment exists before updating
        const existingPayment = await db.query.paymentsTable.findFirst({
            where: eq(paymentsTable.transaction_reference, session_id),
        });

        if (!existingPayment) {
            console.error(`❌ No payment found for session_id: ${session_id}`);
            return c.json({ message: "Payment record not found" }, 400);
        }

        try {
            const updateStatus = await db.update(paymentsTable)
                .set({ 
                    payment_status: "completed" as typeof paymentStatusEnum.enumValues[number], 
                    updated_at: new Date() 
                })
                .where(eq(paymentsTable.transaction_reference, session_id))
                .execute();

            if (!updateStatus) {
                console.error("❌ Payment update failed.");
                return c.json({ message: "Payment update failed" }, 400);
            }

            console.log(`✅ Payment updated successfully.`);
            return c.json({ message: "Payment recorded successfully" }, 200);
        } catch (error: any) {
            console.log("❌ Database Error:", error.message);
            return c.json({ message: `Database Error: ${error.message}` }, 500);
        }
    }

    console.log(`⚠️ Unhandled event type: ${event.type}`);
    return c.json({ message: `Unhandled event type ${event.type}` }, 200);
};
