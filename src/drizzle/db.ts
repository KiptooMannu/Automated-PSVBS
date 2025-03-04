import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import * as schema from "./schema";
import Stripe from 'stripe';

const client = neon(process.env.DATABASE_URL as string);

const db = drizzle(client, { schema, logger: true });
export default db;

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    typescript: true,
});
