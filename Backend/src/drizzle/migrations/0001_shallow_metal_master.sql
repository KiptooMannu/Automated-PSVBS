CREATE TABLE IF NOT EXISTS "bookingTable" (
	"booking_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"departure" varchar NOT NULL,
	"destination" varchar NOT NULL,
	"departure_date" timestamp NOT NULL,
	"departure_time" varchar NOT NULL,
	"estimated_arrival" varchar NOT NULL,
	"seat_number" varchar NOT NULL,
	"price" numeric NOT NULL,
	"discount" numeric DEFAULT '0',
	"total_price" numeric NOT NULL,
	"booking_status" varchar DEFAULT 'pending',
	"is_cancelled" boolean DEFAULT false,
	"is_paid" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"payment_method" varchar DEFAULT 'cash',
	"payment_status" varchar DEFAULT 'pending',
	"payment_date" timestamp,
	"booking_date" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookingTable" ADD CONSTRAINT "bookingTable_user_id_userTable_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."userTable"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
