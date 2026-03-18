import {
  clinic,
  practitioner,
  practitionerTreatment,
  room,
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
  isActive: true
});

// This type is used for the getPractitioners handler, which doesn't return the practitioner's treatments.
export type Practitioners = z.infer<typeof getPractitionerSchema>;

// This type is used for the getPractitioner handler, which returns the practitioner's treatments as well. The treatment fields are nullable because a practitioner may not have any treatments.
export type Practitioner = Practitioners & {
  treatmentId: number | null;
  treatmentName: string | null;
  description: string | null;
  duration: number | null;
};

export const createPractitionerSchema = createInsertSchema(practitioner).omit({
  clinicId: true,
});

// clinicId isn't necessary for zod validation, but is necessary for the NewPractitioner type.
export type NewPractitioner = z.infer<typeof createPractitionerSchema> & {
  clinicId: number;
};

export const updatePractitionerSchema = createUpdateSchema(practitioner);
export type UpdatePractitioner = z.infer<typeof updatePractitionerSchema>;


export const getTreatmentSchema = createSelectSchema(treatment).pick({
  id: true,
  name: true,
  description: true,
  duration: true,
  buffer: true,
  priceCents: true,
  isActive: true
});
export type Treatments = z.infer<typeof getTreatmentSchema>;

export type Treatment = Treatments & {
  practitionerId: number | null;
  practitionerName: string | null;
  roomId: number | null;
  roomName: string | null;
};


// This schema is used for zod validation when creating a new treatment. clinicId is omitted because it's not necessary for validation, but it's included in the NewTreatment type because it's necessary for creating a new treatment in the database.
export const createTreatmentSchema = createInsertSchema(treatment, {
  name: z.string().min(1),
  description: z.string().min(1),
  duration: z.coerce.number().positive(),
  buffer: z.coerce.number().nonnegative(),
  priceCents: z.coerce.number().nonnegative(),
}).omit({
  clinicId: true,
});
export type NewTreatment = z.infer<typeof createTreatmentSchema> & {
  clinicId: number;
};

export const updateTreatmentSchema = createUpdateSchema(treatment, {
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  duration: z.coerce.number().positive().optional(),
  buffer: z.coerce.number().nonnegative().optional(),
  priceCents: z.coerce.number().nonnegative().optional(),
});
export type UpdateTreatment = z.infer<typeof updateTreatmentSchema>;


export const getRoomSchema = createSelectSchema(room).pick({
  id: true,
  name: true,
  isActive: true
});
export type Rooms = z.infer<typeof getRoomSchema>;

export type Room = Rooms & {
  treatmentId: number | null;
  treatmentName: string | null;
};

export const createRoomSchema = createInsertSchema(room).omit({
  clinicId: true,
});
export type NewRoom = z.infer<typeof createRoomSchema> & {
  clinicId: number;
};

export const updateRoomSchema = createUpdateSchema(room);
export type UpdateRoom = z.infer<typeof updateRoomSchema>;


export const createPractitionerTreatmentSchema = createInsertSchema(
  practitionerTreatment,
);
export const updatePractitionerTreatmentSchema = createUpdateSchema(
  practitionerTreatment,
);