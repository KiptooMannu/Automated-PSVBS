CREATE TABLE IF NOT EXISTS "vehiclesTable" (
	"registration_number" varchar PRIMARY KEY NOT NULL,
	"vehicle_name" varchar NOT NULL,
	"vehicle_type" varchar NOT NULL,
	"vehicle_model" varchar NOT NULL,
	"vehicle_capacity" integer NOT NULL,
	"vehicle_number" varchar NOT NULL,
	"vehicle_status" varchar DEFAULT 'active',
	"availability" varchar DEFAULT 'open',
	"destination_routes" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
