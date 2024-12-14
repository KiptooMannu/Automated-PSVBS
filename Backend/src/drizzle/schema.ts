//users schemas
import { pgTable, pgEnum, serial, varchar, timestamp, boolean,text, integer,decimal} from "drizzle-orm/pg-core";
import { jsonb } from "drizzle-orm/pg-core";
export const roleEnum = pgEnum("user_type", ['user', 'admin', 'super_admin', 'disabled']);
export const userTable = pgTable("userTable", {
    user_id: serial("user_id").primaryKey(),
    first_name: varchar("first_name"),
    last_name: varchar("last_name"),
    email: varchar("email").notNull().unique(),
    password: varchar("password").notNull(),
    phone_number: varchar("phone_number"),
    user_type: roleEnum("user_type").default('user'),
    image_url: varchar("image_url", { length: 255 }),
    isVerified: boolean("isVerified").default(false),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
});
// infer types from schema


//Bookings 
export const bookingTable = pgTable("bookingTable", {
    booking_id: serial("booking_id").primaryKey(),
    user_id: integer("user_id").notNull().references(() => userTable.user_id),
    // vehicle_id: integer("vehicle_id").notNull().references(() => vehiclesTable.vehicle_id),
    // ticket_id: integer("ticket_id").notNull().references(() => ticketsTable.ticket_id),

    // Destination Details
    departure: varchar("departure").notNull(),
    destination: varchar("destination").notNull(),
    departure_date: timestamp("departure_date").notNull(),
    departure_time: varchar("departure_time").notNull(),
    estimated_arrival: varchar("estimated_arrival").notNull(),
    // Seat and Fare Details
    seat_number: varchar("seat_number").notNull(),
    price: decimal("price").notNull(),
    // discount: decimal("discount").default(0),
    total_price: decimal("total_price").notNull(),
    booking_status: varchar("booking_status").default('pending'),
    
    // Booking Status and Activity
    is_cancelled: boolean("is_cancelled").default(false),
    is_paid: boolean("is_paid").default(false),
    is_active: boolean("is_active").default(true),

    // Payment Information
    payment_method: varchar("payment_method").default('cash'),
    payment_status: varchar("payment_status").default('pending'),
    payment_date: timestamp("payment_date"),
    //timestamp
    booking_date: timestamp("booking_date").defaultNow(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
});
//vehicle
//tickets
