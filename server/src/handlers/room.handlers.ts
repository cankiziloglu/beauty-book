import db from "@/db/db";
import { room, roomTreatment, treatment } from "@/db/schema";
import { ErrorResponse, SuccessResponse } from "@/lib/types";
import { NewRoom, Room, Rooms, Treatments, UpdateRoom } from "@/lib/validators";
import { and, desc, eq } from "drizzle-orm";


export async function getRooms(clinicId: number): Promise<SuccessResponse<Rooms[]> | ErrorResponse> {
  try {
    const rooms: Rooms[] = await db.select({
      id: room.id,
      name: room.name,
      isActive: room.isActive
    }).from(room).where(eq(room.clinicId, clinicId))

    return {
      success: true,
      status: 200,
      message: "Get all rooms",
      data: rooms,
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

export async function getRoom(clinicId: number, id: number): Promise<SuccessResponse<Room> | ErrorResponse> {
 try {
   // check if room exists and belongs to clinic
   const roomToGet: Rooms[] = await db.select({
     id: room.id,
     name: room.name,
     isActive: room.isActive,
   }).from(room).where(
     and(
       eq(room.clinicId, clinicId),
       eq(room.id, id),
     ),
   );
   if (roomToGet.length === 0) {
     return {
       success: false,
       status: 400,
       message: "Invalid room id",
       data: null,
     };
   }
   // get treatments for room
   const treatmentsForRoom: Treatments[] = await db
     .select({
       id: treatment.id,
       name: treatment.name,
       description: treatment.description,
       duration: treatment.duration,
       buffer: treatment.buffer,
       priceCents: treatment.priceCents,
       isActive: treatment.isActive,
     })
     .from(treatment)
     .where(
       and(
         eq(roomTreatment.roomId, id),
         eq(roomTreatment.treatmentId, treatment.id),
       )
     )
     .leftJoin(roomTreatment, eq(roomTreatment.treatmentId, treatment.id));
   // combine room and treatments into one object
   const roomDetail: Room = {
     ...roomToGet[0],
     treatments: treatmentsForRoom,
   };
   return {
     success: true,
     status: 200,
     message: "Room details retrieved",
     data: roomDetail,
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

export async function createRoom(data: NewRoom): Promise<SuccessResponse<{ id: number }> | ErrorResponse> {
  try {
    const newRoom = await db
      .insert(room)
      .values({
        name: data.name,
        clinicId: data.clinicId,
      })
      .returning({
        id: room.id,
      });
    return {
      success: true,
      status: 201,
      message: "Room created",
      data: newRoom[0],
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

export async function updateRoom(clinicId: number, id: number, data: UpdateRoom): Promise<SuccessResponse<UpdateRoom> | ErrorResponse> {
  try {
    // check if room exists and belongs to clinic
    const roomToUpdate: Rooms[] = await db.select({
      id: room.id,
      name: room.name,
      isActive: room.isActive,
    }).from(room).where(
      and(
        eq(room.clinicId, clinicId),
        eq(room.id, id),
      ),
    );
    if (roomToUpdate.length === 0) {
      return {
        success: false,
        status: 400,
        message: "Invalid room id",
        data: null,
      };
    }
    const updatedRoom = await db
      .update(room)
      .set({ ...data })
      .where(
        and(
          eq(room.clinicId, clinicId),
          eq(room.id, id),
        ),
      )
      .returning({
        id: room.id,
        name: room.name,
        isActive: room.isActive,
      });
    return {
      success: true,
      status: 200,
      message: "Room updated",
      data: updatedRoom[0],
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

export async function deactivateRoom(clinicId: number, id: number): Promise<SuccessResponse<undefined> | ErrorResponse> {
  try {
    // check if room exists, is active, and belongs to clinic
    const roomToDeactivate: Rooms[] = await db.select({
      id: room.id,
      name: room.name,
      isActive: room.isActive,
    }).from(room).where(
      and(
        eq(room.clinicId, clinicId),
        eq(room.id, id),
        eq(room.isActive, true)
      ),
    );
    if (roomToDeactivate.length === 0) {
      return {
        success: false,
        status: 400,
        message: "Invalid room id",
        data: null,
      };
    }
    // check if room is assigned to any treatments, if so, return error message
    const treatmentsForRoom: Treatments[] = await db
      .select({
        id: treatment.id,
        name: treatment.name,
        description: treatment.description,
        duration: treatment.duration,
        buffer: treatment.buffer,
        priceCents: treatment.priceCents,
        isActive: treatment.isActive,
      })
      .from(treatment)
      .where(
        and(
          eq(roomTreatment.roomId, id),
          eq(roomTreatment.treatmentId, treatment.id),
        )
      )
      .leftJoin(roomTreatment, eq(roomTreatment.treatmentId, treatment.id));
    if (treatmentsForRoom.length > 0) {
      return {
        success: false,
        status: 400,
        message: "Cannot deactivate room assigned to treatments, remove room from treatment first.",
        data: null,
      };
    }
    // deactivate room
    await db
      .update(room)
      .set({ isActive: false })
      .where(
        and(
          eq(room.clinicId, clinicId),
          eq(room.id, id),
        ),
      );
    return {
      success: true,
      status: 200,
      message: "Room deactivated",
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

export async function activateRoom(clinicId: number, id: number): Promise<SuccessResponse<undefined> | ErrorResponse> {
  try {
    // check if room exists, is inactive, and belongs to clinic
    const roomToActivate: Rooms[] = await db.select({
      id: room.id,
      name: room.name,
      isActive: room.isActive,
    }).from(room).where(
      and(
        eq(room.clinicId, clinicId),
        eq(room.id, id),
        eq(room.isActive, false)
      ),
    );
    if (roomToActivate.length === 0) {
      return {
        success: false,
        status: 400,
        message: "Invalid room id",
        data: null,
      };
    }
    // activate room
    await db
      .update(room)
      .set({ isActive: true })
      .where(
        and(
          eq(room.clinicId, clinicId),
          eq(room.id, id),
        ),
      );
    return {
      success: true,
      status: 200,
      message: "Room activated",
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
