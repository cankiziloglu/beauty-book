import db from "@/db/db";
import { practitioner, practitionerTreatment, treatment } from "@/db/schema";
import { NewPractitioner, Practitioner, Practitioners } from "@/lib/validators";
import { and, desc, eq } from "drizzle-orm";

export async function getPractitioners(clinicId: number) {
  try {
    const practitioners: Practitioners[] = await db
      .select({
        id: practitioner.id,
        name: practitioner.name,
        bio: practitioner.bio,
        isActive: practitioner.isActive
      })
      .from(practitioner)
      .where(
          eq(practitioner.clinicId, clinicId),
      );
    return {
      success: true,
      message: "Get all practitioners",
      data: practitioners,
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occured reading data",
      data: error,
    };
  }
}

export async function createPractitioner(data: NewPractitioner) {
  try {
    const newPractitioner = await db
      .insert(practitioner)
      .values({
        name: data.name,
        bio: data.bio,
        clinicId: data.clinicId,
      })
      .returning({
        id: practitioner.id,
      });
    return {
      success: true,
      message: "Practitioner created",
      data: newPractitioner[0],
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occured writing to the database",
      data: error,
    };
  }
}

export async function getPractitioner(clinicId: number, id: number) {
  try {
    const practitionerDetail: Practitioner[] = await db
      .select({
        id: practitioner.id,
        name: practitioner.name,
        bio: practitioner.bio,
        isActive: practitioner.isActive,
        treatmentId: practitionerTreatment.treatmentId,
        treatmentName: treatment.name,
        description: treatment.description,
        duration: treatment.duration,
      })
      .from(practitioner)
      .where(
        and(
          eq(practitioner.clinicId, clinicId),
          eq(practitioner.id, id),
        ),
      )
      .leftJoin(
        practitionerTreatment,
        eq(practitionerTreatment.practitionerId, practitioner.id),
      )
      .leftJoin(
        treatment,
        eq(treatment.id, practitionerTreatment.treatmentId),
      )
      .orderBy(desc(practitionerTreatment.createdAt));
    return {
      success: true,
      message: "Practitioner details retrieved",
      data: practitionerDetail[0],
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occured reading data",
      data: error,
    };
  }
}
