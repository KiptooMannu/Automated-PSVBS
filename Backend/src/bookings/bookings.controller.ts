// booking.controller.ts
import { Context } from "hono";
import {
    getAllBookingsService,
    getBookingByIdService,
    createBookingService,
    updateBookingService,
    deleteBookingService
} from "./booking.service";

// Get all bookings
export const getAllBookingsController = async (c: Context) => {
    try {
        const bookings = await getAllBookingsService();
        if (!bookings || bookings.length === 0) {
            return c.text("No bookings found😒", 404);
        }
        return c.json(bookings, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};


// Create booking
export const createBookingController = async (c: Context) => {
    try {
        const booking = await c.req.json();
        // Convert date fields to Date objects
        if (booking.departure_date) {
            booking.departure_date = new Date(booking.departure_date);
        }
        if (booking.booking_date) {
            booking.booking_date = new Date(booking.booking_date);
        }
        const newBooking = await createBookingService(booking);
        // check if booking was created successfully
        if (newBooking === undefined) return c.json({ message: "Booking creation failed😒" }, 400);
        return c.json({ message: "Booking created successfully🥳", booking: newBooking }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

//get booking by id
export const getBookingByIdController = async (c: Context) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) return c.text("Invalid booking id😒", 400);
        const booking = await getBookingByIdService(id);
        if (booking === undefined) return c.json({ message: "No booking found with this id😒" }, 404);
        return c.json(booking, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
}

// Update booking
export const updateBookingController = async (c: Context) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) return c.text("Invalid booking id😒", 400);
        const booking = await c.req.json();
        // Convert date fields to Date objects
        if (booking.departure_date) {
            booking.departure_date = new Date(booking.departure_date);
        }
        if (booking.booking_date) {
            booking.booking_date = new Date(booking.booking_date);
        }
        const updatedBooking = await updateBookingService(id, booking);
        if (updatedBooking === undefined) return c.json({ message: "No booking found with this id😒" }, 404);
        return c.json({ message: "Booking updated successfully🥳", booking: updatedBooking }, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// Delete /cancel booking
export const deleteBookingController = async (c: Context) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) return c.text("Invalid booking id", 400);
        const deletedBooking = await deleteBookingService(id);
        if (deletedBooking === undefined) return c.json({ message: "No booking found with this id😒" }, 404);
        return c.json({ message: "Booking deleted successfully🥳", booking: deletedBooking }, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};



// export const cancelBooking = async (c: Context) => {
//     const bookingId = parseInt(c.req.param("booking_id"));
//     try{
//         if(isNaN(bookingId)) return c.text("Invalid booking id", 400);
//         // cancel booking by id
//         const cancelledBooking = await cancelBookingService(bookingId);
//         if(cancelledBooking===undefined) return c.json({message: "No booking found with this id"},404);
//         return c.json({message: "Booking cancelled successfully", booking: cancelledBooking}, 200);
//     } catch(error: any){
//         return c.text(error?.message, 400);
//     }
// }
