
import db from "../drizzle/db";
import { TIBookings, bookingTable, seatTable } from "../drizzle/schema"; // Assuming TBooking type and BookingTable schema
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
export const createBookingService = async (booking: TIBookings): Promise<string> => {
    const seatIds = booking.seat_ids;  // Array of seat IDs

    // Check availability for all seats
    const unavailableSeats = [];
    for (const seat_id of seatIds) {
        const seat = await db.query.seatTable.findFirst({
            where: eq(seatTable.seat_id, seat_id),
        });

        if (!seat || !seat.is_available) {
            unavailableSeats.push(seat_id);
        }
    }

    // if (unavailableSeats.length > 0) {
    //     throw new Error(`Seats not available: ${unavailableSeats.join(", ")}`);
    // }

    // Proceed with creating the booking
    await db.insert(bookingTable).values(booking);

    // Mark the seats as unavailable after booking
    for (const seat_id of seatIds) {
        await db.update(seatTable).set({ is_available: false }).where(eq(seatTable.seat_id, seat_id));
    }

    return "Booking created successfully";
};

// Update booking
export const updateBookingService = async (booking_id: number, booking: TIBookings): Promise<string> => {
    await db.update(bookingTable).set(booking).where(eq(bookingTable.booking_id, booking_id));
    return "Booking updated successfully";
};

// Delete booking
export const deleteBookingService = async (booking_id: number): Promise<string> => {
    // First, mark all seats back to available before deleting the booking
    const booking = await db.query.bookingTable.findFirst({
        where: eq(bookingTable.booking_id, booking_id),
    });

    if (booking) {
        const seatIds = booking.seat_ids;  // Assuming this field exists in the booking data
        for (const seat_id of seatIds) {
            await db.update(seatTable).set({ is_available: true }).where(eq(seatTable.seat_id, seat_id));
        }

        // Then, delete the booking
        await db.delete(bookingTable).where(eq(bookingTable.booking_id, booking_id));
        return "Booking deleted successfully";
    }

    return "Booking not found";
};