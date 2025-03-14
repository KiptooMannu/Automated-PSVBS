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

       

        // Step 2: Add departure_time to vehicles table with the same type as it was in bookings
        await db.execute(sql`
            ALTER TABLE vehicles
            ADD COLUMN IF NOT EXISTS departure_time VARCHAR;
        `);

        // Step 3: Create routes table
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS routes (
                route_id SERIAL PRIMARY KEY,
                departure VARCHAR(255) NOT NULL,
                destination VARCHAR(255) NOT NULL,
                distance INTEGER,
                duration INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `);

        // Step 4: Create schedule table
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS schedule (
                schedule_id SERIAL PRIMARY KEY,
                route_id INTEGER NOT NULL REFERENCES routes(route_id) ON DELETE CASCADE,
                departure_time VARCHAR NOT NULL,
                frequency INTEGER,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `);

        // Step 5: Add route_id and schedule_id columns to vehicles table
        await db.execute(sql`
            ALTER TABLE vehicles
            ADD COLUMN IF NOT EXISTS route_id INTEGER REFERENCES routes(route_id) ON DELETE SET NULL;
        `);

        await db.execute(sql`
            ALTER TABLE vehicles
            ADD COLUMN IF NOT EXISTS schedule_id INTEGER REFERENCES schedule(schedule_id) ON DELETE SET NULL;
        `);

        // Step 6: Create payments table with unique constraint on transaction_reference
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