import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";

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
  vehicle_id: number;
  seat_id: number;
  departure: string;
  destination: string;
  departure_date: string;
  departure_time: string;
  estimated_arrival: string;
  price: number;
  total_price: number;
  booking_date: string;
  booking_status: string;
  is_active: string;
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
    // Fetch all bookings with pagination
    getBookingVehicle: builder.query<{ data: Tbooking[]; total: number }, { page: number; pageSize: number }>({
      query: ({ page, pageSize }) => `bookings?page=${page}&pageSize=${pageSize}`,
      providesTags: [TagTypes.BookingVehicle],
    }),
    // Create a new booking
    createBookingVehicle: builder.mutation<Tbooking, Partial<Tbooking>>({
      query: (newBooking) => ({
        url: "bookings",
        method: "POST",
        body: newBooking,
      }),
      invalidatesTags: [TagTypes.BookingVehicle],
    }),
    // Update a booking
    updateBookingVehicle: builder.mutation<Tbooking, Partial<Tbooking & { user_id: number }>>({
      query: ({ user_id, ...rest }) => ({
        url: `bookings/${user_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: [TagTypes.BookingVehicle],
    }),
    // Delete a booking
    deleteBookingVehicle: builder.mutation<{ success: boolean; user_id: number }, number>({
      query: (user_id) => ({
        url: `bookings/${user_id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.BookingVehicle],
    }),
    // Fetch user-specific bookings
    getUserBooking: builder.query<Tbooking[], number>({
      query: (user_id) => `bookings/${user_id}`,
      providesTags: (result, error, user_id) => [{ type: TagTypes.BookingVehicle, id: user_id }],
    }),
  }),
});

export const {
  useGetBookingVehicleQuery,
  useCreateBookingVehicleMutation,
  useUpdateBookingVehicleMutation,
  useDeleteBookingVehicleMutation,
  useGetUserBookingQuery,
} = bookingVehicleAPI;

//============================================================================================================
// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { ApiDomain } from "../../utils/ApiDomain";

// export interface Payment {
//   amount: number;
//   payment_id: number;
//   payment_date: string;
//   payment_method: string;
//   payment_status: string;
//   transaction_reference: string;
// }

// export interface Tbooking {
//   booking_id: number;
//   user_id: number;
//   vehicle_id: number;
//   seat_id: number;
//   departure: string;
//   destination: string;
//   departure_date: string;
//   departure_time: string;
//   estimated_arrival: string;
//   price: number;
//   total_price: number;
//   booking_date: string;
//   booking_status: string;
//   is_active: string;
//   payments: Payment[];
// }

// export enum TagTypes {
//   BookingVehicle = "bookingVehicle",
// }

// export const bookingVehicleAPI = createApi({
//   reducerPath: "bookingVehicleAPI",
//   baseQuery: fetchBaseQuery({ baseUrl: ApiDomain }), // Assuming ApiDomain is set to the correct base URL
//   tagTypes: [TagTypes.BookingVehicle],
//   endpoints: (builder) => ({
//     // Fetch all bookings (no pagination)
//     getBookingVehicle: builder.query<Tbooking[], void>({
//       query: () => "bookings", // Remove pagination parameters
//       providesTags: (result) =>
//         result
//           ? [
//               ...result.map(({ booking_id }) => ({ type: TagTypes.BookingVehicle, id: booking_id } as const)),
//               { type: TagTypes.BookingVehicle, id: "LIST" },
//             ]
//           : [{ type: TagTypes.BookingVehicle, id: "LIST" }],
//     }),
//     // Create a new booking
//     createBookingVehicle: builder.mutation<Tbooking, Partial<Tbooking>>({
//       query: (newBooking) => ({
//         url: "bookings",
//         method: "POST",
//         body: newBooking,
//       }),
//       invalidatesTags: [{ type: TagTypes.BookingVehicle, id: "LIST" }],
//     }),
//     // Update a booking
//     updateBookingVehicle: builder.mutation<Tbooking, Partial<Tbooking & { booking_id: number }>>({
//       query: ({ booking_id, ...rest }) => ({
//         url: bookings/${booking_id},
//         method: "PUT",
//         body: rest,
//       }),
//       invalidatesTags: (, _, { booking_id }) => [{ type: TagTypes.BookingVehicle, id: booking_id }],
//     }),
//     // Delete a booking
//     deleteBookingVehicle: builder.mutation<{ success: boolean; booking_id: number }, number>({
//       query: (booking_id) => ({
//         url: bookings/${booking_id},
//         method: "DELETE",
//       }),
//       invalidatesTags: (, _, booking_id) => [{ type: TagTypes.BookingVehicle, id: booking_id }],
//     }),
//     // Fetch user-specific bookings
//     getUserBooking: builder.query<Tbooking[], number>({
//       query: (user_id) => bookings/user/${user_id},
//       providesTags: (, _, user_id) => [{ type: TagTypes.BookingVehicle, id: user_id }],
//     }),
//   }),
// });

// export const {
//   useGetBookingVehicleQuery,
//   useCreateBookingVehicleMutation,
//   useUpdateBookingVehicleMutation,
//   useDeleteBookingVehicleMutation,
//   useGetUserBookingQuery,
// } = bookingVehicleAPI;