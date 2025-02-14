import { Context } from 'hono';
import { createBookingService, getAllVehiclesWithBookingsService } from './booking.service';
import db from '../drizzle/db';
import { bookingsSeatsTable, bookingTable ,vehicleTable } from '../drizzle/schema';
import { eq, desc } from "drizzle-orm";

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

        console.log("🕒 Final departure_time:", departure_time); // ✅ Log departure_time


        if (!user_id || !vehicle_id || !seat_numbers.length || !price || !total_price || !booking_date || !departure_date) {
            return c.json({ message: "Missing required booking details." }, 400);
          }
          
               // ✅ Auto-fetch departure_time if missing
               const latestBooking = await db.query.bookingTable.findFirst({
                where: eq(bookingTable.vehicle_id, vehicle_id),
                orderBy: desc(bookingTable.departure_date), 
            });
            const departureTime = latestBooking?.departure_time || "00:00"; 
    

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

        const bookedSeats = await db.query.bookingsSeatsTable.findMany({
            where: eq(bookingsSeatsTable.vehicle_id, vehicle_id),
            columns: { seat_id: true }
        });

        return c.json({ booked_seats: bookedSeats.map(bs => `S${bs.seat_id}`) }, 200);
    } catch (error) {
        console.error("Error retrieving booked seats:", error);
        return c.json({ message: "Internal server error" }, 500);
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
import { sql } from "drizzle-orm"; // ✅ Use raw SQL aggregation


export const getAllBookingsController = async (c: Context) => {
    try {
        const bookings = await db
            .select({
                booking_id: bookingTable.booking_id,
                user_id: bookingTable.user_id,
                vehicle_id: bookingTable.vehicle_id,
                departure_date: bookingTable.departure_date,
                departure_time: bookingTable.departure_time,
                departure: bookingTable.departure,
                destination: bookingTable.destination,
                total_price: bookingTable.total_price,
                booking_status: bookingTable.booking_status,
                booking_date: bookingTable.booking_date,
                seat_ids: sql<string>`COALESCE(STRING_AGG(${bookingsSeatsTable.seat_id}::TEXT, ','), 'N/A')`.as("seat_ids"), // ✅ Fix: Use STRING_AGG
            })
            .from(bookingTable)
            .leftJoin(bookingsSeatsTable, eq(bookingTable.booking_id, bookingsSeatsTable.booking_id))
            .groupBy(bookingTable.booking_id) // ✅ Group bookings so seat IDs aggregate correctly
            .execute();

        return c.json(bookings, 200);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return c.json({ message: "Internal server error" }, 500);
    }
};
//fetch all bookings by user id
export const getUserBookingsByUserIdController = async (c: Context) => {
    try {
        const user_id = Number(c.req.param("id"));
        if (isNaN(user_id)) {
            return c.json({ message: "Invalid user_id. Must be a number." }, 400);
        }

        const bookings = await db
            .select({
                booking_id: bookingTable.booking_id,
                user_id: bookingTable.user_id,
                vehicle_id: bookingTable.vehicle_id,
                departure_date: bookingTable.departure_date,
                departure_time: bookingTable.departure_time,
                departure: bookingTable.departure,
                destination: bookingTable.destination,
                total_price: bookingTable.total_price,
                booking_status: bookingTable.booking_status,
                booking_date: bookingTable.booking_date,
                seat_ids: sql<string>`COALESCE(STRING_AGG(${bookingsSeatsTable.seat_id}::TEXT, ','), 'N/A')`.as("seat_ids"),
            })
            .from(bookingTable)
            .leftJoin(bookingsSeatsTable, eq(bookingTable.booking_id, bookingsSeatsTable.booking_id))
            .where(eq(bookingTable.user_id, user_id)) // ✅ Now user_id is correctly typed
            .groupBy(bookingTable.booking_id)
            .execute();

        return c.json(bookings, 200);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return c.json({ message: "Internal server error" }, 500);
    }
};
// ✅ Update Booking Status Controller
// export const updateBookingStatusController = async (c: Context) => {
//     try {
//         const { booking_id, booking_status }: { booking_id: number; booking_status: string } = await c.req.json();

//         if (!booking_id || !booking_status) {
//             return c.json({ message: "Missing required fields." }, 400);
//         }

//         const updatedBooking = await db.bookingsTable.update({
//             where: eq(bookingTable.booking_id, booking_id),
//             set: { booking_status },
//         });

//         if (!updatedBooking) {
//             return c.json({ message: "Booking not found." }, 404);
//         }

//         return c.json({ message: "Booking status updated successfully!" }, 200);
//     } catch (error) {
//         console.error("Error updating booking status:", error);
//         return c.json({ message: "Internal server error" }, 500);
//     }
// };
// ✅ Confirm Booking Controller
export const confirmBookingController = async (c: Context) => {
    try {
        const { booking_id }: { booking_id: number } = await c.req.json();

        if (!booking_id) {
            return c.json({ message: "Booking ID is required." }, 400);
        }

        // ✅ Check if the booking exists
        const existingBooking = await db.query.bookingTable.findFirst({
            where: eq(bookingTable.booking_id, booking_id),
        });

        if (!existingBooking) {
            return c.json({ message: "Booking not found." }, 404);
        }

        if (existingBooking.booking_status === "confirmed" || existingBooking.booking_status === "completed") {
            return c.json({ message: "Booking is already confirmed or completed." }, 200);
        }

        // ✅ Update the booking status to "confirmed"
        await db.update(bookingTable)
            .set({ booking_status: "confirmed" })
            .where(eq(bookingTable.booking_id, booking_id));

        return c.json({ message: "Booking confirmed successfully.", success: true }, 200);
    } catch (error) {
        console.error("Error confirming booking:", error);
        return c.json({ message: "Internal server error" }, 500);
    }
};
