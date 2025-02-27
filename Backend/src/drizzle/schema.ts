import { 
    pgTable, 
    pgEnum, 
    serial, 
    varchar, 
    timestamp, 
    boolean, 
    text, 
    integer, 
    numeric, 
    index 
  } from "drizzle-orm/pg-core";
  
// Enums
export const roleEnum = pgEnum("user_type", ["user", "admin", "super_admin", "disabled"]);
export const bookingStatusEnum = pgEnum("booking_status", ["pending", "confirmed", "completed", "cancelled"]);
export const ticketStatusEnum = pgEnum("ticket_status", ["paid", "failed", "refunded"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "completed", "failed", "refunded"]);



// Contact Messages Table
export const contactsTable = pgTable("contacts", {
    contact_id: serial("contact_id").primaryKey(),
    user_id: integer("user_id").references(() => userTable.user_id, { onDelete: "cascade" }), // Optional, for logged-in users
    full_name: varchar("full_name", { length: 255 }).notNull(), // Name of sender
    email: varchar("email", { length: 255 }).notNull(), // Email of sender
    subject: varchar("subject", { length: 255 }).notNull(), // Contact subject
    message: text("message").notNull(), // Message content
    is_resolved: boolean("is_resolved").default(false), // Flag to track resolved/unresolved messages
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
});

// Auth Table
export const authTable = pgTable("auth", {
    auth_id: serial("auth_id").primaryKey(),
    user_id: integer("user_id").notNull().references(() => userTable.user_id, { onDelete: "cascade" }),
    username: varchar("username", { length: 255 }).unique(),
    password_hash: varchar("password_hash", { length: 255 }).notNull(),
    role: roleEnum("role").default("user"), // e.g., 'user', 'admin'
    verification_token: varchar("verification_token", { length: 255 }),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
    is_deleted: boolean("is_deleted").default(false),
});
// Users Table
export const userTable = pgTable("users", {
    user_id: serial("user_id").primaryKey(),
    first_name: varchar("first_name"),
    last_name: varchar("last_name"),
    email: varchar("email").notNull().unique(),
    phone_number: varchar("phone_number"),
    password: varchar("password", { length: 255 }).notNull(),
    image_url: varchar("image_url", { length: 255 }),
    isVerified: boolean("is_verified").default(false),
    role: roleEnum("role").default("user"), // e.g., 'user', 'admin'
    verification_token: varchar("verification_token", { length: 255 }), // For email verification
    verification_token_expires_at: timestamp('verification_token_expires_at', { mode: 'date' }),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
    is_deleted: boolean("is_deleted").default(false),
});

// Vehicles Table
export const vehicleTable = pgTable("vehicles", {
    registration_number: varchar("registration_number").primaryKey(),
    vehicle_name: varchar("vehicle_name", { length: 100 }).notNull(),
    license_plate: varchar("license_plate", { length: 20 }).notNull().unique(),
    capacity: integer("capacity").notNull(),
    vehicle_type: varchar("vehicle_type", { length: 50 }).notNull(),
    cost:integer("cost").notNull(),
    model_year: integer("model_year"),
    current_location: varchar("current_location", { length: 255 }).notNull(),
    departure: varchar("departure").notNull(),
    destination: varchar("destination").notNull(),
    is_active: boolean("is_active").default(true),
    image_url: varchar("image_url", { length: 255 }),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
    is_deleted: boolean("is_deleted").default(false),

});


export const ticketTable = pgTable("tickets", {
    ticket_id: serial("ticket_id").primaryKey(),
    user_id: integer("user_id").notNull().references(() => userTable.user_id, { onDelete: "cascade" }),
    subject: varchar("subject").notNull(),
    description: text("description").notNull(),
    status: ticketStatusEnum("ticket_status").default("paid"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
});

export const paymentsTable = pgTable("payments", {
    payment_id: serial("payment_id").primaryKey(),
    booking_id: integer("booking_id")
      .notNull()
      .references(() => bookingTable.booking_id, { onDelete: "cascade" }),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    payment_method: varchar("payment_method", { length: 50 }).notNull(),
    payment_status: paymentStatusEnum("payment_status").default("pending"),
    transaction_reference: varchar("transaction_reference", { length: 255 }).notNull().unique(),
    payment_date: timestamp("payment_date").defaultNow(),
    phone_number: varchar("phone_number", { length: 20 }).notNull(), // ✅ Add this line
    ticket_id: integer("ticket_id")
      .references(() => ticketTable.ticket_id, { onDelete: "cascade" }),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
  }, (table) => ({
    bookingIndex: index("booking_id_idx").on(table.booking_id), // ✅ Correct way to add an index
  }));
  



// 🚀 1️⃣ Seat Table (Seats are generic across vehicles)
// export const seatTable = pgTable("seats", {
//     seat_id: serial("seat_id").primaryKey(),
//     seat_number: varchar("seat_number").notNull(),
//     is_available: boolean("is_available").default(true), 
//     seat_type: varchar("seat_type").default("regular"),
//     created_at: timestamp("created_at").defaultNow(),
//     updated_at: timestamp("updated_at").defaultNow(),
// });


export const bookingTable = pgTable("bookings", {
    booking_id: serial("booking_id").primaryKey(),
    user_id: integer("user_id").notNull()
      .references(() => userTable.user_id, { onDelete: "cascade" }),
    vehicle_id: varchar("vehicle_id").notNull(),
    departure_date: timestamp("departure_date").notNull(),
    departure_time: varchar("departure_time").notNull(),
    departure: varchar("departure"),
    destination: varchar("destination"),
    estimated_arrival: varchar("estimated_arrival"),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    total_price: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
    booking_status: bookingStatusEnum("booking_status").default("pending"),
    booking_date: timestamp("booking_date").defaultNow(),
    is_active: boolean("is_active").default(true),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
  }, (table) => ({
    userIndex: index("user_id_idx").on(table.user_id), // ✅ Adding an index on user_id
  }));
  
// });

// 🚀 3️⃣ Bookings Seats Table (Tracks seat selection per booking)
export const bookingsSeatsTable = pgTable("bookings_seats", {
    booking_seat_id: serial("booking_seat_id").primaryKey(),
    booking_id: integer("booking_id").notNull().references(() => bookingTable.booking_id, { onDelete: "cascade" }),
    seat_id: integer("seat_id").notNull(), // ✅ Seat ID is stored, NOT seat number
    vehicle_id: varchar("vehicle_id").notNull(), // ✅ Ensures seat is linked to a specific vehicle
}, (table) => ({
    uniqueBookingSeat: { unique: [table.booking_id, table.seat_id, table.vehicle_id] } // ✅ Allows the same seat to be used in different vehicles
}));

// Define types for insertion and selection
export type TIUsers = typeof userTable.$inferInsert;
export type TSUsers = typeof userTable.$inferSelect;

export type TIBookings = typeof bookingTable.$inferInsert;
export type TSBookings = typeof bookingTable.$inferSelect;

export type TIVehicles = typeof vehicleTable.$inferInsert;
export type TSVehicles = typeof vehicleTable.$inferSelect;

export type TITickets = typeof ticketTable.$inferInsert;
export type TSTickets = typeof ticketTable.$inferSelect;

export type TIPayments = typeof paymentsTable.$inferInsert;
export type TSPayments = typeof paymentsTable.$inferSelect;

export type TIAuth = typeof authTable.$inferInsert;
export type TSAuth = typeof authTable.$inferSelect;

export type TIBookingSeat = typeof bookingsSeatsTable.$inferInsert;
export type TSBookingSeat = typeof bookingsSeatsTable.$inferSelect;

export type TIContact = typeof contactsTable.$inferInsert;
export type TSContact = typeof contactsTable.$inferSelect;

