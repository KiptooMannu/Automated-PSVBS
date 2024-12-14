import { Hono } from 'hono';
import { getAllTickets, getTicketById, createTicket, updateTicket, deleteTicket } from './Ticketing.controller';

const app = new Hono();

app.get('/tickets', getAllTickets);
app.get('/tickets/:id', getTicketById);
app.post('/tickets', createTicket);
app.put('/tickets/:id', updateTicket);
app.delete('/tickets/:id', deleteTicket);

export default app;
