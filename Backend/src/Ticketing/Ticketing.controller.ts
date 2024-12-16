import { Context } from 'hono';
import {
  getAllTickets as getAllTicketsService,
  getTicketById as getTicketByIdService,
  createTicket as createTicketService,
  updateTicket as updateTicketService,
  deleteTicket as deleteTicketService,
} from './Ticketing.Service';

export const getAllTickets = async (c: Context) => {
  try {
    const tickets = await getAllTicketsService();
    return c.json(tickets, 200);
  } catch (error) {
    return c.json({ message: 'Error fetching tickets', error }, 500);
  }
};

export const getTicketById = async (c: Context) => {
  try {
    const ticket = await getTicketByIdService(Number(c.req.param('id')));
    if (ticket) {
      return c.json(ticket, 200);
    } else {
      return c.json({ message: 'Ticket not found' }, 404);
    }
  } catch (error) {
    return c.json({ message: 'Error fetching ticket', error }, 500);
  }
};

export const createTicket = async (c: Context) => {
  try {
    const newTicket = await createTicketService(await c.req.json());
    return c.json(newTicket, 201);
  } catch (error) {
    return c.json({ message: 'Error creating ticket', error }, 500);
  }
};

export const updateTicket = async (c: Context) => {
  try {
    const updatedTicket = await updateTicketService(Number(c.req.param('user_id')), await c.req.json());
    if (updatedTicket) {
      return c.json(updatedTicket, 200);
    } else {
      return c.json({ message: 'Ticket not found' }, 404);
    }
  } catch (error) {
    return c.json({ message: 'Error updating ticket', error }, 500);
  }
};

export const deleteTicket = async (c: Context) => {
  try {
    await deleteTicketService(Number(c.req.param('id')));
    return c.text('Ticket deleted', 204);
  } catch (error) {
    return c.json({ message: 'Error deleting ticket', error }, 500);
  }
};