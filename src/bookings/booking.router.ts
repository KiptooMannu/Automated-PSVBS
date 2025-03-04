import { Hono } from 'hono';
import {
    createBookingController,
    getBookedSeatsController,
    getAllVehiclesWithBookingsController,
    getAllBookingsController,
    confirmBookingController,
    getBookingsByUserIdController, 
  
} from './bookings.controller';

const bookingRouter = new Hono();

// ✅ Create a new booking
bookingRouter.post('/bookings', createBookingController);

// ✅ Get booked seats for a specific vehicle
bookingRouter.get('/bookings/seats', getBookedSeatsController);

// ✅ Get all vehicles with bookings
bookingRouter.get('/bookings/vehicles', getAllVehiclesWithBookingsController);

// ✅ Get all bookings
bookingRouter.get('/bookings', getAllBookingsController);

// ✅ Get bookings by user ID
bookingRouter.get('/bookings/user/:user_id', getBookingsByUserIdController);

// ✅ Confirm a booking
bookingRouter.put('/bookings/confirm', confirmBookingController);

bookingRouter.get("/booked-seats", getBookedSeatsController)

export default bookingRouter;
