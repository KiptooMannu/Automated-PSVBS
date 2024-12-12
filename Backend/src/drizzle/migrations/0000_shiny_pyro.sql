CREATE TYPE "public"."user_type" AS ENUM('user', 'admin', 'super_admin', 'disabled');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "userTable" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar,
	"last_name" varchar,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"phone_number" varchar,
	"user_type" "user_type" DEFAULT 'user',
	"image_url" varchar(255),
	"isVerified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "userTable_email_unique" UNIQUE("email")
);
