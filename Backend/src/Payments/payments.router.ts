import { Hono } from 'hono';
import { getAllPaymentsController, getPaymentByIdController, createPaymentController, updatePaymentController, deletePaymentController, createCheckoutSessionController } from './payments.controller';

export const paymentRouter = new Hono();

paymentRouter
    .get("/payments", getAllPaymentsController)
    .get("/payments/:id", getPaymentByIdController)
    .post("/payments", createPaymentController)
    .put("/payments/:id", updatePaymentController)
    .delete("/payments/:id", deletePaymentController)
    .post("/checkout-session", createCheckoutSessionController);

export default paymentRouter;