import db from "@/db/db";
import { room, roomTreatment, treatment } from "@/db/schema";
import { NewRoom, Room, Rooms } from "@/lib/validators";
import { and, desc, eq } from "drizzle-orm";


export async function getRooms(clinicId: number) {
  try {
    const rooms: Rooms[] = await db.select({
      id: room.id,
      name: room.name,
      isActive: room.isActive
    }).from(room).where(eq(room.clinicId, clinicId))

    return {
      success: true,
      message: "Get all rooms",
      data: rooms,
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occured reading data",
      data: error,
    };
  }
}

export async function getRoom(clinicId: number, id: number) {
 try {
   const roomDetail: Room[] = await db
    .select({
       id: room.id,
       name: room.name,
       isActive: room.isActive,
       treatmentId: roomTreatment.treatmentId,
       treatmentName: treatment.name
    })
     .from(room)
     .where(
      and(
         eq(room.clinicId, clinicId),
         eq(room.id, id),
       ),
    )
     .leftJoin(
       roomTreatment,
       eq(roomTreatment.roomId, room.id)
    )
    .leftJoin(
      treatment,
      eq(treatment.id, roomTreatment.treatmentId)
    )
    .orderBy(desc(roomTreatment.createdAt));
   return {
     success: true,
     message: "Room details retrieved",
     data: roomDetail[0],
   };
 } catch (error) {
   return {
     success: false,
     message: "An error occured reading data",
     data: error,
   };
 }
}


export async function createRoom(data: NewRoom) {
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
      message: "Room created",
      data: newRoom[0],
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occured writing to the database",
      data: error,
    };
  }
}
