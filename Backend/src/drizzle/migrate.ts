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
