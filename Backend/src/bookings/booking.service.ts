import db from '../drizzle/db';
import { bookingTable, bookingsSeatsTable, vehicleTable } from '../drizzle/schema';
import { eq } from "drizzle-orm";

// Create booking service (✅ Fixed: Removed transaction for Neon compatibility)
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
    seat_numbers, // ✅ Receives seat numbers
}: {
    user_id: number;
    vehicle_id: string;
    booking_date: Date;
    departure_date: Date;
    departure_time: string;
    departure: string;
    destination: string;
    estimated_arrival: string | null;
    price: string;
    total_price: string;
    seat_numbers: string[];
}) => {
    try {
        // ✅ Step 1: Insert booking (Without transaction)
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
                booking_status: 'pending',
                is_active: true,
            })
            .returning({ booking_id: bookingTable.booking_id })
            .execute();

        if (!result || result.length === 0) {
            throw new Error("Booking creation failed.");
        }

        const bookingId = result[0].booking_id;

        // ✅ Step 2: Convert seat numbers dynamically & insert (No transaction)
        for (const seatNumber of seat_numbers) {
            const seatId = convertSeatNumberToId(seatNumber);

            await db.insert(bookingsSeatsTable).values({
                booking_id: bookingId,
                vehicle_id,
                seat_id: seatId, // ✅ Store dynamically converted seat ID
            }).execute();
        }

        return bookingId;
    } catch (error) {
        console.error("Error in createBookingService:", error);
        throw new Error("Booking creation failed.");
    }
};


// ✅ Helper function: Convert "S1" to seat ID dynamically
const convertSeatNumberToId = (seatNumber: string): number => {
    return parseInt(seatNumber.replace("S", ""), 10);
};
// Create booking seat service (Stores seat ID, not seat number)
export const createBookingSeatService = async (
    trx: any, 
    bookingId: number, 
    vehicleId: string, 
    seatId: number
) => {
    await trx.insert(bookingsSeatsTable).values({
        booking_id: bookingId,
        vehicle_id: vehicleId,
        seat_id: seatId, // ✅ Store seat ID instead of seat number
    }).execute();
};





// Fetch all vehicles with booking details (departure date & time)
export const getAllVehiclesWithBookingsService = async () => {
    const vehiclesWithBookings = await db
        .select({
            registration_number: vehicleTable.registration_number,
            vehicle_name: vehicleTable.vehicle_name,
            license_plate: vehicleTable.license_plate,
            capacity: vehicleTable.capacity,
            vehicle_type: vehicleTable.vehicle_type,
            cost: vehicleTable.cost,
            current_location: vehicleTable.current_location,
            is_active: vehicleTable.is_active,
            image_url: vehicleTable.image_url,
            departure: vehicleTable.departure,
            destination: vehicleTable.destination,
            departure_date: bookingTable.departure_date, // ✅ Fetch from bookings
            departure_time: bookingTable.departure_time, // ✅ Fetch from bookings
        })
        .from(vehicleTable)
        .leftJoin(bookingTable, eq(vehicleTable.registration_number, bookingTable.vehicle_id)) // ✅ Join on vehicle_id
        .execute();

    console.log("Fetched Vehicles with Bookings:", vehiclesWithBookings);
    return vehiclesWithBookings;
};
