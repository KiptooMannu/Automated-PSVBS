<<<<<<< HEAD
<<<<<<< HEAD
// booking.service.ts
import  db  from "../drizzle/db";
import { TIBookings, bookingTable ,seatTable } from "../drizzle/schema";  // Assuming TBooking type and BookingTable schema
import { eq } from "drizzle-orm";

// Get all bookings
export const getAllBookingsService = async (): Promise<TIBookings[] | null> => {
    const bookings = await db.query.bookingTable.findMany();
    return bookings;
};

// Get booking by ID
export const getBookingByIdService = async (booking_id: number): Promise<TIBookings | undefined> => {
    const booking = await db.query.bookingTable.findFirst({
        where: eq(bookingTable.booking_id, booking_id),
    });
    return booking;
};

// Create booking
// booking.service.ts

// Check if the seat is available before creating a booking
export const createBookingService = async (booking: TIBookings): Promise<string> => {
    const seat = await db.query.seatTable.findFirst({
        where: eq(seatTable.seat_id, booking.seat_id),
    });

    if (!seat || !seat.is_available) {
        throw new Error("Seat not available");
    }

    // Proceed with creating the booking
    await db.insert(bookingTable).values(booking);

    // Mark the seat as unavailable after booking
    await db.update(seatTable).set({ is_available: false }).where(eq(seatTable.seat_id, booking.seat_id));

    return "Booking created successfully";
};

// Update booking
export const updateBookingService = async (booking_id: number, booking: TIBookings): Promise<string> => {
    await db.update(bookingTable).set(booking).where(eq(bookingTable.booking_id, booking_id));
    return "Booking updated successfully";
};

// Delete booking
export const deleteBookingService = async (booking_id: number): Promise<string> => {
    await db.delete(bookingTable).where(eq(bookingTable.booking_id, booking_id));
    return "Booking deleted successfully";
};
=======
=======
>>>>>>> main
import db from "../drizzle/db";
import { eq, sql } from "drizzle-orm";
import { bookingTable } from "../drizzle/schema";
//create booking for a user
export const createBookingService = async (booking: any) => {
    return await db.insert(bookingTable).values(booking)
    .returning({booking_id: bookingTable.booking_id})
    .execute();
}
// Fetch all bookings
export const getAllBookingsService = async () => {
    return await db.query.bookingTable.findMany();
}
// Fetch all bookings for a user
export const getBookingsByUserIdService = async (user_id: number) => {
return await db.query.bookingTable.findFirst({
    where : eq(bookingTable.user_id, user_id)
})
}
// update booking=====

export const deleteBookingService = async (bookingId: number) => {
    await db.delete(bookingTable).where(eq(bookingTable.booking_id, bookingId));
    return "Booking cancelled successfully";
}

//Cancel a booking===cancel by user id
export const cancelBookingService = async (bookingId: number) => {
    return await db.update(bookingTable).set({booking_status: "cancelled",is_active:false}).where(eq(bookingTable.booking_id, bookingId)).execute();
<<<<<<< HEAD
}
>>>>>>> d68585f9c88dc1520fad873c9ee7e1fb0613f77e
=======
}
>>>>>>> main
