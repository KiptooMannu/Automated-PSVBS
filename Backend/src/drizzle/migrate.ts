import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Connect to Neon DB
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Required for Neon
});

const db = drizzle(client);

async function migration() {
    try {
        console.log("== 🚀 Starting Migration to Neon Database ==");

        await client.connect(); // Connect to Neon DB

        // ✅ Add 'verification_token' column if it doesn't exist
        await db.execute(sql`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255);
        `);

        // ✅ Add 'verification_token_expires_at' column if it doesn't exist
        await db.execute(sql`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS verification_token_expires_at TIMESTAMP;
        `);

        console.log("✅ Migration Completed Successfully on Neon ✅");

        await client.end(); // Close connection
        process.exit(0);
    } catch (error) {
        console.error("❌ Migration Failed with Error:", error);
        await client.end(); // Ensure connection is closed on error
        process.exit(1);
    }
}

// Run the migration
migration().catch((e) => {
    console.error("❌ Unexpected error during migration:", e);
    process.exit(1);
});
