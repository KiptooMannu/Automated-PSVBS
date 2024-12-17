import { Hono } from 'hono';
import "dotenv/config";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { readFile } from 'fs/promises';
import  assert from 'assert' 
import { userAuthRouter } from './auth/auth.router';
import { paymentRouter } from './Payments/payments.router';
import TicketingRouter from './Ticketing/Ticketing.Router';
import bookingRouter from './bookings/booking.router';
import vehicleRouter from './vehicle/vehicle.routes';
import seatRouter from './seat/seat.route';

// analytics, reports etc
const app = new Hono();

app.use('*', cors());

app.notFound((c) => {
    return c.text('Route Not Found 😊', 404)
})
// all routes
app.route('/', userAuthRouter);
app.route('/', paymentRouter);
app.route('/', TicketingRouter);
app.route('/', bookingRouter);
app.route('/', vehicleRouter);
app.route('/',seatRouter);

// default route
app.get('/', async (c) => {
    // return c.json({ message: '🌟 Welcome to my API! 🚀' });
    try {
        let html = await readFile('./index.html', 'utf-8');
        return c.html(html);
    } catch (err:any) {
        return c.text(err.message, 500);
    }
});

serve({
    fetch: app.fetch,
    port: Number(process.env.PORT)
});

console.log('Routes registered:', app.routes);
console.log(`Server is running🚀 on http://localhost:${process.env.PORT} 🌍🎉`);

assert(process.env.PORT, 'PORT is required');
