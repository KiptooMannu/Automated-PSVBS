import { Hono } from 'hono';
import { 
  getAllTickets, 
  getTicketById, 
  createTicket, 
  updateTicket, 
  deleteTicket 
} from './Ticketing.controller';

export const TicketingRouter = new Hono();

TicketingRouter
  .get('/tickets', getAllTickets)
  .get('/tickets/:id', getTicketById)
  .post('/tickets', createTicket)
  .put('/tickets/:id', updateTicket)
  .delete('/tickets/:id', deleteTicket);

export default TicketingRouter;
