import  db  from "../drizzle/db";
import { TIPayments, TSPayments, paymentsTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// Get all payments
export const getAllPaymentsService = async (): Promise<TSPayments[] | null> => {
    const payments = await db.query.paymentsTable.findMany();
    return payments;
};

// Get payment by ID
export const getPaymentByIdService = async (payment_id: number): Promise<TSPayments | undefined> => {
    const payment = await db.query.paymentsTable.findFirst({
        where: eq(paymentsTable.payment_id, payment_id),
    });
    return payment;
};

// Create payment
export const createPaymentService = async (payment: TIPayments): Promise<string> => {
    await db.insert(paymentsTable).values({
        ...payment,
        transaction_reference: payment.transaction_reference ?? "", // ✅ Ensure session_id is stored
        payment_status: "pending", // ✅ Default status
    });
    return "Payment created successfully";
};



// Update paymentexport const updatePaymentService = async (payment_id: number, payment: Partial<TIPayments>): Promise<string> => {
    export const updatePaymentService = async (payment_id: number, payment: Partial<TIPayments>): Promise<string> => {
    await db.update(paymentsTable).set(payment).where(eq(paymentsTable.payment_id, payment_id));
    return "Payment updated successfully";
};

// Delete payment
export const deletePaymentService = async (payment_id: number): Promise<string> => {
    await db.delete(paymentsTable).where(eq(paymentsTable.payment_id, payment_id));
    return "Payment deleted successfully";
};
