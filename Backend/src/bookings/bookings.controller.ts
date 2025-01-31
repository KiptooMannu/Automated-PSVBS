import { Context } from 'hono';
import { 
    createBookingService,
    // getAllBookingsService,
    // getBookingByIdService,
    updateBookingService,
    deleteBookingService,
    createBookingSeatService,
    deleteBookingSeatsService
} from './booking.service';

// Create booking controller
export const createBookingController = async (c: Context) => {
    try {
        const { 
            user_id, 
            vehicle_id, 
            seat_ids, 
            booking_date,  // Explicitly expect booking_date
            departure_date,  // Keep departure_date separately
            departure_time, 
            estimated_arrival,
            destination,
            departure,
            price, 
            total_price
        } = await c.req.json();

        // Ensure all required fields are provided
        if (!user_id || !vehicle_id || !seat_ids?.length || !price || !total_price || !booking_date || !departure_date || !departure_time) {
            return c.json({ message: "Missing required booking details." }, 400);
        }

        // Convert booking_date and departure_date to Date objects if they are not already
        const bookingDateObj = new Date(booking_date);
        const departureDateObj = new Date(departure_date);

        if (isNaN(bookingDateObj.getTime()) || isNaN(departureDateObj.getTime())) {
            return c.json({ message: "Invalid date format." }, 400);
        }

        // Call the service to create the booking
        const bookingResult = await createBookingService({
            user_id,
            vehicle_id,
            booking_date: bookingDateObj, 
            departure_date: departureDateObj,  
            departure_time,
            estimated_arrival,
            destination,
            departure,
            price,
            total_price,
        });

        const bookingId = bookingResult.booking_id;  // Assuming this is returned

        // Insert seats into bookings_seats table
        for (const seat_id of seat_ids) {
            await createBookingSeatService(bookingId, seat_id);
        }

        return c.json({ message: 'Booking created successfully!' }, 201); // Return success message

    } catch (error) {
        console.error("Error creating booking:", error);
        return c.json({ message: "Internal server error." }, 500);
    }
};

// // Get all bookings controller
// export const getAllBookingsController = async (c: Context) => {
//     try {
//         const bookings = await getAllBookingsService();
//         return c.json({ bookings }, 200); // Return all bookings

//     } catch (error) {
//         console.error("Error fetching all bookings:", error);
//         return c.json({ message: "Internal server error." }, 500);
//     }
// };

// Get booking by ID controller
// export const getBookingByIdController = async (c: Context) => {
//     try {
//         const bookingId = c.req.param('id'); // Get booking ID from URL param
//         if (!bookingId) {
//             return c.json({ message: "Booking ID is required." }, 400);
//         }

//         const booking = await getBookingByIdService(Number(bookingId));
//         if (!booking) {
//             return c.json({ message: "Booking not found." }, 404);
//         }

//         return c.json({ booking }, 200);

//     } catch (error) {
//         console.error("Error fetching booking by ID:", error);
//         return c.json({ message: "Internal server error." }, 500);
//     }
// };

// Update booking controller
export const updateBookingController = async (c: Context) => {
    try {
        const bookingId = c.req.param('id'); // Get booking ID from URL param
        const { 
            user_id, 
            vehicle_id, 
            seat_ids, 
            booking_date,  // Explicitly expect booking_date
            departure_date,  // Keep departure_date separately
            departure_time, 
            estimated_arrival,
            price,
            total_price 
        } = await c.req.json();

        if (!bookingId) {
            return c.json({ message: "Booking ID is required." }, 400);
        }

        // Ensure required fields are provided
        if (!user_id || !vehicle_id || !seat_ids?.length || !price || !total_price || !booking_date || !departure_date || !departure_time) {
            return c.json({ message: "Missing required booking details." }, 400);
        }

        // Update the booking (without seats)
        const updatedBooking = await updateBookingService(Number(bookingId), {
            user_id,
            vehicle_id,
            booking_date,  // Pass booking_date as is
            departure_date,  // Pass departure_date as is
            departure_time,
            estimated_arrival,
            price,
            total_price,
        });

        // Clear existing seat associations (if needed)
        await deleteBookingSeatsService(Number(bookingId));

        // Insert new seats into bookings_seats table
        for (const seat_id of seat_ids) {
            await createBookingSeatService(Number(bookingId), seat_id);
        }

        return c.json({ message: 'Booking updated successfully!' }, 200); // Return success message

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
