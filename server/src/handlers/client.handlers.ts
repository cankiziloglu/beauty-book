import db from "@/db/db";
import { client, user } from "@/db/schema";
import { ErrorResponse, SuccessResponse } from "@/lib/types";
import { Client, Clients, NewClient, UpdateClient } from "@/lib/validators";
import { and, eq } from "drizzle-orm";


export async function getClient(clinicId: number, clientId: number): Promise<SuccessResponse<Client> | ErrorResponse> {
  try {
    // check if client exists
    const ClientToGet: Clients[] = await db.select({
      id: client.id,
      phoneNumber: client.phoneNumber,
      address: client.address,
      lateCancelCount: client.lateCancelCount,
      userId: client.userId,
      clinicId: client.clinicId,
    }).from(client).where(
      and(
        eq(client.clinicId, clinicId),
        eq(client.id, clientId),
      ),
    );
    if (ClientToGet.length === 0) {
      return {
        success: false,
        status: 400,
        message: "Invalid client id",
        data: null,
      };
    }
    // get user details for client
    const userDetails = await db.select({
      userId: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    }).from(user).where(eq(user.id, ClientToGet[0].userId));
    // combine client and user details
    const clientWithUserDetails = {
      ...ClientToGet[0],
      ...userDetails[0],
    };
    return {
      success: true,
      status: 200,
      message: "Client found",
      data: clientWithUserDetails,
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

export async function getClients(clinicId: number): Promise<SuccessResponse<Clients[]> | ErrorResponse> {
  try {
    const clients: Clients[] = await db.select({
      id: client.id,
      phoneNumber: client.phoneNumber,
      address: client.address,
      lateCancelCount: client.lateCancelCount,
      userId: client.userId,
      clinicId: client.clinicId,
    }).from(client).where(eq(client.clinicId, clinicId));
    return {
      success: true,
      status: 200,
      message: "Get all clients",
      data: clients,
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

export async function getSelf(clinicId: number, userId: string): Promise<SuccessResponse<Client> | ErrorResponse> {
  try {
    // check if client exists
    const ClientToGet: Clients[] = await db.select({
      id: client.id,
      phoneNumber: client.phoneNumber,
      address: client.address,
      lateCancelCount: client.lateCancelCount,
      userId: client.userId,
      clinicId: client.clinicId,
    }).from(client).where(
      and(
        eq(client.clinicId, clinicId),
        eq(client.userId, userId),
      ),
    );
    if (ClientToGet.length === 0) {
      return {
        success: false,
        status: 400,
        message: "CLient not found for user",
        data: null,
      };
    }
    // get user details for client
    const userDetails = await db.select({
      userId: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    }).from(user).where(eq(user.id, ClientToGet[0].userId));
    // combine client and user details
    const clientWithUserDetails = {
      ...ClientToGet[0],
      ...userDetails[0],
    };
    return {
      success: true,
      status: 200,
      message: "Client found",
      data: clientWithUserDetails,
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

export async function updateSelf(clinicId: number, userId: string, data: UpdateClient): Promise<SuccessResponse<Clients> | ErrorResponse> {
  try {
    // check if client exists
    const ClientToUpdate: Clients[] = await db.select({
      id: client.id,
      phoneNumber: client.phoneNumber,
      address: client.address,
      lateCancelCount: client.lateCancelCount,
      userId: client.userId,
      clinicId: client.clinicId,
    }).from(client).where(
      and(
        eq(client.clinicId, clinicId),
        eq(client.userId, userId),
      ),
    );
    if (ClientToUpdate.length === 0) {
      return {
        success: false,
        status: 400,
        message: "Client not found for user",
        data: null,
      };
    }
    const updatedClient = await db.update(client).set(data).where(
      and(
        eq(client.clinicId, clinicId),
        eq(client.userId, userId),
      ),
    ).returning(
      {
        id: client.id,
        phoneNumber: client.phoneNumber,
        address: client.address,
        lateCancelCount: client.lateCancelCount,
        userId: client.userId,
        clinicId: client.clinicId,
      }
    );
    return {
      success: true,
      status: 200,
      message: "Client updated",
      data: updatedClient[0],
    }
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "An error occured writing to the database",
      data: error,
    };
  }
}

export async function createSelf(clinicId: number, userId: string, data: NewClient): Promise<SuccessResponse<Clients> | ErrorResponse> {
  try {
    // check if client already exists for user
    const existingClient: Clients[] = await db.select({
      id: client.id,
      phoneNumber: client.phoneNumber,
      address: client.address,
      lateCancelCount: client.lateCancelCount,
      userId: client.userId,
      clinicId: client.clinicId,
    }).from(client).where(
      and(
        eq(client.clinicId, clinicId),
        eq(client.userId, userId),
      ),
    );
    if (existingClient.length > 0) {
      return {
        success: false,
        status: 400,
        message: "Client already exists for user",
        data: null,
      };
    }
    const newClient = await db.insert(client).values(data).returning({
      id: client.id,
      phoneNumber: client.phoneNumber,
      address: client.address,
      lateCancelCount: client.lateCancelCount,
      userId: client.userId,
      clinicId: client.clinicId,
    });
    return {
      success: true,
      status: 201,
      message: "Client created",
      data: newClient[0],
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
