import db from '../drizzle/db';
import { bookingTable, bookingsSeatsTable } from '../drizzle/schema';
import { eq } from "drizzle-orm";

// Create booking service
export const createBookingService = async ({
    user_id,
    vehicle_id,
    booking_date,
    departure_date,
    departure_time,
    departure,
    destination,
    estimated_arrival,
    price,
    total_price,
}: {
    user_id: number;
    vehicle_id: string;
    booking_date: Date;
    departure_date: Date;
    departure_time: string;
    destination: string;
    departure: string;
    estimated_arrival: string | null;
    price: string; // Ensure price is passed as string
    total_price: string; // Ensure total_price is passed as string
}) => {
    const result = await db.insert(bookingTable)
        .values({
            user_id,
            vehicle_id,
            booking_date,
            departure_date,
            departure_time,
            departure,
            destination,
            estimated_arrival,
            price,
            total_price,
        })
        .returning({ booking_id: bookingTable.booking_id })
        .execute(); // Ensure execution

    return result[0]; // Return the first inserted record
};

// Create booking seat service (to insert into bookings_seats table)
export const createBookingSeatService = async (bookingId: number, seatId: number) => {
    await db.insert(bookingsSeatsTable).values({
        booking_id: bookingId,
        seat_id: seatId,
    }).execute();
};

// Delete booking seats service (to clear old seat associations)
export const deleteBookingSeatsService = async (bookingId: number) => {
    await db.delete(bookingsSeatsTable)
        .where(eq(bookingsSeatsTable.booking_id, bookingId))
        .execute();
};

// Update booking service
export const updateBookingService = async (
    bookingId: number,
    {
        user_id,
        vehicle_id,
        booking_date,
        departure_date,
        departure_time,
        estimated_arrival,
        price,
        total_price,
    }: {
        user_id: number;
        vehicle_id: string;
        booking_date: Date;
        departure_date: Date;
        departure_time: string;
        estimated_arrival: string | null;
        price: string; 
        total_price: string; 
    }
) => {
    const updated = await db.update(bookingTable)
        .set({
            user_id,
            vehicle_id,
            booking_date,
            departure_date,
            departure_time,
            estimated_arrival,
            price,
            total_price,
        })
        .where(eq(bookingTable.booking_id, bookingId))
        .returning({ booking_id: bookingTable.booking_id })
        .execute();

    return updated.length > 0 ? { message: 'Booking updated successfully!' } : { error: 'Booking not found' };
};

// Delete booking service
export const deleteBookingService = async (bookingId: number) => {
    const deleted = await db.delete(bookingTable)
        .where(eq(bookingTable.booking_id, bookingId))
        .returning({ booking_id: bookingTable.booking_id })
        .execute();

    return deleted.length > 0 ? { message: 'Booking deleted successfully!' } : { error: 'Booking not found' };
};
