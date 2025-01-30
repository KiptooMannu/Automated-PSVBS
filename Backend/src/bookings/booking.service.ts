import db from "../drizzle/db";
import { TIBookings, bookingTable, seatTable } from "../drizzle/schema"; // Assuming TIBooking type and BookingTable schema
import { eq, inArray } from "drizzle-orm";  // Ensure inArray is imported here
export const createBookingService = async (booking: TIBookings): Promise<string> => {
    console.log("Received booking data:", JSON.stringify(booking, null, 2));

    const requiredFields: (keyof TIBookings)[] = ['user_id', 'vehicle_id', 'seat_ids', 'booking_date', 'departure_time'];
    const missingFields = requiredFields.filter(field => !(field in booking));

    if (missingFields.length > 0) {
        console.error(`Missing required fields: ${missingFields.join(", ")}`);
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    const seatIds = booking.seat_ids; // Array of seat IDs (could be a single seat or multiple)

    console.log(`Checking availability for seat IDs: ${seatIds.join(", ")}`);

    const unavailableSeats = await db.query.seatTable.findMany({
        where: inArray(seatTable.seat_id, seatIds),
    });

    const unavailableSeatsIds = unavailableSeats.filter(seat => !seat.is_available).map(seat => seat.seat_id);

    if (unavailableSeatsIds.length > 0) {
        console.error(`Unavailable seats: ${unavailableSeatsIds.join(", ")}`);
        throw new Error(`Seats not available: ${unavailableSeatsIds.join(", ")}`);
    }

    console.log("All seats are available, proceeding with booking.");

    // If estimated_arrival is not provided, it will automatically be undefined and you can leave it out
    const { estimated_arrival } = booking; // Will be undefined if not provided
    // Proceed with inserting the booking (no need to pass departure_date)
    const { departure_date, ...restOfBooking } = booking; // Remove departure_date if present

    // Proceed with inserting the booking
    await db.insert(bookingTable).values({
        ...booking,
        estimated_arrival: estimated_arrival ?? null,  // If not provided, set it as null
    });

    // Mark the selected seats as unavailable after booking
    await db.update(seatTable)
        .set({ is_available: false })
        .where(inArray(seatTable.seat_id, seatIds));

    console.log("Booking created successfully with seat IDs:", seatIds.join(", "));
    return "Booking created successfully";
};


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
