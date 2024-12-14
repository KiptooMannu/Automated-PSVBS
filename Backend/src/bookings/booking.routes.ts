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