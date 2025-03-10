import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";

export interface Vehicle {
  vehicle_id: string;
  departure_time: string; 
}

export interface Payment {
  amount: number;
  payment_id: number;
  payment_date: string;
  payment_method: string;
  payment_status: string;
  transaction_reference: string;
}

export interface Tbooking {
  booking_id: number;
  user_id: number;
  vehicle_id: string;
  seat_id: number | null;
  booking_date: string;
  vehicle?: Vehicle; 
  departure: string;
  departure_time:string;
  destination: string;
  total_price: number;
  departure_date: string;
  estimated_arrival: string;
  mpesa_receipt_number:string;
  payment_method:string;
  price: number;
  booking_status: string;
  is_active: string;
  seat_ids: number;
  payment_status:string;
  payments: Payment[];
}

export enum TagTypes {
  BookingVehicle = "bookingVehicle",
}

export const bookingVehicleAPI = createApi({
  reducerPath: "bookingVehicleAPI",
  baseQuery: fetchBaseQuery({ baseUrl: ApiDomain }),
  tagTypes: [TagTypes.BookingVehicle],
  endpoints: (builder) => ({
    getBookingVehicle: builder.query<Tbooking[], void>({
      query: () => "/bookings",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ booking_id }) => ({
                type: TagTypes.BookingVehicle,
                id: booking_id,
              } as const)),
              { type: TagTypes.BookingVehicle, id: "LIST" },
            ]
          : [{ type: TagTypes.BookingVehicle, id: "LIST" }],
    }),

    createBookingVehicle: builder.mutation<Tbooking, Partial<Tbooking>>({
      query: (newBooking) => ({
        url: "/bookings",
        method: "POST",
        body: {
          ...newBooking,
          departure_time: newBooking.vehicle?.departure_time || "",
        },
      }),
      invalidatesTags: [{ type: TagTypes.BookingVehicle, id: "LIST" }],
    }),

    updateBookingVehicle: builder.mutation<Tbooking, Partial<Tbooking & { booking_id: number }>>({
      query: ({ booking_id, ...rest }) => ({
        url: `/bookings/${booking_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: (_, __, { booking_id }) => [{ type: TagTypes.BookingVehicle, id: booking_id }],
    }),

    deleteBookingVehicle: builder.mutation<{ success: boolean; booking_id: number }, number>({
      query: (booking_id) => ({
        url: `/bookings/${booking_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, booking_id) => [{ type: TagTypes.BookingVehicle, id: booking_id }],
    }),

    getUserBooking: builder.query<Tbooking[], number>({
      query: (user_id) => `/bookings/user/${user_id}`,
      providesTags: (_, __, user_id) => [{ type: TagTypes.BookingVehicle, id: user_id }],
    }),

    confirmBooking: builder.mutation<{ success: boolean; booking_id: number }, { booking_id: number }>({
      query: ({ booking_id }) => ({
        url: `/bookings/confirm`,
        method: "POST",
        body: { booking_id },
      }),
    }),
  }),
});

export const {
  useGetBookingVehicleQuery,
  useCreateBookingVehicleMutation,
  useUpdateBookingVehicleMutation,
  useDeleteBookingVehicleMutation,
  useGetUserBookingQuery,
  useConfirmBookingMutation,
} = bookingVehicleAPI;
