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

        // Step 1: Add the column without NOT NULL constraint
        await db.execute(sql`
            ALTER TABLE payments
            ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
        `);

        // Step 2: Update existing rows to use an empty string instead of NULL
        await db.execute(sql`
            UPDATE payments
            SET phone_number = ''
            WHERE phone_number IS NULL;
        `);

        // Step 3: Apply the NOT NULL constraint
        await db.execute(sql`
            ALTER TABLE payments
            ALTER COLUMN phone_number SET NOT NULL;
        `);

        console.log('======== Migrations completed ========');
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
