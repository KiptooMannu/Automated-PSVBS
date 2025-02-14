import { Hono } from "hono";
import { 
  createBookingController, 
  getBookedSeatsController, 
  getAllVehiclesWithBookingsController,
  getAllBookingsController, // ✅ Added missing route for fetching all bookings
  getUserBookingsByUserIdController ,// ✅ Added missing route for fetching bookings by user ID
  confirmBookingController
} from "./bookings.controller";  // Ensure this import is correct

// Create Hono app instance
const bookingRouter = new Hono();

// Define routes
bookingRouter
  .post("/bookings", createBookingController)            // ✅ Create a new booking
  .get("/bookings", getAllBookingsController)           // ✅ Fetch all bookings
  .get("/booked-seats", getBookedSeatsController)        // ✅ Fetch booked seats
  .get("/vehicles-with-bookings", getAllVehiclesWithBookingsController)// ✅ Fetch vehicles with departure date & time
  .get("/bookings/user/:id", getUserBookingsByUserIdController) // ✅ Fetch user bookings by user ID
  .post("/bookings/confirm", confirmBookingController);

// Export the app
export default bookingRouter;
