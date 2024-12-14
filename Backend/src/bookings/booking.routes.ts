<<<<<<< HEAD
// booking.router.ts
import { Hono } from "hono";
import { getAllBookingsController, getBookingByIdController, createBookingController, updateBookingController, deleteBookingController } from "./bookings.controllers";

// Create Hono app instance
const app = new Hono();

// Define routes
app.get("/bookings", getAllBookingsController); // Route to get all bookings
app.get("/bookings/:id", getBookingByIdController); // Route to get a specific booking by ID
app.post("/bookings", createBookingController); // Route to create a new booking
app.put("/bookings/:id", updateBookingController); // Route to update a booking
app.delete("/bookings/:id", deleteBookingController); // Route to delete a booking

// Export the app
export default app;
=======
import { Context, Hono, Next } from "hono";
import { createBooking, getAllBookings, getBookingsByUserId, cancelBooking } from "./booking.controllers";
import { userRoleAuth,adminRoleAuth } from "../middleware/bearAuth";

export const bookingRoutes = new Hono();
    const roleAuthChain = (...middlewares: any) => {
        return async (c: Context, next: Next) => {
            for (const middleware of middlewares) {
                let isAuthorized = false;
    
                // Middleware runs, and if it authorizes, it sets `isAuthorized` to true
                await middleware(c, async () => {
                    isAuthorized = true;
                });
    
                if (isAuthorized) {
                    return next(); // Authorized, proceed to next handler
                }
            }
    
            // If no middleware authorizes the user, return 401
            return c.json({ error: "Unauthorized" }, 401);
        };
    };
    //create booking for a user
    bookingRoutes.post("/booking", roleAuthChain(userRoleAuth), createBooking);
    // get all booking for a user
    bookingRoutes.get("/booking", roleAuthChain(adminRoleAuth), getAllBookings);
    // get all booking for a user by id
    bookingRoutes.get("/booking/:user_id", roleAuthChain(adminRoleAuth,userRoleAuth), getBookingsByUserId);
    // cancel booking by id
    bookingRoutes.delete("/booking/:booking_id", roleAuthChain(adminRoleAuth,userRoleAuth), cancelBooking);
>>>>>>> d68585f9c88dc1520fad873c9ee7e1fb0613f77e
