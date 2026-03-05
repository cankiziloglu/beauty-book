ALTER TYPE "public"."dayOfWeek" RENAME TO "day_of_week";--> statement-breakpoint
ALTER TABLE "appointment" RENAME COLUMN "startTime" TO "start_time";--> statement-breakpoint
ALTER TABLE "appointment" RENAME COLUMN "endTime" TO "end_time";--> statement-breakpoint
ALTER TABLE "appointment" RENAME COLUMN "bufferEndTime" TO "buffer_end_time";--> statement-breakpoint
ALTER TABLE "appointment" RENAME COLUMN "priceCents" TO "price_cents";--> statement-breakpoint
ALTER TABLE "appointment" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "appointment" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "appointment" RENAME COLUMN "clinicId" TO "clinic_id";--> statement-breakpoint
ALTER TABLE "appointment" RENAME COLUMN "clientId" TO "client_id";--> statement-breakpoint
ALTER TABLE "appointment" RENAME COLUMN "practitionerId" TO "practitioner_id";--> statement-breakpoint
ALTER TABLE "appointment" RENAME COLUMN "treatmentId" TO "treatment_id";--> statement-breakpoint
ALTER TABLE "appointment" RENAME COLUMN "roomId" TO "room_id";--> statement-breakpoint
ALTER TABLE "availability" RENAME COLUMN "startTime" TO "start_time";--> statement-breakpoint
ALTER TABLE "availability" RENAME COLUMN "endTime" TO "end_time";--> statement-breakpoint
ALTER TABLE "availability" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "availability" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "availability" RENAME COLUMN "practitionerId" TO "practitioner_id";--> statement-breakpoint
ALTER TABLE "clinic" RENAME COLUMN "phoneNumber" TO "phone_number";--> statement-breakpoint
ALTER TABLE "clinic" RENAME COLUMN "minAdvanceHours" TO "min_advance_hours";--> statement-breakpoint
ALTER TABLE "clinic" RENAME COLUMN "maxAdvanceDays" TO "max_advance_days";--> statement-breakpoint
ALTER TABLE "clinic" RENAME COLUMN "cancellationHours" TO "cancellation_hours";--> statement-breakpoint
ALTER TABLE "clinic" RENAME COLUMN "isActive" TO "is_active";--> statement-breakpoint
ALTER TABLE "clinic" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "clinic" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "clinic" RENAME COLUMN "adminId" TO "admin_id";--> statement-breakpoint
ALTER TABLE "practitioner" RENAME COLUMN "isActive" TO "is_active";--> statement-breakpoint
ALTER TABLE "practitioner" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "practitioner" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "practitioner" RENAME COLUMN "clinicId" TO "clinic_id";--> statement-breakpoint
ALTER TABLE "practitionerTreatment" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "practitionerTreatment" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "practitionerTreatment" RENAME COLUMN "practitionerId" TO "practitioner_id";--> statement-breakpoint
ALTER TABLE "practitionerTreatment" RENAME COLUMN "treatmentId" TO "treatment_id";--> statement-breakpoint
ALTER TABLE "room" RENAME COLUMN "isActive" TO "is_active";--> statement-breakpoint
ALTER TABLE "room" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "room" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "room" RENAME COLUMN "clinicId" TO "clinic_id";--> statement-breakpoint
ALTER TABLE "roomTreatment" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "roomTreatment" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "roomTreatment" RENAME COLUMN "roomId" TO "room_id";--> statement-breakpoint
ALTER TABLE "roomTreatment" RENAME COLUMN "treatmentId" TO "treatment_id";--> statement-breakpoint
ALTER TABLE "treatment" RENAME COLUMN "priceCents" TO "price_cents";--> statement-breakpoint
ALTER TABLE "treatment" RENAME COLUMN "isActive" TO "is_active";--> statement-breakpoint
ALTER TABLE "treatment" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "treatment" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "treatment" RENAME COLUMN "clinicId" TO "clinic_id";--> statement-breakpoint
ALTER TABLE "unavailability" RENAME COLUMN "startTime" TO "start_time";--> statement-breakpoint
ALTER TABLE "unavailability" RENAME COLUMN "endTime" TO "end_time";--> statement-breakpoint
ALTER TABLE "unavailability" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "unavailability" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "unavailability" RENAME COLUMN "practitionerId" TO "practitioner_id";--> statement-breakpoint
ALTER TABLE "appointment" DROP CONSTRAINT "appointment_clinicId_clinic_id_fk";
--> statement-breakpoint
ALTER TABLE "appointment" DROP CONSTRAINT "appointment_clientId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "appointment" DROP CONSTRAINT "appointment_practitionerId_practitioner_id_fk";
--> statement-breakpoint
ALTER TABLE "appointment" DROP CONSTRAINT "appointment_treatmentId_treatment_id_fk";
--> statement-breakpoint
ALTER TABLE "appointment" DROP CONSTRAINT "appointment_roomId_room_id_fk";
--> statement-breakpoint
ALTER TABLE "availability" DROP CONSTRAINT "availability_practitionerId_practitioner_id_fk";
--> statement-breakpoint
ALTER TABLE "clinic" DROP CONSTRAINT "clinic_adminId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "practitioner" DROP CONSTRAINT "practitioner_clinicId_clinic_id_fk";
--> statement-breakpoint
ALTER TABLE "practitionerTreatment" DROP CONSTRAINT "practitionerTreatment_practitionerId_practitioner_id_fk";
--> statement-breakpoint
ALTER TABLE "practitionerTreatment" DROP CONSTRAINT "practitionerTreatment_treatmentId_treatment_id_fk";
--> statement-breakpoint
ALTER TABLE "room" DROP CONSTRAINT "room_clinicId_clinic_id_fk";
--> statement-breakpoint
ALTER TABLE "roomTreatment" DROP CONSTRAINT "roomTreatment_roomId_room_id_fk";
--> statement-breakpoint
ALTER TABLE "roomTreatment" DROP CONSTRAINT "roomTreatment_treatmentId_treatment_id_fk";
--> statement-breakpoint
ALTER TABLE "treatment" DROP CONSTRAINT "treatment_clinicId_clinic_id_fk";
--> statement-breakpoint
ALTER TABLE "unavailability" DROP CONSTRAINT "unavailability_practitionerId_practitioner_id_fk";
--> statement-breakpoint
ALTER TABLE "practitionerTreatment" DROP CONSTRAINT "practitionerTreatment_practitionerId_treatmentId_pk";--> statement-breakpoint
ALTER TABLE "roomTreatment" DROP CONSTRAINT "roomTreatment_roomId_treatmentId_pk";--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "created_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "created_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "created_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "created_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "practitionerTreatment" ADD CONSTRAINT "practitionerTreatment_practitioner_id_treatment_id_pk" PRIMARY KEY("practitioner_id","treatment_id");--> statement-breakpoint
ALTER TABLE "roomTreatment" ADD CONSTRAINT "roomTreatment_room_id_treatment_id_pk" PRIMARY KEY("room_id","treatment_id");--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_clinic_id_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinic"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_client_id_user_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_practitioner_id_practitioner_id_fk" FOREIGN KEY ("practitioner_id") REFERENCES "public"."practitioner"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_treatment_id_treatment_id_fk" FOREIGN KEY ("treatment_id") REFERENCES "public"."treatment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_room_id_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "availability" ADD CONSTRAINT "availability_practitioner_id_practitioner_id_fk" FOREIGN KEY ("practitioner_id") REFERENCES "public"."practitioner"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clinic" ADD CONSTRAINT "clinic_admin_id_user_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practitioner" ADD CONSTRAINT "practitioner_clinic_id_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinic"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practitionerTreatment" ADD CONSTRAINT "practitionerTreatment_practitioner_id_practitioner_id_fk" FOREIGN KEY ("practitioner_id") REFERENCES "public"."practitioner"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practitionerTreatment" ADD CONSTRAINT "practitionerTreatment_treatment_id_treatment_id_fk" FOREIGN KEY ("treatment_id") REFERENCES "public"."treatment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room" ADD CONSTRAINT "room_clinic_id_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinic"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roomTreatment" ADD CONSTRAINT "roomTreatment_room_id_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roomTreatment" ADD CONSTRAINT "roomTreatment_treatment_id_treatment_id_fk" FOREIGN KEY ("treatment_id") REFERENCES "public"."treatment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "treatment" ADD CONSTRAINT "treatment_clinic_id_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinic"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unavailability" ADD CONSTRAINT "unavailability_practitioner_id_practitioner_id_fk" FOREIGN KEY ("practitioner_id") REFERENCES "public"."practitioner"("id") ON DELETE cascade ON UPDATE no action;