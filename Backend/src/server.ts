import {Hono} from 'hono';
import "dotenv/config";
import {serve} from "@hono/node-server";
import {cors} from "hono/cors";
import { userAuthRouter } from './auth/auth.router';
import { bookingRoutes } from './bookings/booking.routes';

// analytics, reports etc
const app = new Hono();

app.use('*',cors());
//all routes
app.route('/',userAuthRouter);
app.route('/',bookingRoutes);

app.get('/',async(c)=>{
    return c.json({ message: '🌟 Welcome to my API! 🚀' });

});

serve({
    fetch: app.fetch,
    port: Number(process.env.PORT)
})

console.log(`Server is running🚀 on http://localhost:${process.env.PORT} 🌍🎉`)