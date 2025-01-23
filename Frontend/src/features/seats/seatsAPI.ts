import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";

interface Seats {
    seat_id: number;
    vehicle_id: string;
    seat_number: number;
    seat_type: string;
    is_available: string;
    created_at: string;
    updated_at: string;
}

export const seatAPI = createApi({
    reducerPath: 'seatAPI',
    baseQuery: fetchBaseQuery({ baseUrl: ApiDomain }),
    tagTypes: ['seat'],
    endpoints: (build) => ({
        getSeats: build.query<Seats[], void>({
            query: () => 'seats',
            providesTags: ['seat'],
        }),
        createSeat: build.mutation<Seats, Partial<Seats>>({
            query: (newSeat) => ({
                url: 'seats',
                method: 'POST',
                body: newSeat,
            }),
            invalidatesTags: ['seat'],
        }),
        updateSeat: build.mutation<Seats, Partial<Seats & { seat_id: number }>>({
            query: ({ seat_id, ...rest }) => ({
                url: `seats/${seat_id}`,
                method: 'PUT',
                body: rest,
            }),
            invalidatesTags: ['seat'],
        }),
        deleteSeat: build.mutation<{ success: boolean; seat_id: number }, number>({
            query: (seat_id) => ({
                url: `seats/${seat_id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['seat'],
        }),
        getSeatById: build.query<Seats, number>({
            query: (seat_id) => `seats/${seat_id}`,
            providesTags: ['seat'],
        }),
    }),
});

export const {
    useGetSeatsQuery,
    useCreateSeatMutation,
    useUpdateSeatMutation,
    useDeleteSeatMutation,
    useGetSeatByIdQuery,
} = seatAPI;