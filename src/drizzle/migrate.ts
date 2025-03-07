import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, 
});

const db = drizzle(client);

async function migration() {
    console.log('======== Migrations started ========');

    try {
        await client.connect();

        // Step 1: Drop departure_time from bookings table if it exists
        await db.execute(sql`
            ALTER TABLE bookings
            DROP COLUMN IF EXISTS departure_time;
        `);

        // Step 2: Add departure_time to vehicles table with the same type as it was in bookings
        await db.execute(sql`
            ALTER TABLE vehicles
            ADD COLUMN IF NOT EXISTS departure_time VARCHAR;
        `);

        // Step 3: Create payments table with unique constraint on transaction_reference
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS payments (
                payment_id SERIAL PRIMARY KEY,
                booking_id INTEGER NOT NULL REFERENCES bookings(booking_id) ON DELETE CASCADE,
                amount NUMERIC(10, 2) NOT NULL,
                payment_method VARCHAR(50) NOT NULL,
                payment_status VARCHAR(50) DEFAULT 'pending',
                transaction_reference VARCHAR(255) NOT NULL UNIQUE,
                payment_date TIMESTAMP DEFAULT NOW(),
                phone_number VARCHAR(20) NOT NULL,
                ticket_id INTEGER REFERENCES tickets(ticket_id) ON DELETE CASCADE,
                mpesa_receipt_number VARCHAR(255), -- New column for M-Pesa receipt number
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `);

        // Step 4: Ensure mpesa_receipt_number column exists in payments table
        await db.execute(sql`
            ALTER TABLE payments
            ADD COLUMN IF NOT EXISTS mpesa_receipt_number VARCHAR(255);
        `);

        // Step 5: Add index on booking_id in payments table
        await db.execute(sql`
            CREATE INDEX IF NOT EXISTS booking_id_idx ON payments(booking_id);
        `);

        console.log('======== Migrations completed successfully ========');
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('Migration error:', err.message);
        } else {
            console.error('Migration error:', err);
        }
    } finally {
        await client.end();
        process.exit(0);
    }
}

migration().catch((err: unknown) => {
    if (err instanceof Error) {
        console.error('Migration error:', err.message);
    } else {
        console.error('Migration error:', err);
    }
    process.exit(1);
});
