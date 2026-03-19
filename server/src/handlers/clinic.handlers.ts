import db from "@/db/db";
import { clinic } from "@/db/schema";
import { SuccessResponse, ErrorResponse } from "@/lib/types";
import { Clinics, NewClinic, UpdateClinic } from "@/lib/validators";
import { eq } from "drizzle-orm";
import slugify from "slugify";

export async function getAllClinics(): Promise<SuccessResponse<Clinics[]> | ErrorResponse> {
  try {
    const clinics: Clinics[] = await db
      .select({
        id: clinic.id,
        name: clinic.name,
        slug: clinic.slug,
        phoneNumber: clinic.phoneNumber,
        address: clinic.address,
      })
      .from(clinic)
      .where(eq(clinic.isActive, true));
    return {
      success: true,
      status: 200,
      message: "Get all clinics",
      data: clinics,
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

export async function getClinic(id: number): Promise<SuccessResponse<Clinics> | ErrorResponse> {
  try {
    const clinicData = await db
      .select()
      .from(clinic)
      .where(eq(clinic.id, id))
      .limit(1);
    if (clinicData.length === 0) {
      return {
        success: false,
        status: 400,
        message: "Invalid clinic id",
        data: null,
      };
    }
    return {
      success: true,
      status: 200,
      message: "Get clinic",
      data: clinicData[0],
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "An error occurred while fetching the clinic",
      data: error,
    };
  }
}

export async function createClinic(data: NewClinic): Promise<SuccessResponse<Partial<Clinics>> | ErrorResponse> {
  try {
    const slug = slugify(data.name);
    const newClinic = await db
      .insert(clinic)
      .values({
        name: data.name,
        slug: slug,
        email: data.email,
        phoneNumber: data.phoneNumber,
        address: data.address,
        timezone: data.timezone,
        minAdvanceHours: data.minAdvanceHours,
        maxAdvanceDays: data.maxAdvanceDays,
        cancellationHours: data.cancellationHours,
        adminId: data.adminId,
      })
      .returning({
        id: clinic.id,
        slug: clinic.slug,
      });
    return {
      success: true,
      status: 201,
      message: "Clinic registered",
      data: newClinic[0],
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

export async function updateClinic(id: number, data: UpdateClinic): Promise<SuccessResponse<Partial<Clinics>> | ErrorResponse> {
  try {
    const clinicToUpdate = await db
      .select()
      .from(clinic)
      .where(eq(clinic.id, id))
      .limit(1);
    if (clinicToUpdate.length === 0) {
      return {
        success: false,
        status: 400,
        message: "Invalid clinic id",
        data: null,
      };
    }
    const update = await db
      .update(clinic)
      .set(data)
      .where(eq(clinic.id, id))
      .returning({ id: clinic.id });
    return {
      success: true,
      status: 200,
      message: "Clinic details updated",
      data: { ...update[0], ...data },
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

export async function deactivateClinic(id: number): Promise<SuccessResponse | ErrorResponse> {
  try {
    const clinicToDeactivate = await db
      .select()
      .from(clinic)
      .where(eq(clinic.id, id))
      .limit(1);
    if (clinicToDeactivate.length === 0) {
      return {
        success: false,
        status: 400,
        message: "Invalid clinic id",
        data: null,
      };
    }
    await db
      .update(clinic)
      .set({ isActive: false })
      .where(eq(clinic.id, id));
    return {
      success: true,
      status: 200,
      message: "Clinic deactivated",
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

export async function activateClinic(id: number): Promise<SuccessResponse | ErrorResponse> {
  try {
    const clinicToActivate = await db
      .select()
      .from(clinic)
      .where(eq(clinic.id, id))
      .limit(1);
    if (clinicToActivate.length === 0) {
      return {
        success: false,
        status: 400,
        message: "Invalid clinic id",
        data: null,
      };
    }
    await db
      .update(clinic)
      .set({ isActive: true })
      .where(eq(clinic.id, id));
    return {
      success: true,
      status: 200,
      message: "Clinic activated",
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
