import { clinic, practitioner, treatment } from "@/db/schema";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import * as z from "zod";

export const getAllClinicsSchema = createSelectSchema(clinic).pick({
  id: true,
  name: true,
  slug: true,
  phoneNumber: true,
  address: true,
});
export type Clinics = z.infer<typeof getAllClinicsSchema>;

export const createClinicSchema = createInsertSchema(clinic, {
  email: z.email(),
});
export type NewClinic = z.infer<typeof createClinicSchema>;

export const updateClinicSchema = createUpdateSchema(clinic);
export type UpdateClinic = z.infer<typeof updateClinicSchema>;

export const selectPractitionerSchema = createSelectSchema(practitioner);
export const createPractitionerSchema = createInsertSchema(practitioner);
export const updatePractitionerSchema = createUpdateSchema(practitioner);

export const selectTreatmentSchema = createSelectSchema(treatment);
export const createTreatmentSchema = createInsertSchema(treatment);
export const updateTreatmentSchema = createUpdateSchema(treatment);
