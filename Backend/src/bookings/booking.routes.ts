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
