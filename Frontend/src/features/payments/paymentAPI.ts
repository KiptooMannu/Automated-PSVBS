import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";

export interface TPayment {
  booking_id: number;
  amount: string;
  payment_method: string;
  transaction_reference: string;
  payment_id?: number;
  created_at?: Date | null;
  updated_at?: Date | null;
  payment_status?: "pending" | "completed" | "failed" | "refunded" | null | undefined | string;  // ✅ Allow direct strings
  payment_date?: Date | null;
}

export const paymentAPI = createApi({
  reducerPath: 'paymentAPI',
  baseQuery: fetchBaseQuery({ baseUrl: ApiDomain }),
  tagTypes: ['payment'],
  endpoints: (builder) => ({
    getPayment: builder.query<TPayment[], void>({
      query: () => 'checkout-session',
      providesTags: ['payment'],
    }),
    createPayment: builder.mutation({
      query: (newPayment) => ({
        url: 'checkout-session',
        method: 'POST',
        body: newPayment,
      }),
      invalidatesTags: ['payment'],
    }),
    updatePayment: builder.mutation<TPayment, Partial<TPayment & { booking_id: number }>>({
      query: ({ booking_id, ...rest }) => ({
        url: `checkout-session/${booking_id}`,
        method: 'PUT',
        body: rest,
      }),
      invalidatesTags: ['payment'],
    }),
    deletePayment: builder.mutation<{ success: boolean; booking_id: number }, number>({
      query: (booking_id) => ({
        url: `checkout-session/${booking_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['payment'],
    }),
    getBookingPayment: builder.query<TPayment, number>({
      query: (booking_id) => `checkout-session/booking/${booking_id}`,
    }),
    getPaymentByBookingId: builder.query<TPayment, number>({
      query: (booking_id) => `paymentbybooking/${booking_id}`,
    }),
  }),
});

export const {
  useCreatePaymentMutation,
  useGetPaymentByBookingIdQuery
} = paymentAPI