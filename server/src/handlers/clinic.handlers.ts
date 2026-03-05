import db from "@/db/db";
import { clinic } from "@/db/schema";
import { Clinics, NewClinic } from "@/lib/validators";
import { eq } from "drizzle-orm";
import slugify from "slugify";

export async function getAllClinics() {
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
      message: "Get all clinics",
      data: clinics,
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occured reading data",
      data: error,
    };
  }
};

export async function getClinic(id: number) {
	try {
		const clinicData = await db
			.select()
			.from(clinic)
			.where(eq(clinic.id, id))
			.limit(1);
		if (clinicData.length === 0) {
			return {
				success: false,
				message: "Clinic not found",
				data: null,
			};
		}
		return {
			success: true,
			message: "Get clinic",
			data: clinicData[0],
		};

	} catch (error) {
		return {
			success: false,
			message: "An error occurred while fetching the clinic",
			data: error,
		};
	}
}

export async function createClinic(data: NewClinic) {
  try {
    const newClinic = await db
      .insert(clinic)
      .values({
        name: data.name,
        slug: slugify(data.name),
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
      message: "Clinic registered",
      data: newClinic,
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occured writing to the database",
      data: error,
    };
  }
}
