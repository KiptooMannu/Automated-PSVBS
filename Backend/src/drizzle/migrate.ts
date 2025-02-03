// import { sql } from "drizzle-orm";
// import { drizzle } from "drizzle-orm/node-postgres";
// import { Client } from "pg";
// import dotenv from "dotenv";

// // Load environment variables
// dotenv.config();

// // Connect to Neon DB
// const client = new Client({
//     connectionString: process.env.DATABASE_URL,
//     ssl: { rejectUnauthorized: false }, // Required for Neon
// });

// const db = drizzle(client);

// async function migration() {
//     try {
//         console.log("== 🚀 Starting Migration to Neon Database ==");

//         await client.connect(); // Connect to Neon DB

//         // // 1️⃣ Drop existing `bookings_seats` table (if exists)
//         // await db.execute(sql`DROP TABLE IF EXISTS bookings_seats CASCADE;`);

//         // // 2️⃣ Recreate `bookings_seats` without FK constraints (allow generic seats)
//         // await db.execute(sql`
//         //     CREATE TABLE IF NOT EXISTS bookings_seats (
//         //         booking_seat_id SERIAL PRIMARY KEY,
//         //         booking_id INTEGER NOT NULL REFERENCES bookings(booking_id) ON DELETE CASCADE,
//         //         seat_number VARCHAR NOT NULL,
//         //         vehicle_id VARCHAR NOT NULL,
//         //         UNIQUE (booking_id, seat_number, vehicle_id) -- Ensures seat isn't double booked in the same vehicle
//         //     );
//         // `);

//         // // 3️⃣ Drop constraints from `seats` table (to allow generic seats)
//         // await db.execute(sql`ALTER TABLE seats DROP CONSTRAINT IF EXISTS seats_vehicle_id_fkey;`);
//         // await db.execute(sql`ALTER TABLE seats DROP CONSTRAINT IF EXISTS seats_vehicle_id_seat_number_key;`);

//         console.log("✅ Migration Completed Successfully on Neon ✅");

//         await client.end(); // Close connection
//         process.exit(0);
//     } catch (error) {
//         console.error("❌ Migration Failed with Error:", error);
//         process.exit(1);
//     }
// }

// // Run the migration
// migration().catch((e) => {
//     console.error("❌ Unexpected error during migration:", e);
//     process.exit(1);
// });


import { migrate } from "drizzle-orm/neon-http/migrator";
import  db  from "./db";

async function migration() {
  try {
    console.log("======Migration Started ======");
    await migrate(db, {
      migrationsFolder: __dirname + "/migrations"
    });
    console.log("======Migration Ended======");
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
