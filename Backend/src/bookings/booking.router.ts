// booking.router.ts
import { Hono } from "hono";
import { 
  getAllBookingsController, 
  getBookingByIdController, 
  createBookingController, 
  updateBookingController, 
  deleteBookingController 
} from "./booking.controller";

// Create Hono app instance
const bookingRouter = new Hono();

// Define routes
bookingRouter
  .get("/bookings", getAllBookingsController)          // Route to get all bookings
  .get("/bookings/:id", getBookingByIdController)      // Route to get a specific booking by ID
  .post("/bookings", createBookingController)          // Route to create a new booking
  .put("/bookings/:id", updateBookingController)       // Route to update a booking
  .delete("/bookings/:id", deleteBookingController);   // Route to delete a booking

// Export the app
export default bookingRouter;
