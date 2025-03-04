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
//create ticket✅
export const createTicket = async (c: Context) => {
  try{
    const ticket = await c.req.json();
    const createdTicket = await createTicketService(ticket);
    if (createdTicket === undefined) return c.json({msg:"Ticket not created 😒 "}, 400);
    return c.json(createdTicket, 201);        
} catch (error: any) {
    return c.text(error?.message, 400);
}
}

//update ticket by ticket_id
export const updateTicket = async (c: Context) => {
  const ticketId = Number(c.req.param('id'));
  try{
    if(!ticketId) return c.text("Invalid ticket id😒", 400);
    const ticket = await getTicketByIdService(ticketId);
    if(ticket===undefined) return c.json({message: "No ticket found for this ticket id😒"},404);
    const updatedTicket = await updateTicketService(ticketId, await c.req.json());
    if (updatedTicket === undefined) return c.json({msg:"Ticket not updated 😒 "}, 400);
    return c.json(updatedTicket, 200);
  } catch(error){
    return c.json({msg:"Error while updating ticket😒"})
  }
}


//delete/cancel ticket by ticket_id
export const deleteTicket = async (c: Context) => {
  const ticketId = Number(c.req.param('id'));
  try{
    if(!ticketId) return c.text("Invalid ticket id", 400);
    const ticket = await getTicketByIdService(ticketId);
    if(ticket===undefined) return c.json({message: "No ticket found for this ticket id😒"},404);
    const deletedTicket = await deleteTicketService(ticketId);
    if (deletedTicket === undefined) return c.json({msg:"Ticket not deleted 😒 "}, 400);
    return c.json({msg:deletedTicket}, 200);
  } catch(error){
    return c.json({msg:"Error while deleting ticket😒"})
  }
}
//send ticket to user as email
export const sendTicketAsEmail = async (c: Context) => {
  

};