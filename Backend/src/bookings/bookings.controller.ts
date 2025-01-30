import { Context } from 'hono';
import { 
    createBookingService,
    getAllBookingsService,
    getBookingByIdService,
    updateBookingService,
    deleteBookingService
} from './booking.service';

// Create booking controller
export const createBookingController = async (c: Context) => {
    try {
        const { 
            user_id, 
            vehicle_id, 
            seat_ids, 
            departure_date, 
            departure_time, 
            estimated_arrival,
            price, 
            total_price
        } = await c.req.json();

        // Ensure all required fields are provided
        if (!user_id || !vehicle_id || !seat_ids?.length || !price || !total_price) {
            return c.json({ message: "Missing required booking details." }, 400);
        }

        // Call the service to create the booking
        const result = await createBookingService({
            user_id,
            vehicle_id,
            seat_ids,
            departure_date,
            departure_time,
            estimated_arrival,
            price,
            total_price,
        });

        return c.json({ message: result }, 201); // Return success message

    } catch (error) {
        console.error("Error creating booking:", error);
        return c.json({ message: "Internal server error." }, 500);
    }
};

// Get all bookings controller
export const getAllBookingsController = async (c: Context) => {
    try {
        const bookings = await getAllBookingsService();
        return c.json({ bookings }, 200); // Return all bookings

    } catch (error) {
        console.error("Error fetching all bookings:", error);
        return c.json({ message: "Internal server error." }, 500);
    }
};

// Get booking by ID controller
export const getBookingByIdController = async (c: Context) => {
    try {
        const bookingId = c.req.param('id'); // Get booking ID from URL param
        if (!bookingId) {
            return c.json({ message: "Booking ID is required." }, 400);
        }

        const booking = await getBookingByIdService(Number(bookingId));
        if (!booking) {
            return c.json({ message: "Booking not found." }, 404);
        }

        return c.json({ booking }, 200);

    } catch (error) {
        console.error("Error fetching booking by ID:", error);
        return c.json({ message: "Internal server error." }, 500);
    }
};

// Update booking controller
export const updateBookingController = async (c: Context) => {
    try {
        const bookingId = c.req.param('id'); // Get booking ID from URL param
        const { 
            user_id, 
            vehicle_id, 
            seat_ids, 
            departure_date, 
            departure_time, 
            estimated_arrival,
            price,
            total_price 
        } = await c.req.json();

        if (!bookingId) {
            return c.json({ message: "Booking ID is required." }, 400);
        }

        // Ensure required fields are provided
        if (!user_id || !vehicle_id || !seat_ids?.length || !price || !total_price) {
            return c.json({ message: "Missing required booking details." }, 400);
        }

        const result = await updateBookingService(Number(bookingId), {
            user_id,
            vehicle_id,
            seat_ids,
            departure_date,
            departure_time,
            estimated_arrival,
            price,
            total_price,
        });

        return c.json({ message: result }, 200); // Return success message

    } catch (error) {
        console.error("Error updating booking:", error);
        return c.json({ message: "Internal server error." }, 500);
    }
};

// Delete booking controller
export const deleteBookingController = async (c: Context) => {
    try {
        const bookingId = c.req.param('id'); // Get booking ID from URL param
        if (!bookingId) {
            return c.json({ message: "Booking ID is required." }, 400);
        }

        const result = await deleteBookingService(Number(bookingId));
        return c.json({ message: result }, 200);

    } catch (error) {
        console.error("Error deleting booking:", error);
        return c.json({ message: "Internal server error." }, 500);
    }
};
