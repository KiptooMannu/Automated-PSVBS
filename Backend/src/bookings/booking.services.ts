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
}