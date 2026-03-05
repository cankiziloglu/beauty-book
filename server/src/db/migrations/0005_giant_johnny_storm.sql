ALTER TABLE "appointment" DROP CONSTRAINT "appointment_customer_id_client_id_fk";
--> statement-breakpoint
DROP INDEX "appointment_client_idx";--> statement-breakpoint
ALTER TABLE "appointment" ADD COLUMN "client_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "appointment_client_idx" ON "appointment" USING btree ("client_id");--> statement-breakpoint
ALTER TABLE "appointment" DROP COLUMN "customer_id";