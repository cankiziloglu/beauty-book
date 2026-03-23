import db from "@/db/db";
import { appointment, practitioner, practitionerTreatment, room, roomTreatment, treatment } from "@/db/schema";
import { SuccessResponse, ErrorResponse } from "@/lib/types";
import { NewTreatment, Practitioners, Rooms, Treatment, Treatments, UpdateTreatment } from "@/lib/validators";
import { and, desc, eq } from "drizzle-orm";


export async function getTreatments(clinicId: number): Promise<SuccessResponse<Treatments[]> | ErrorResponse> {
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
      status: 200,
      message: "Get all treatments",
      data: treatments,
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "An error occured reading data",
      data: error,
    };
  }
}

export async function getActiveTreatments(clinicId: number): Promise<SuccessResponse<Treatments[]> | ErrorResponse> {
  try {
    const treatments: Treatments[] = await db.select({
      id: treatment.id,
      name: treatment.name,
      description: treatment.description,
      duration: treatment.duration,
      buffer: treatment.buffer,
      priceCents: treatment.priceCents,
      isActive: treatment.isActive
    }).from(treatment).where(and(eq(treatment.clinicId, clinicId), eq(treatment.isActive, true)))
    return {
      success: true,
      status: 200,
      message: "Get all active treatments",
      data: treatments,
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "An error occured reading data",
      data: error,
    };
  }
}

export async function getTreatment(clinicId: number, id: number): Promise<SuccessResponse<Treatment> | ErrorResponse> {
 try {
   const treatmentToGet: Treatments[] = await db.select({
      id: treatment.id,
      name: treatment.name,
      description: treatment.description,
      duration: treatment.duration,
      buffer: treatment.buffer,
      priceCents: treatment.priceCents,
      isActive: treatment.isActive
    }).from(treatment).where(
    and(
      eq(treatment.clinicId, clinicId),
      eq(treatment.id, id),
    ),
   );
   if (treatmentToGet.length === 0) {
     return {
       success: false,
       status: 400,
       message: "Invalid treatment id",
       data: null
     }
   }
   const practitionersForTreatment: Practitioners[] = await db
    .select({
      id: practitioner.id,
      name: practitioner.name,
      bio: practitioner.bio,
      isActive: practitioner.isActive,
    })
    .from(practitioner)
    .where(
      and(
        eq(practitionerTreatment.treatmentId, id),
        eq(practitionerTreatment.practitionerId, practitioner.id),
      ),
    )
    .leftJoin(
      practitionerTreatment,
      eq(practitionerTreatment.practitionerId, practitioner.id)
    );
   const roomsForTreatment: Rooms[] = await db
    .select({
      id: room.id,
      name: room.name,
      isActive: room.isActive,
    })
    .from(room)
    .where(
      and(
        eq(roomTreatment.treatmentId, id),
        eq(roomTreatment.roomId, room.id),
      ),
    )
    .leftJoin(
      roomTreatment,
      eq(roomTreatment.roomId, room.id)
    );
   const treatmentDetail: Treatment = {
     ...treatmentToGet[0],
     practitioners: practitionersForTreatment,
      rooms: roomsForTreatment
   }
   return {
     success: true,
     status: 200,
     message: "Treatment details retrieved",
     data: treatmentDetail,
   };
 } catch (error) {
   return {
     success: false,
     status: 500,
     message: "An error occured reading data",
     data: error,
   };
 }
}

export async function getActiveTreatment(clinicId: number, id: number): Promise<SuccessResponse<Treatment> | ErrorResponse> {
 try {
   // check if treatment id is valid and treatment is active before reading
   const treatmentToGet: Treatments[] = await db.select({
      id: treatment.id,
      name: treatment.name,
      description: treatment.description,
      duration: treatment.duration,
      buffer: treatment.buffer,
      priceCents: treatment.priceCents,
      isActive: treatment.isActive
    }).from(treatment).where(
    and(
      eq(treatment.clinicId, clinicId),
      eq(treatment.id, id),
      eq(treatment.isActive, true)
    ),
   );
   if (treatmentToGet.length === 0) {
     return {
       success: false,
       status: 400,
       message: "Invalid treatment id",
       data: null
     }
   }
   const practitionersForTreatment: Practitioners[] = await db
    .select({
      id: practitioner.id,
      name: practitioner.name,
      bio: practitioner.bio,
      isActive: practitioner.isActive,
    })
    .from(practitioner)
    .where(
      and(
        eq(practitionerTreatment.treatmentId, id),
        eq(practitionerTreatment.practitionerId, practitioner.id),
        eq(practitioner.isActive, true)
      ),
    )
    .leftJoin(
      practitionerTreatment,
      eq(practitionerTreatment.practitionerId, practitioner.id)
    );
   const roomsForTreatment: Rooms[] = await db
    .select({
      id: room.id,
      name: room.name,
      isActive: room.isActive,
    })
    .from(room)
    .where(
      and(
        eq(roomTreatment.treatmentId, id),
        eq(roomTreatment.roomId, room.id),
        eq(room.isActive, true)
      ),
    )
    .leftJoin(
      roomTreatment,
      eq(roomTreatment.roomId, room.id)
    );
   const treatmentDetail: Treatment = {
     ...treatmentToGet[0],
     practitioners: practitionersForTreatment,
      rooms: roomsForTreatment
   }
   return {
     success: true,
     status: 200,
     message: "Treatment details retrieved",
     data: treatmentDetail,
   };
 } catch (error) {
   return {
     success: false,
     status: 500,
     message: "An error occured reading data",
     data: error,
   };
 }
}

export async function createTreatment(data: NewTreatment): Promise<SuccessResponse<{ id: number }> | ErrorResponse> {
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
      status: 201,
      message: "Treatment created",
      data: newTreatment[0],
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "An error occured writing to the database",
      data: error,
    };
  }
}

export async function updateTreatment(clinicId: number, id: number, data: UpdateTreatment): Promise<SuccessResponse<Treatments> | ErrorResponse> {
  try {
    // check if treatment id is valid before updating
    const treatmentToUpdate = await db.select().from(treatment).where(
      and(
        eq(treatment.clinicId, clinicId),
        eq(treatment.id, id),
      ),
    );
    if (treatmentToUpdate.length === 0) {
      return {
        success: false,
        status: 400,
        message: "Invalid treatment id",
        data: null
      }
    }
    // if valid, update treatment
    const updatedTreatment = await db
      .update(treatment)
      .set(data)
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
      status: 200,
      message: "Treatment updated",
      data: updatedTreatment[0],
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "An error occured writing to the database",
      data: error,
    };
  }
}

export async function deactivateTreatment(clinicId: number, id: number): Promise<SuccessResponse | ErrorResponse> {
  try {
    // check if treatment id is valid before deactivating
    const treatmentToUpdate = await db.select().from(treatment).where(
      and(
        eq(treatment.clinicId, clinicId),
        eq(treatment.id, id),
      ),
    );
    if (treatmentToUpdate.length === 0) {
      return {
        success: false,
        status: 400,
        message: "Invalid treatment id",
        data: null
      }
    }
    // check if treatment is assigned to any upcoming appointments before deactivating
    const upcomingAppointmentsWithTreatment = await db.select().from(appointment).where(
      and(
        eq(appointment.treatmentId, id),
        eq(appointment.clinicId, clinicId),
        eq(appointment.status, "confirmed")
      )
    );
    if (upcomingAppointmentsWithTreatment.length > 0) {
      return {
        success: false,
        status: 400,
        message: "Cannot deactivate treatment with upcoming appointments",
        data: null
      }
    }
    // if valid and no upcoming appointments, deactivate treatment
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
      status: 200,
      message: "Treatment deactivated",
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "An error occured writing to the database",
      data: error,
    };
  }
}

export async function activateTreatment(clinicId: number, id: number): Promise<SuccessResponse | ErrorResponse> {
  try {
    // check if treatment id is valid before activating
    const treatmentToUpdate = await db.select().from(treatment).where(
      and(
        eq(treatment.clinicId, clinicId),
        eq(treatment.id, id),
      ),
    );
    if (treatmentToUpdate.length === 0) {
      return {
        success: false,
        status: 400,
        message: "Invalid treatment id",
        data: null
      }
    }
    // if valid, activate treatment
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
      status: 200,
      message: "Treatment activated",
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "An error occured writing to the database",
      data: error,
    };
  }
}

export async function addRoomToTreatment(clinicId: number, treatmentId: number, roomId: number): Promise<SuccessResponse | ErrorResponse> {
  try {
    // check if treatment id is valid
    const validTreatment = await db.select().from(treatment).where(
      and(
        eq(treatment.clinicId, clinicId),
        eq(treatment.id, treatmentId),
      ),
    );
    if (validTreatment.length === 0) {
      return {
        success: false,
        status: 400,
        message: "Invalid treatment id",
        data: null
      }
    }
    // check if room id is valid
    const validRoom = await db.select().from(room).where(
      and(
        eq(room.clinicId, clinicId),
        eq(room.id, roomId),
      ),
    );
    if (validRoom.length === 0) {
      return {
        success: false,
        status: 400,
        message: "Invalid room id or room is not active",
        data: null
      }
    }
    // check if room is already assigned to treatment
    const existingLink = await db.select().from(roomTreatment).where(
      and(
        eq(roomTreatment.treatmentId, treatmentId),
        eq(roomTreatment.roomId, roomId)
      )
    );
    if (existingLink.length > 0) {
      return {
        success: false,
        status: 400,
        message: "Room is already assigned to treatment",
        data: null
      }
    }
    // add room to treatment
    await db
      .insert(roomTreatment)
      .values({
        treatmentId,
        roomId,
      });
    return {
      success: true,
      status: 200,
      message: "Room added to treatment",
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "An error occured writing to the database",
      data: error,
    };
  }
}

export async function removeRoomFromTreatment(clinicId: number, treatmentId: number, roomId: number): Promise<SuccessResponse | ErrorResponse> {
  try {
    // check if treatment id is valid
    const validTreatment = await db.select().from(treatment).where(
      and(
        eq(treatment.clinicId, clinicId),
        eq(treatment.id, treatmentId),
      ),
    );
    if (validTreatment.length === 0) {
      return {
        success: false,
        status: 400,
        message: "Invalid treatment id",
        data: null
      }
    }
    // check if room id is valid
    const validRoom = await db.select().from(room).where(
      and(
        eq(room.clinicId, clinicId),
        eq(room.id, roomId),
      ),
    );
    if (validRoom.length === 0) {
      return {
        success: false,
        status: 400,
        message: "Invalid room id",
        data: null
      }
    }
    // check if room is assigned to treatment
    const existingLink = await db.select().from(roomTreatment).where(
      and(
        eq(roomTreatment.treatmentId, treatmentId),
        eq(roomTreatment.roomId, roomId)
      )
    );
    if (existingLink.length === 0) {
      return {
        success: false,
        status: 400,
        message: "Room is not assigned to treatment",
        data: null
      }
    }
    // check if room is assigned to any upcoming appointments with treatment before removing
    const upcomingAppointmentsWithRoomAndTreatment = await db.select().from(appointment).where(
      and(
        eq(appointment.treatmentId, treatmentId),
        eq(appointment.roomId, roomId),
        eq(appointment.clinicId, clinicId),
        eq(appointment.status, "confirmed")
      )
    );
    if (upcomingAppointmentsWithRoomAndTreatment.length > 0) {
      return {
        success: false,
        status: 400,
        message: "Cannot remove room from treatment with upcoming appointments assigned to room and treatment. Assign a different room to treatment for those appointments before removing.",
        data: null
      }
    }
    // remove room from treatment
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
      status: 200,
      message: "Room removed from treatment",
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "An error occured writing to the database",
      data: error,
    };
  }
}
