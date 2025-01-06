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
    vehicle_id: number; //#number or string
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


export const bookingVehicleAPI = createApi({
    reducerPath: 'bookingVehicleAPI',
    baseQuery: fetchBaseQuery({ baseUrl: ApiDomain }),
    tagTypes: ['bookingVehicle'],
    endpoints: (builder) => ({
        getBookingVehicle: builder.query<Tbooking[], void>({
            query: () => 'bookings',
            providesTags: ['bookingVehicle'],
        }),
        createBookingVehicle: builder.mutation({
            query: (newBooking) => ({
                url: 'bookings',
                method: 'POST',
                body: newBooking,
            }),
            invalidatesTags: ['bookingVehicle'],
        }),
        updateBookingVehicle: builder.mutation<Tbooking, Partial<Tbooking & { user_id: number }>>({
            query: ({ user_id, ...rest }) => ({
                url: `bookings/${user_id}`,
                method: 'PUT',
                body: rest,
            }),
            invalidatesTags: ['bookingVehicle'],
        }),
        deleteBookingVehicle: builder.mutation<{ success: boolean; user_id: number }, number>({
            query: (user_id) => ({
                url: `bookings/${user_id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['bookingVehicle'],
        }),
        getUserBooking: builder.query<Tbooking[], number>({
            query: (user_id) => `bookings/${user_id}`,
        }),
    }),
});

// export const { useGetBookingVehicleQuery, useCreateBookingVehicleMutation, useUpdateBookingVehicleMutation, useDeleteBookingVehicleMutation, useGetUserBookingQuery } = bookingVehicleAPI;