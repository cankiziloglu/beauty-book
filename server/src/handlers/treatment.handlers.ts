import db from "@/db/db";
import { practitioner, practitionerTreatment, room, roomTreatment, treatment } from "@/db/schema";
import { NewTreatment, Treatment, Treatments, UpdateTreatment } from "@/lib/validators";
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

// TODO: check if id is valid before reading
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

// TODO: check if id is valid before updating, activating or deactivating
export async function updateTreatment(clinicId: number, id: number, data: UpdateTreatment) {
  try {
    const updatedTreatment = await db
      .update(treatment)
      .set({ ...data })
      .where(
        and(
          eq(treatment.clinicId, clinicId),
          eq(treatment.id, id),
        ),
      )
      .returning({
        id: treatment.id,
        name: treatment.name,
        description: treatment.description,
        duration: treatment.duration,
        buffer: treatment.buffer,
        priceCents: treatment.priceCents,
        isActive: treatment.isActive
      });
    return {
      success: true,
      message: "Treatment updated",
      data: updatedTreatment[0],
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occured writing to the database",
      data: error,
    };
  }
}

// TODO: check if id is valid before updating, activating or deactivating
// TODO: check if treatment is assigned to any appointment before deactivating
export async function deactivateTreatment(clinicId: number, id: number) {
  try {
    await db
      .update(treatment)
      .set({ isActive: false })
      .where(
        and(
          eq(treatment.clinicId, clinicId),
          eq(treatment.id, id),
        ),
      );
    return {
      success: true,
      message: "Treatment deactivated",
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occured writing to the database",
      data: error,
    };
  }
}

// TODO: check if id is valid before updating, activating or deactivating
export async function activateTreatment(clinicId: number, id: number) {
  try {
    await db
      .update(treatment)
      .set({ isActive: true })
      .where(
        and(
          eq(treatment.clinicId, clinicId),
          eq(treatment.id, id),
        ),
      );
    return {
      success: true,
      message: "Treatment activated",
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occured writing to the database",
      data: error,
    };
  }
}

// TODO: check if roomId is valid and room is active before adding to treatment
export async function addRoomToTreatment(treatmentId: number, roomId: number) {
  try {
    await db
      .insert(roomTreatment)
      .values({
        treatmentId,
        roomId,
      });
    return {
      success: true,
      message: "Room added to treatment",
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occured writing to the database",
      data: error,
    };
  }
}

// TODO: check if roomId is valid before removing from treatment
export async function removeRoomFromTreatment(treatmentId: number, roomId: number) {
  try {
    await db
      .delete(roomTreatment)
      .where(
        and(
          eq(roomTreatment.treatmentId, treatmentId),
          eq(roomTreatment.roomId, roomId),
        ),
      );
    return {
      success: true,
      message: "Room removed from treatment",
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occured writing to the database",
      data: error,
    };
  }
}

