

// import db from './db';

// async function migration() {
//     try {
//         console.log("==Migration Started==");

//         // Add the "seat_ids" column to the "bookings" table
//         await db.execute(`
//             ALTER TABLE bookings
//             ADD COLUMN IF NOT EXISTS seat_ids INTEGER[] NOT NULL;
//         `);

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

        // Drop the "seat_id" column if it exists
        await db.execute(`
            ALTER TABLE bookings
            DROP COLUMN IF EXISTS seat_id;
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
