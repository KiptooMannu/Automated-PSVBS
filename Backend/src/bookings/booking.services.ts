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
