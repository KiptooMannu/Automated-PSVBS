import  db  from "../drizzle/db";
import { TITickets, TSTickets, ticketTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// Get all tickets
export const getAllTickets = async (): Promise<TSTickets[] | null> => {
  const tickets = await db.query.ticketTable.findMany();
  return tickets;
};

// Get ticket by ID
export const getTicketById = async (ticket_id: number): Promise<TSTickets | undefined> => {
  const ticket = await db.query.ticketTable.findFirst({
    where: eq(ticketTable.ticket_id, ticket_id),
  });
  return ticket;
};

// Create ticket
export const createTicket = async (ticket: TITickets): Promise<string> => {
  await db.insert(ticketTable).values(ticket);
  return "Ticket created successfully";
};

// Update ticket
export const updateTicket = async (ticket_id: number, ticket: TITickets): Promise<string> => {
  await db.update(ticketTable).set(ticket).where(eq(ticketTable.ticket_id, ticket_id));
  return "Ticket updated successfully";
};

// Delete ticket
export const deleteTicket = async (ticket_id: number): Promise<string> => {
  await db.delete(ticketTable).where(eq(ticketTable.ticket_id, ticket_id));
  return "Ticket deleted successfully";
};

// getticket by user id and email