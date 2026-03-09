import {
  clinic,
  practitioner,
  practitionerTreatment,
  treatment,
} from "@/db/schema";
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
  minAdvanceHours: z.coerce.number(),
  maxAdvanceDays: z.coerce.number(),
  cancellationHours: z.coerce.number(),
}).omit({
  slug: true,
  adminId: true,
});
export type NewClinic = z.infer<typeof createClinicSchema> & {
  adminId: string;
};

export const updateClinicSchema = createUpdateSchema(clinic, {
  email: z.email().optional(),
  minAdvanceHours: z.coerce.number().optional(),
  maxAdvanceDays: z.coerce.number().optional(),
  cancellationHours: z.coerce.number().optional(),
});
export type UpdateClinic = z.infer<typeof updateClinicSchema>;

export const getPractitionerSchema = createSelectSchema(practitioner).pick({
  id: true,
  name: true,
  bio: true,
});
export type Practitioners = z.infer<typeof getPractitionerSchema>;

export const createPractitionerSchema = createInsertSchema(practitioner).omit({
  clinicId: true,
});
export type NewPractitioner = z.infer<typeof createPractitionerSchema> & {
  clinicId: number;
};

export const updatePractitionerSchema = createUpdateSchema(practitioner);
export type UpdatePractitioner = z.infer<typeof updatePractitionerSchema>;

export const getPractitionerTreatmentsSchema = createSelectSchema(
  practitionerTreatment,
);

export const createPractitionerTreatmentSchema = createInsertSchema(
  practitionerTreatment,
);
export const updatePractitionerTreatmentSchema = createUpdateSchema(
  practitionerTreatment,
);

export const getTreatmentSchema = createSelectSchema(treatment);
export const createTreatmentSchema = createInsertSchema(treatment);
export const updateTreatmentSchema = createUpdateSchema(treatment);
