import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";

// Define Payment Interface
export interface Payment {
  amount: number;
  payment_id: number;
  payment_date: string;
  payment_method: string;
  payment_status: string;
  transaction_reference: string;
}

// Define Booking Interface
export interface Tbooking {
  booking_id: number;
  user_id: number;
  vehicle_id: string;
  seat_id: number | null;
  booking_date: string;
  departure_time: string;
  departure: string;
  destination: string;
  total_price: number;
  departure_date: string;
  estimated_arrival: string;
  price: number;
  booking_status: string;
  is_active: string;
  seat_ids: number;
  payments: Payment[];
}

// Define Tag Types
export enum TagTypes {
  BookingVehicle = "bookingVehicle",
}

// API Definition
export const bookingVehicleAPI = createApi({
  reducerPath: "bookingVehicleAPI",
  baseQuery: fetchBaseQuery({ baseUrl: ApiDomain }),
  tagTypes: [TagTypes.BookingVehicle],
  endpoints: (builder) => ({
    // ✅ Fetch all bookings
    getBookingVehicle: builder.query<Tbooking[], void>({
      query: () => "bookings",
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

    // ✅ Create a booking
    createBookingVehicle: builder.mutation<Tbooking, Partial<Tbooking>>({
      query: (newBooking) => ({
        url: "bookings",
        method: "POST",
        body: {
          ...newBooking,
          departure_time: newBooking.departure_time || "", // ✅ Ensure departure_time is passed
        },
      }),
      invalidatesTags: [{ type: TagTypes.BookingVehicle, id: "LIST" }],
    }),

    // ✅ Update a booking
    updateBookingVehicle: builder.mutation<Tbooking, Partial<Tbooking & { booking_id: number }>>({
      query: ({ booking_id, ...rest }) => ({
        url: `bookings/${booking_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: (_, __, { booking_id }) => [{ type: TagTypes.BookingVehicle, id: booking_id }],
    }),

    // ✅ Delete a booking
    deleteBookingVehicle: builder.mutation<{ success: boolean; booking_id: number }, number>({
      query: (booking_id) => ({
        url: `bookings/${booking_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, booking_id) => [{ type: TagTypes.BookingVehicle, id: booking_id }],
    }),

    // ✅ Fetch bookings for a specific user
    getUserBooking: builder.query<Tbooking[], number>({
      query: (user_id) => `bookings/user/${user_id}`,
      providesTags: (_, __, user_id) => [{ type: TagTypes.BookingVehicle, id: user_id }],
    }),

    confirmBooking: builder.mutation<{ success: boolean; booking_id: number }, { booking_id: number }>({
      query: ({ booking_id }) => ({
        url: `bookings/confirm`, // ✅ Correct endpoint
        method: "POST",
        body: { booking_id }, // ✅ Send booking_id in the request body
      }),
    }),
    
  }),
});

// Export Hooks for Components
export const {
  useGetBookingVehicleQuery,
  useCreateBookingVehicleMutation,
  useUpdateBookingVehicleMutation,
  useDeleteBookingVehicleMutation,
  useGetUserBookingQuery,
  useConfirmBookingMutation, // ✅ Now this exists
} = bookingVehicleAPI;
