CREATE INDEX "appointment_clinic_idx" ON "appointment" USING btree ("clinic_id");--> statement-breakpoint
CREATE INDEX "appointment_client_idx" ON "appointment" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "appointment_practitioner_idx" ON "appointment" USING btree ("practitioner_id");--> statement-breakpoint
CREATE INDEX "appointment_room_idx" ON "appointment" USING btree ("room_id");--> statement-breakpoint
CREATE INDEX "availability_practitioner_idx" ON "availability" USING btree ("practitioner_id");--> statement-breakpoint
CREATE INDEX "clinic_slug_idx" ON "clinic" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "clinic_id_idx" ON "clinic" USING btree ("id");--> statement-breakpoint
CREATE INDEX "practitioner_id_idx" ON "practitioner" USING btree ("id");--> statement-breakpoint
CREATE INDEX "practitioner_clinic_idx" ON "practitioner" USING btree ("clinic_id");--> statement-breakpoint
CREATE INDEX "treatment_practitioner_idx" ON "practitionerTreatment" USING btree ("practitioner_id");--> statement-breakpoint
CREATE INDEX "practitioner_treatment_idx" ON "practitionerTreatment" USING btree ("treatment_id");--> statement-breakpoint
CREATE INDEX "treatment_id_idx" ON "treatment" USING btree ("id");--> statement-breakpoint
CREATE INDEX "treatment_clinic_idx" ON "treatment" USING btree ("clinic_id");--> statement-breakpoint
CREATE INDEX "unavailability_practitioner_idx" ON "unavailability" USING btree ("practitioner_id");