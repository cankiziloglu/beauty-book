CREATE TYPE "public"."dayOfWeek" AS ENUM('1', '2', '3', '4', '5', '6', '7');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('confirmed', 'cancelled', 'no-show', 'completed', 'late-cancel');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "appointment" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "appointment_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"date" date NOT NULL,
	"startTime" time with time zone NOT NULL,
	"endTime" time with time zone NOT NULL,
	"bufferEndTime" time with time zone NOT NULL,
	"status" "status",
	"notes" text,
	"priceCents" integer NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"clinicId" integer NOT NULL,
	"clientId" text NOT NULL,
	"practitionerId" integer NOT NULL,
	"treatmentId" integer NOT NULL,
	"roomId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "availability" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "availability_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"dayOfWeek" "dayOfWeek",
	"startTime" time with time zone NOT NULL,
	"endTime" time with time zone NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"practitionerId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clinic" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "clinic_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"email" text NOT NULL,
	"phoneNumber" text NOT NULL,
	"address" text NOT NULL,
	"timezone" text NOT NULL,
	"minAdvanceHours" integer NOT NULL,
	"maxAdvanceDays" integer NOT NULL,
	"cancellationHours" integer NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"adminId" text NOT NULL,
	CONSTRAINT "clinic_slug_unique" UNIQUE("slug"),
	CONSTRAINT "clinic_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "practitioner" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "practitioner_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"bio" text NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"clinicId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "practitionerTreatment" (
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"practitionerId" integer NOT NULL,
	"treatmentId" integer NOT NULL,
	CONSTRAINT "practitionerTreatment_practitionerId_treatmentId_pk" PRIMARY KEY("practitionerId","treatmentId")
);
--> statement-breakpoint
CREATE TABLE "room" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "room_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"clinicId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roomTreatment" (
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"roomId" integer NOT NULL,
	"treatmentId" integer NOT NULL,
	CONSTRAINT "roomTreatment_roomId_treatmentId_pk" PRIMARY KEY("roomId","treatmentId")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "treatment" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "treatment_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"description" text,
	"duration" integer NOT NULL,
	"buffer" integer NOT NULL,
	"priceCents" integer NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"clinicId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "unavailability" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "unavailability_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"dayOfWeek" "dayOfWeek",
	"startTime" time with time zone NOT NULL,
	"endTime" time with time zone NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"practitionerId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_clinicId_clinic_id_fk" FOREIGN KEY ("clinicId") REFERENCES "public"."clinic"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_clientId_user_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_practitionerId_practitioner_id_fk" FOREIGN KEY ("practitionerId") REFERENCES "public"."practitioner"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_treatmentId_treatment_id_fk" FOREIGN KEY ("treatmentId") REFERENCES "public"."treatment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_roomId_room_id_fk" FOREIGN KEY ("roomId") REFERENCES "public"."room"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "availability" ADD CONSTRAINT "availability_practitionerId_practitioner_id_fk" FOREIGN KEY ("practitionerId") REFERENCES "public"."practitioner"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clinic" ADD CONSTRAINT "clinic_adminId_user_id_fk" FOREIGN KEY ("adminId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practitioner" ADD CONSTRAINT "practitioner_clinicId_clinic_id_fk" FOREIGN KEY ("clinicId") REFERENCES "public"."clinic"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practitionerTreatment" ADD CONSTRAINT "practitionerTreatment_practitionerId_practitioner_id_fk" FOREIGN KEY ("practitionerId") REFERENCES "public"."practitioner"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practitionerTreatment" ADD CONSTRAINT "practitionerTreatment_treatmentId_treatment_id_fk" FOREIGN KEY ("treatmentId") REFERENCES "public"."treatment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room" ADD CONSTRAINT "room_clinicId_clinic_id_fk" FOREIGN KEY ("clinicId") REFERENCES "public"."clinic"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roomTreatment" ADD CONSTRAINT "roomTreatment_roomId_room_id_fk" FOREIGN KEY ("roomId") REFERENCES "public"."room"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roomTreatment" ADD CONSTRAINT "roomTreatment_treatmentId_treatment_id_fk" FOREIGN KEY ("treatmentId") REFERENCES "public"."treatment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "treatment" ADD CONSTRAINT "treatment_clinicId_clinic_id_fk" FOREIGN KEY ("clinicId") REFERENCES "public"."clinic"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unavailability" ADD CONSTRAINT "unavailability_practitionerId_practitioner_id_fk" FOREIGN KEY ("practitionerId") REFERENCES "public"."practitioner"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");