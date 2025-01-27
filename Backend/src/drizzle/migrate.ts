import 'dotenv/config';
import db from './db';
import { sql } from 'drizzle-orm';

async function migration() {
  console.log('======== Migrations started ========');

  try {
    // Check and create the 'booking_status' enum type only if it doesn't exist
    await db.execute(sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
          CREATE TYPE "public"."booking_status" AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
        END IF;
      END $$;
    `);

    // Continue with other migrations...
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
