import { Hono } from "hono";
import {
  getAllPaymentsController,
  getPaymentByIdController,
  createPaymentController,
  updatePaymentController,
  deletePaymentController,
} from "./Payment.Controller";
import { stkPush, mpesaCallback } from "./mpesa.service"; 

export const paymentRouter = new Hono();


paymentRouter.get("/payments", getAllPaymentsController); 
paymentRouter.get("/payments/:id", getPaymentByIdController); 
paymentRouter.post("/payments", createPaymentController); 
paymentRouter.put("/payments/:id", updatePaymentController); 
paymentRouter.delete("/payments/:id", deletePaymentController); 


paymentRouter.post("/mpesa/stkpush", stkPush); 
paymentRouter.post("/mpesa/callback", mpesaCallback); 

export default paymentRouter;
