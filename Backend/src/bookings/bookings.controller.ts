import { Context } from 'hono';
import { createBookingService, getAllVehiclesWithBookingsService } from './booking.service';
import db from '../drizzle/db';
import { bookingsSeatsTable, bookingTable } from '../drizzle/schema';
import { eq } from "drizzle-orm";

// Helper function to validate and parse dates
const parseValidDate = (date: any): Date | null => {
    if (!date) return null;
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
};

// ✅ Create Booking Controller
export const createBookingController = async (c: Context) => {
    try {
        const {
            user_id,
            vehicle_id,
            seat_numbers, 
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
            seat_numbers: string[]; // ✅ Accept all seats without constraints
            booking_date: string;
            departure_date: string;
            departure_time: string;
            departure: string;
            destination: string;
            estimated_arrival: string | null;
            price: string;
            total_price: string;
        } = await c.req.json();

        if (!user_id || !vehicle_id || !seat_numbers.length || !price || !total_price || !booking_date || !departure_date || !departure_time) {
            return c.json({ message: "Missing required booking details." }, 400);
        }

        // ✅ Convert dates to valid Date objects
        const formattedBookingDate = parseValidDate(booking_date);
        const formattedDepartureDate = parseValidDate(departure_date);

        if (!formattedBookingDate || !formattedDepartureDate) {
            return c.json({ message: "Invalid date format." }, 400);
        }

        // ✅ Convert seat numbers to seat IDs dynamically (No DB validation required)
        const seat_ids = seat_numbers.map((seat) => parseInt(seat.replace("S", ""), 10));

        // ✅ Ensure total_price calculation is accurate
        const calculatedTotalPrice = seat_ids.length * parseFloat(price);
        if (parseFloat(total_price) !== calculatedTotalPrice) {
            return c.json({ message: "Total price calculation mismatch." }, 400);
        }

        // ✅ Create booking (Seats are directly stored without pre-validation)
        const bookingId = await createBookingService({
            user_id,
            vehicle_id,
            booking_date: formattedBookingDate,
            departure_date: formattedDepartureDate,
            departure_time,
            departure,
            destination,
            estimated_arrival,
            price,
            total_price: calculatedTotalPrice.toString(),
            seat_numbers, // ✅ Send seat numbers directly
        });

        return c.json({ message: "Booking created successfully!", booking_id: bookingId }, 201);
    } catch (error: unknown) {
        console.error("Error creating booking:", error);
        return c.json({ message: error instanceof Error ? error.message : "Internal server error." }, 500);
    }
};

// ✅ Retrieve Booked Seats Controller
export const getBookedSeatsController = async (c: Context) => {
    try {
        const vehicle_id = c.req.query("vehicle_id");

        if (!vehicle_id) {
            return c.json({ message: "Missing vehicle_id." }, 400);
        }

        // ✅ Retrieve all booked seat IDs for the vehicle (No DB validation required)
        const bookedSeats = await db.query.bookingsSeatsTable.findMany({
            where: eq(bookingsSeatsTable.vehicle_id, vehicle_id),
            columns: { seat_id: true }
        });

        return c.json({ booked_seats: bookedSeats.map(bs => `S${bs.seat_id}`) }, 200);
    } catch (error) {
        console.error("Error retrieving booked seats:", error);
        return c.json({ message: "Internal server error." }, 500);
    }
};

// ✅ Fetch All Vehicles With Bookings (Departure Date & Time)
export const getAllVehiclesWithBookingsController = async (c: Context) => {
    try {
        const vehiclesWithBookings = await getAllVehiclesWithBookingsService();
        return c.json(vehiclesWithBookings, 200);
    } catch (error) {
        console.error("Error fetching vehicles with bookings:", error);
        return c.json({ message: "Internal server error" }, 500);
    }
};

// ✅ Fetch All Bookings
export const getAllBookingsController = async (c: Context) => {
    try {
        const bookings = await db.query.bookingTable.findMany();
        return c.json(bookings, 200);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return c.json({ message: "Internal server error" }, 500);
    }
};
