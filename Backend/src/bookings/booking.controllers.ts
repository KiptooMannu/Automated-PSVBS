import { Context } from "hono";
import { createBookingService,getAllBookingsService,getBookingsByUserIdService,cancelBookingService } from "./booking.services";
import { parse } from "path";

//create booking for a user
export const createBooking = async (c: Context) => {
    try{
        const booking = c.req.json();
        const createdBooking = await createBookingService(booking);
        // check if booking was created successfully
        if(createdBooking===undefined) return c.json({message: "Booking failed😒"},400);
        return c.json({message: "Booking successful🥳", booking: createdBooking},201);
        
    } catch(error: any){
        return c.text(error?.message, 400);
    }
}
// get all booking for a user
export const getAllBookings = async (c: Context) => {
    try{
        const bookings = await getAllBookingsService();
        return c.json(bookings, 200);
    } catch(error: any){
        return c.text(error?.message, 400);
    }
}
// get all booking for a user by id
export const getBookingsByUserId = async (c: Context) => {
    const user_id = parseInt(c.req.param("user_id"));
    try{
        if(isNaN(user_id)) return c.text("Invalid user id", 400);
        // search for bookings by user id
        const bookings = await getBookingsByUserIdService(user_id);
        if(bookings===undefined) return c.json({message: "No booking found for this user"},404);
        return c.json(bookings, 200);
    } catch(error: any){
        return c.text(error?.message, 400);
    }
}
// cancel booking by id and change status to cancelled in db
export const cancelBooking = async (c: Context) => {
    const bookingId = parseInt(c.req.param("booking_id"));
    try{
        if(isNaN(bookingId)) return c.text("Invalid booking id", 400);
        // cancel booking by id
        const cancelledBooking = await cancelBookingService(bookingId);
        if(cancelledBooking===undefined) return c.json({message: "No booking found with this id"},404);
        return c.json({message: "Booking cancelled successfully", booking: cancelledBooking}, 200);
    } catch(error: any){
        return c.text(error?.message, 400);
    }
}