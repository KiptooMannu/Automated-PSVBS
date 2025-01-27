// import {migrate} from 'drizzle-orm/neon-http/migrator';
// import db from './db';

// async function migration(){
//     try {
//        console.log("==Migration Started==");
//        await migrate(db,{
//         migrationsFolder: __dirname + '/migrations',
//        }) ;
//          console.log("==Migration Finished==");
//          process.exit(0);
//     } catch (error) {
//         console.error("Migration failed with error: ", error);
//         process.exit(1);
//     }
// }

// migration().catch((e) => {
//     console.error("Unexpected error during migration:", e);
//     process.exit(1);
//   });

import 'dotenv/config';
import db from './db';
import { sql } from 'drizzle-orm';

async function migration() {
  console.log('======== Migrations started ========');

  try {
    // Add the 'departure' column to the 'vehicles' table
    await db.execute(sql`
      ALTER TABLE "vehicles"
      ADD COLUMN IF NOT EXISTS "departure" VARCHAR;
    `);

    console.log('======== Migrations completed ========');
  } catch (err) {
    const error = err as Error; // Cast error to Error type
    console.error('Migration error:', error.message);
  } finally {
    process.exit(0);
  }
}

migration().catch((err) => {
  const error = err as Error; // Cast error to Error type
  console.error('Unexpected error during migration:', error.message);
  process.exit(1);
});
