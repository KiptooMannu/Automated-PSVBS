import { Hono } from 'hono';
import "dotenv/config";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { readFile } from 'fs/promises';
import  assert from 'assert' 
import { userAuthRouter } from './auth/auth.router';
import { paymentRouter } from './payments/Payment.Router';  // from main
import TicketingRouter from './Ticketing/Ticketing.Router';  // from main
import bookingRouter from './bookings/booking.router';  // decide the correct file name
import vehicleRouter from './vehicle/vehicle.routes';  // from origin/main
import seatRouter from './seat/seat.route';  // from origin

// analytics, reports etc
const app = new Hono();

app.use('*', cors());


// All routes

app.notFound((c) => {
    return c.text('Route Not Found 😊', 404)
})
// all routes

app.route('/', userAuthRouter);
app.route('/', bookingRouter);  // Ensure this is correct (check file name or structure)
app.route('/', paymentRouter);  // from main
app.route('/', TicketingRouter);  // from main
app.route('/', vehicleRouter);  // from origin/main
app.route('/', seatRouter);  // from origin

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
