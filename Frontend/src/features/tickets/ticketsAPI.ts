import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";

interface Tickets {
    ticket_id: number;
    user_id: number;
    subject: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
}

interface TPayment {
    booking_id: number;
    amount: string;
    payment_status: string;
    payment_date: string;
    payment_method: string;
    transaction_reference: string;
    ticket_id: number;
    created_at: string;
    updated_at: string;
}

export const ticketAPI = createApi({
    reducerPath: 'ticketAPI',
    baseQuery: fetchBaseQuery({ baseUrl: ApiDomain }),
    tagTypes: ['ticket'],
    endpoints: (builder) => ({
        getTickets: builder.query<Tickets[], void>({
            query: () => 'tickets',
            providesTags: ['ticket'],
        }),
        createTicket: builder.mutation({
            query: (newTicket) => ({
                url: 'tickets',
                method: 'POST',
                body: newTicket,
            }),
            invalidatesTags: ['ticket'],
        }),
        updateTicket: builder.mutation<Tickets, Partial<Tickets & { ticket_id: number }>>({
            query: ({ ticket_id, ...rest }) => ({
                url: `tickets/${ticket_id}`,
                method: 'PUT',
                body: rest,
            }),
            invalidatesTags: ['ticket'],
        }),
        deleteTicket: builder.mutation<{ success: boolean; ticket_id: number }, number>({
            query: (ticket_id) => ({
                url: `tickets/${ticket_id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['ticket'],
        }),
        getTicketById: builder.query<Tickets, number>({
            query: (ticket_id) => `tickets/${ticket_id}`,
        }),
    }),
});
