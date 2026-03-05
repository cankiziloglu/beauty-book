CREATE TABLE "client" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "client_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"address" text,
	"phone_number" text NOT NULL,
	"late_cancel_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"user_id" text NOT NULL,
	"clinic_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "appointment" DROP CONSTRAINT "appointment_client_id_user_id_fk";
--> statement-breakpoint
DROP INDEX "appointment_client_idx";--> statement-breakpoint
ALTER TABLE "appointment" ADD COLUMN "customer_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "client" ADD CONSTRAINT "client_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client" ADD CONSTRAINT "client_clinic_id_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinic"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "client_id_idx" ON "client" USING btree ("id");--> statement-breakpoint
CREATE INDEX "client_clinic_idx" ON "client" USING btree ("clinic_id");--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_customer_id_client_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."client"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "appointment_client_idx" ON "appointment" USING btree ("customer_id");--> statement-breakpoint
ALTER TABLE "appointment" DROP COLUMN "client_id";