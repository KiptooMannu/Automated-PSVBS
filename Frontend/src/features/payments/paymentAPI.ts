import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain"; // Base URL

export interface TPayment {
  booking_id: number;
  amount: string;
  phone_number: string; // ✅ For M-Pesa
  payment_method: string;
  transaction_reference: string;
  payment_id?: number;
  created_at?: Date | null;
  updated_at?: Date | null;
  payment_status?: "pending" | "completed" | "failed" | "refunded" | null | undefined | string;
  payment_date?: Date | null;
}

export const paymentAPI = createApi({
  reducerPath: "paymentAPI",
  baseQuery: fetchBaseQuery({ baseUrl: ApiDomain }), // ✅ Uses the correct API base URL
  tagTypes: ["payment"],
  endpoints: (builder) => ({
    // ✅ Get all payments
    getPayments: builder.query<TPayment[], void>({
      query: () => "payments",
      providesTags: ["payment"],
    }),

    // ✅ Get payment by booking ID
    getPaymentByBookingId: builder.query<TPayment, number>({
      query: (booking_id) => `payments/${booking_id}`,
    }),

    // ✅ Create a new payment (General)
    createPayment: builder.mutation<TPayment, Partial<TPayment>>({
      query: (newPayment) => ({
        url: "payments",
        method: "POST",
        body: newPayment,
      }),
      invalidatesTags: ["payment"],
    }),

    // ✅ Initiate M-Pesa Payment (STK Push)
    initiateMpesaPayment: builder.mutation<{ message: string; payment: TPayment }, Partial<TPayment>>({
      query: ({ phone_number, amount, booking_id }) => ({
        url: "mpesa/stkpush", // ✅ Matches the backend route
        method: "POST",
        body: { phone_number, amount, booking_id },
      }),
      invalidatesTags: ["payment"],
    }),

    // ✅ Update payment (e.g., mark as completed)
    updatePayment: builder.mutation<TPayment, Partial<TPayment & { booking_id: number }>>({
      query: ({ booking_id, ...rest }) => ({
        url: `payments/${booking_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["payment"],
    }),

    // ✅ Delete a payment
    deletePayment: builder.mutation<{ success: boolean; booking_id: number }, number>({
      query: (booking_id) => ({
        url: `payments/${booking_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["payment"],
    }),
  }),
});

export const {
  useCreatePaymentMutation,
  useInitiateMpesaPaymentMutation, // ✅ M-Pesa STK Push Mutation
  useGetPaymentByBookingIdQuery,
} = paymentAPI;
