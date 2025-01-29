import db from './db';

async function migration() {
    try {
        console.log("==Migration Started==");

        // Create bookings table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS bookings (
                booking_id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
                vehicle_id VARCHAR(255) NOT NULL REFERENCES vehicles(registration_number) ON DELETE CASCADE,
                seat_ids INTEGER[] NOT NULL,  -- Allow multiple seat selections
                departure_date TIMESTAMP NOT NULL,
                departure_time VARCHAR(50) NOT NULL,
                estimated_arrival VARCHAR(50) NOT NULL,
                price DECIMAL NOT NULL,
                total_price DECIMAL NOT NULL,
                booking_status booking_status DEFAULT 'pending',
                booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("==Bookings Table Created==");

        // Insert sample bookings
        await db.execute(`
            INSERT INTO bookings 
                (user_id, vehicle_id, seat_ids, departure_date, departure_time, estimated_arrival, price, total_price, booking_status) 
            VALUES 
                (1, 'ABC123', ARRAY[1, 2, 3], '2025-02-01 08:00:00', '08:00 AM', '06:00 PM', 50.00, 150.00, 'confirmed'),
                (2, 'XYZ789', ARRAY[4, 5], '2025-02-02 10:30:00', '10:30 AM', '08:00 PM', 60.00, 120.00, 'pending');
        `);

        console.log("==Sample Booking Data Inserted==");

        console.log("==Migration Finished==");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed with error: ", error);
        process.exit(1);
    }
}

migration().catch((e) => {
    console.error("Unexpected error during migration:", e);
    process.exit(1);
});
