//users schemas
import { pgTable, pgEnum, serial, varchar, timestamp, boolean,text, integer} from "drizzle-orm/pg-core";
import { jsonb } from "drizzle-orm/pg-core";
export const roleEnum = pgEnum("user_type", ['user', 'admin', 'super_admin', 'disabled']);
export const userTable = pgTable("userTable", {
    user_id: serial("user_id").primaryKey(),
    first_name: varchar("first_name"),
    last_name: varchar("last_name"),
    email: varchar("email").notNull().unique(),
    password: varchar("password").notNull(),
    phone_number: varchar("phone_number"),
    address: varchar("address"),
    city: varchar("city"),
    user_type: roleEnum("user_type").default('user'),
    image_url: varchar("image_url", { length: 255 }),
    isVerified: boolean("isVerified").default(false),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
});
//Bookings == payment
//vehicle
//tickets
