// import db from './db';

// async function migration() {
//     try {
//         console.log("==Migration Started==");

//         // // Manually alter the vehicles table to add the "cost" column
//         // await db.execute(`
//         //   ALTER TABLE vehicles ADD COLUMN cost INTEGER DEFAULT 0 NOT NULL;
//         // `);

//         console.log("==Migration Finished==");
//         process.exit(0);
//     } catch (error) {
//         console.error("Migration failed with error: ", error);
//         process.exit(1);
//     }
// }

// migration().catch((e) => {
//     console.error("Unexpected error during migration:", e);
//     process.exit(1);
// });

import db from './db';

async function migration() {
    try {
        console.log("==Migration Started==");

        // Add the "seat_ids" column to the "bookings" table
        await db.execute(`
            ALTER TABLE bookings
            ADD COLUMN IF NOT EXISTS seat_ids INTEGER[] NOT NULL;
        `);

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