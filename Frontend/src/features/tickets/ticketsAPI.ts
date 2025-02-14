import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CustomerTickets } from '../../types/types';
import { ApiDomain } from '../../utils/ApiDomain';

export const ticketAPI = createApi({
  reducerPath: 'ticketsApi',
  baseQuery: fetchBaseQuery({ baseUrl: ApiDomain }),
  tagTypes: ['Tickets'],
  endpoints: (builder) => ({
    getTickets: builder.query<CustomerTickets[], void>({
      query: () => '/tickets',
      providesTags: ['Tickets'],
    }),
    // Change the hook name to 'useGetTicketByIdQuery'
    getTicketById: builder.query<CustomerTickets, number>({
      query: (id) => `tickets/${id}`,
      providesTags: [{ type: 'Tickets', id: 'LIST' }],
    }),
    addTicket: builder.mutation<CustomerTickets, Partial<CustomerTickets>>({
      query: (newTickets) => ({
        url: '/customer-support',
        method: 'POST',
        body: newTickets,
      }),
      invalidatesTags: [{ type: 'Tickets', id: 'LIST' }],
    }),
    updateTicket: builder.mutation<CustomerTickets, { id: number, updatedTicket: CustomerTickets }>({
      query: ({ id, updatedTicket }) => ({
        url: `/customer-support/${id}`,
        method: 'PUT',
        body: updatedTicket,
      }),
      invalidatesTags: [{ type: 'Tickets', id: 'LIST' }],
    }),
    deleteTicket: builder.mutation<void, number>({
      query: (id) => ({
        url: `/customer-support/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Tickets', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetTicketsQuery,
  useGetTicketByIdQuery,  // Updated hook name here
  useAddTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
} = ticketAPI;
