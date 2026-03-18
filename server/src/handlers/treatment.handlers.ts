import db from "@/db/db";
import { practitioner, practitionerTreatment, room, roomTreatment, treatment } from "@/db/schema";
import { NewTreatment, Treatment, Treatments } from "@/lib/validators";
import { and, desc, eq } from "drizzle-orm";


export async function getTreatments(clinicId: number) {
  try {
    const treatments: Treatments[] = await db.select({
      id: treatment.id,
      name: treatment.name,
      description: treatment.description,
      duration: treatment.duration,
      buffer: treatment.buffer,
      priceCents: treatment.priceCents,
      isActive: treatment.isActive
    }).from(treatment).where(eq(treatment.clinicId, clinicId))

    return {
      success: true,
      message: "Get all treatments",
      data: treatments,
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occured reading data",
      data: error,
    };
  }
}

export async function getTreatment(clinicId: number, id: number) {
 try {
   const treatmentDetail: Treatment[] = await db
    .select({
       id: treatment.id,
       name: treatment.name,
       description: treatment.description,
       duration: treatment.duration,
       buffer: treatment.buffer,
       priceCents: treatment.priceCents,
       isActive: treatment.isActive,
       practitionerId: practitionerTreatment.practitionerId,
       practitionerName: practitioner.name,
       roomId: roomTreatment.roomId,
       roomName: room.name
    })
     .from(treatment)
     .where(
      and(
         eq(treatment.clinicId, clinicId),
         eq(treatment.id, id),
       ),
    )
     .leftJoin(
       practitionerTreatment,
       eq(practitionerTreatment.treatmentId, treatment.id),
    )
     .leftJoin(
       practitioner,
       eq(practitioner.id, practitionerTreatment.practitionerId),
    )
     .leftJoin(
       roomTreatment,
       eq(roomTreatment.treatmentId, treatment.id)
    )
    .leftJoin(
      room,
      eq(room.id, roomTreatment.roomId)
    )
    .orderBy(desc(practitionerTreatment.createdAt));
   return {
     success: true,
     message: "Treatment details retrieved",
     data: treatmentDetail[0],
   };
 } catch (error) {
   return {
     success: false,
     message: "An error occured reading data",
     data: error,
   };
 }
}


export async function createTreatment(data: NewTreatment) {
  try {
    const newTreatment = await db
      .insert(treatment)
      .values({
        name: data.name,
        description: data.description,
        duration: data.duration,
        buffer: data.buffer,
        priceCents: data.priceCents,
        clinicId: data.clinicId,
      })
      .returning({
        id: treatment.id,
      });
    return {
      success: true,
      message: "Treatment created",
      data: newTreatment[0],
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occured writing to the database",
      data: error,
    };
  }
}
