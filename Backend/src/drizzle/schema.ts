import { pgTable, pgEnum, serial, varchar, timestamp, boolean, text, integer, decimal } from "drizzle-orm/pg-core";

// Enums
export const roleEnum = pgEnum("user_type", ["user", "admin", "super_admin", "disabled"]);
export const bookingStatusEnum = pgEnum("booking_status", ["pending", "confirmed", "completed", "cancelled"]);
export const ticketStatusEnum = pgEnum("ticket_status", ["paid", "failed", "refunded"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "completed", "failed", "refunded"]);

// Users Table
export const userTable = pgTable("users", {
    user_id: serial("user_id").primaryKey(),
    first_name: varchar("first_name"),
    last_name: varchar("last_name"),
    email: varchar("email").notNull().unique(),
    password: varchar("password").notNull(),
    phone_number: varchar("phone_number"),
    user_type: roleEnum("user_type").default("user"),
    image_url: varchar("image_url", { length: 255 }),
    isVerified: boolean("is_verified").default(false),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
    is_deleted: boolean("is_deleted").default(false),
});

// Vehicles Table
export const vehicleTable = pgTable("vehicles", {
    vehicle_id: serial("vehicle_id").primaryKey(),
    vehicle_name: varchar("vehicle_name", { length: 100 }).notNull(),
    license_plate: varchar("license_plate", { length: 20 }).notNull().unique(),
    capacity: integer("capacity").notNull(),
    vehicle_type: varchar("vehicle_type", { length: 50 }).notNull(),
    model_year: integer("model_year"),
    current_location: varchar("current_location", { length: 255 }).notNull(),
    is_active: boolean("is_active").default(true),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
    is_deleted: boolean("is_deleted").default(false),
});

// Seats Table
export const seatTable = pgTable("seats", {
    seat_id: serial("seat_id").primaryKey(),
    vehicle_id: integer("vehicle_id")
        .notNull()
        .references(() => vehicleTable.vehicle_id, { onDelete: "cascade" }),
    seat_number: varchar("seat_number").notNull(),
    is_available: boolean("is_available").default(true),
    seat_type: varchar("seat_type").default("regular"),
    price: decimal("price").notNull(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
});

// Tickets Table
export const ticketTable = pgTable("tickets", {
    ticket_id: serial("ticket_id").primaryKey(),
    user_id: integer("user_id").notNull().references(() => userTable.user_id, { onDelete: "cascade" }),
    subject: varchar("subject").notNull(),
    description: text("description").notNull(),
    status: ticketStatusEnum("ticket_status").default("paid"), // Default status 'paid' (ticket confirmation after payment)
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
});

// Bookings Table
export const bookingTable = pgTable("bookings", {
    booking_id: serial("booking_id").primaryKey(),
    user_id: integer("user_id").notNull().references(() => userTable.user_id, { onDelete: "cascade" }),
    vehicle_id: integer("vehicle_id").notNull().references(() => vehicleTable.vehicle_id, { onDelete: "cascade" }),
    seat_id: integer("seat_id").notNull().references(() => seatTable.seat_id, { onDelete: "cascade" }),
    departure: varchar("departure").notNull(),
    destination: varchar("destination").notNull(),
    departure_date: timestamp("departure_date").notNull(),
    departure_time: varchar("departure_time").notNull(),
    estimated_arrival: varchar("estimated_arrival").notNull(),
    price: decimal("price").notNull(),
    total_price: decimal("total_price").notNull(),
    booking_status: bookingStatusEnum("booking_status").default("pending"),
    booking_date: timestamp("booking_date").defaultNow(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
});

// Payments Table
export const paymentsTable = pgTable("payments", {
    payment_id: serial("payment_id").primaryKey(),
    booking_id: integer("booking_id")
        .notNull()
        .references(() => bookingTable.booking_id, { onDelete: "cascade" }),
    amount: decimal("amount").notNull(),
    payment_method: varchar("payment_method", { length: 50 }).notNull(),
    payment_status: paymentStatusEnum("payment_status").default("pending"),
    transaction_reference: varchar("transaction_reference", { length: 100 }).notNull().unique(),
    payment_date: timestamp("payment_date").defaultNow(),
    ticket_id: integer("ticket_id")
        .references(() => ticketTable.ticket_id, { onDelete: "cascade" }), // Linking payment to a ticket
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
});

// Define types for insertion and selection
export type TIUsers = typeof userTable.$inferInsert;
export type TSUsers = typeof userTable.$inferSelect;

export type TIBookings = typeof bookingTable.$inferInsert;
export type TSBookings = typeof bookingTable.$inferSelect;

export type TISeats = typeof seatTable.$inferInsert;
export type TSSeats = typeof seatTable.$inferSelect;

export type TIVehicles = typeof vehicleTable.$inferInsert;
export type TSVehicles = typeof vehicleTable.$inferSelect;

export type TITickets = typeof ticketTable.$inferInsert;
export type TSTickets = typeof ticketTable.$inferSelect;

export type TIPayments = typeof paymentsTable.$inferInsert;
export type TSPayments = typeof paymentsTable.$inferSelect;
