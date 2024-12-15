// booking.router.ts
import { Context, Hono, Next} from "hono";
import { 
  getAllBookingsController, 
  getBookingByIdController, 
  createBookingController, 
  updateBookingController, 
  deleteBookingController 
} from "./bookings.controller";

import { 
  userRoleAuth,
  adminRoleAuth
 } from "../middleware/bearAuth";

// Create Hono app instance
const bookingRouter = new Hono();

// Define middleware to check user role
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

// Define routes
bookingRouter
  .get("/bookings", getAllBookingsController)          // Route to get all bookings
  .get("/bookings/:id", getBookingByIdController)      // Route to get a specific booking by ID
  .post("/bookings", createBookingController)          // Route to create a new booking
  .put("/bookings/:id", updateBookingController)       // Route to update a booking
  .delete("/bookings/:id", deleteBookingController);   // Route to delete a booking

// Export the app
export default bookingRouter;
