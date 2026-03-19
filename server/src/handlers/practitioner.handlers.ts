import db from "@/db/db";
import { appointment, practitioner, practitionerTreatment, treatment } from "@/db/schema";
import { SuccessResponse, ErrorResponse } from "@/lib/types";
import { NewPractitioner, Practitioner, Practitioners, UpdatePractitioner } from "@/lib/validators";
import { and, desc, eq } from "drizzle-orm";

export async function getPractitioners(clinicId: number): Promise<SuccessResponse<Practitioners[]> | ErrorResponse> {
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
      status: 200,
      message: "Get all practitioners",
      data: practitioners,
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

export async function getActivePractitioners(clinicId: number): Promise<SuccessResponse<Practitioners[]> | ErrorResponse> {
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
        and(
          eq(practitioner.clinicId, clinicId),
          eq(practitioner.isActive, true)
        ),
      );
    return {
      success: true,
      status: 200,
      message: "Get all practitioners",
      data: practitioners,
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

export async function createPractitioner(data: NewPractitioner): Promise<SuccessResponse<{ id: number }> | ErrorResponse> {
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
      status: 201,
      message: "Practitioner created",
      data: newPractitioner[0],
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

export async function getPractitioner(clinicId: number, id: number): Promise<SuccessResponse<Practitioner> | ErrorResponse> {
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
    if (practitionerDetail.length === 0) {
      return {
        success: false,
        status: 400,
        message: "Invalid practitioner id",
        data: practitionerDetail,
      };
    }
    return {
      success: true,
      status: 200,
      message: "Practitioner details retrieved",
      data: practitionerDetail[0],
    }
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "An error occured reading data",
      data: error,
    };
  }
}

export async function getActivePractitioner(clinicId: number, id: number): Promise<SuccessResponse<Practitioner> | ErrorResponse> {
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
          eq(practitioner.isActive, true)
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
    if (practitionerDetail.length === 0) {
      return {
        success: false,
        status: 400,
        message: "Invalid practitioner id",
        data: practitionerDetail,
      };
    }
    return {
      success: true,
      status: 200,
      message: "Practitioner details retrieved",
      data: practitionerDetail[0],
    }
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "An error occured reading data",
      data: error,
    };
  }
}

export async function updatePractitioner(clinicId: number, id: number, data: UpdatePractitioner): Promise<SuccessResponse<Practitioners> | ErrorResponse> {
  try {
    // check if practitioner id is valid before updating
    const practitionerToUpdate = await db
      .select()
      .from(practitioner)
      .where(
        and(
          eq(practitioner.clinicId, clinicId),
          eq(practitioner.id, id),
        ),
      );
    if (practitionerToUpdate.length === 0) {
      return {
        success: false,
        status: 400,
        message: "Invalid practitioner id",
        data: practitionerToUpdate,
      };
    }
    // update practitioner with new data
    const updatedPractitioner = await db
      .update(practitioner)
      .set({ ...data })
      .where(
        and(
          eq(practitioner.clinicId, clinicId),
          eq(practitioner.id, id),
        ),
      )
      .returning({
        id: practitioner.id,
        name: practitioner.name,
        bio: practitioner.bio,
        isActive: practitioner.isActive,
      });
    return {
      success: true,
      status: 200,
      message: "Practitioner updated",
      data: updatedPractitioner[0],
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

export async function deactivatePractitioner(clinicId: number, id: number): Promise<SuccessResponse | ErrorResponse> {
  try {
    // check if practitioner id is valid before deactivating
    const practitionerToDeactivate = await db
      .select()
      .from(practitioner)
      .where(
        and(
          eq(practitioner.clinicId, clinicId),
          eq(practitioner.id, id),
        ),
      );
    if (practitionerToDeactivate.length === 0) {
      return {
        success: false,
        status: 400,
        message: "Invalid practitioner id",
        data: practitionerToDeactivate,
      };
    }
    // check if practitioner has any upcoming appointments before deactivating
    const upcomingAppointments = await db
      .select()
      .from(appointment)
      .where(
        and(
          eq(appointment.clinicId, clinicId),
          eq(appointment.practitionerId, id),
          eq(appointment.status, "confirmed"),
        ),
      );
    if (upcomingAppointments.length > 0) {
      return {
        success: false,
        status: 400,
        message: "Practitioner has upcoming appointments and cannot be deactivated. Try changing the appointments first.",
        data: upcomingAppointments,
      };
    }
    // deactivate practitioner
    await db
      .update(practitioner)
      .set({ isActive: false })
      .where(
        and(
          eq(practitioner.clinicId, clinicId),
          eq(practitioner.id, id),
        ),
      );
    return {
      success: true,
      status: 200,
      message: "Practitioner deactivated",
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

export async function activatePractitioner(clinicId: number, id: number): Promise<SuccessResponse | ErrorResponse> {
  try {
    // check if practitioner id is valid before activating
    const practitionerToActivate = await db
      .select()
      .from(practitioner)
      .where(
        and(
          eq(practitioner.clinicId, clinicId),
          eq(practitioner.id, id),
        ),
      );
    if (practitionerToActivate.length === 0) {
      return {
        success: false,
        status: 400,
        message: "Invalid practitioner id",
        data: practitionerToActivate,
      };
    }
    // activate practitioner
    await db
      .update(practitioner)
      .set({ isActive: true })
      .where(
        and(
          eq(practitioner.clinicId, clinicId),
          eq(practitioner.id, id),
        ),
      );
    return {
      success: true,
      status: 200,
      message: "Practitioner activated",
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

export async function addTreatmentToPractitioner(clinicId: number, practitionerId: number, treatmentId: number): Promise<SuccessResponse | ErrorResponse> {
  try {
    // check if practitioner id is valid before adding treatment
    const validPractitioner = await db
      .select()
      .from(practitioner)
      .where(
        and(
          eq(practitioner.id, practitionerId),
          eq(practitioner.clinicId, clinicId)
        )
      );
    if (validPractitioner.length === 0) {
      return {
        success: false,
        status: 400,
        message: "Invalid practitioner id",
        data: validPractitioner,
      };
    }
    // check if treatment id is valid and active before adding treatment
    const validTreatment = await db
      .select()
      .from(treatment)
      .where(
        and(
          eq(treatment.id, treatmentId),
          eq(treatment.clinicId, clinicId),
          eq(treatment.isActive, true)
        )
      );
    if (validTreatment.length === 0) {
      return {
        success: false,
        status: 400,
        message: "Invalid treatment id or treatment is not active",
        data: validTreatment,
      };
    }
    // check if treatment is already linked to practitioner before adding treatment
    const existingLink = await db
      .select()
      .from(practitionerTreatment)
      .where(
        and(
          eq(practitionerTreatment.practitionerId, practitionerId),
          eq(practitionerTreatment.treatmentId, treatmentId),
        )
      );
    if (existingLink.length > 0) {
      return {
        success: false,
        status: 400,
        message: "Treatment is already linked to practitioner",
        data: existingLink,
      };
    }
    // add treatment to practitioner
    await db
      .insert(practitionerTreatment)
      .values({
        practitionerId,
        treatmentId,
      });
    return {
      success: true,
      status: 200,
      message: "Treatment added to practitioner",
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

export async function removeTreatmentFromPractitioner(clinicId: number, practitionerId: number, treatmentId: number): Promise<SuccessResponse | ErrorResponse> {
  try {
    // check if practitioner id is valid before adding treatment
    const validPractitioner = await db
      .select()
      .from(practitioner)
      .where(
        and(
          eq(practitioner.id, practitionerId),
          eq(practitioner.clinicId, clinicId)
        )
      );
    if (validPractitioner.length === 0) {
      return {
        success: false,
        status: 400,
        message: "Invalid practitioner id",
        data: validPractitioner,
      };
    }
    // check if treatment id is valid before removing treatment
    const validTreatment = await db
      .select()
      .from(treatment)
      .where(
        and(
          eq(treatment.id, treatmentId),
          eq(treatment.clinicId, clinicId)
        )
      );
    if (validTreatment.length === 0) {
      return {
        success: false,
        status: 400,
        message: "Invalid treatment id",
        data: validTreatment,
      };
    }
    // check if treatment is linked to practitioner before removing treatment
    const existingLink = await db
      .select()
      .from(practitionerTreatment)
      .where(
        and(
          eq(practitionerTreatment.practitionerId, practitionerId),
          eq(practitionerTreatment.treatmentId, treatmentId),
        )
      );
    if (existingLink.length === 0) {
      return {
        success: false,
        status: 400,
        message: "Treatment is not linked to practitioner",
        data: existingLink,
      };
    }
    // remove treatment from practitioner
    await db
      .delete(practitionerTreatment)
      .where(
        and(
          eq(practitionerTreatment.practitionerId, practitionerId),
          eq(practitionerTreatment.treatmentId, treatmentId),
        ),
      );
    return {
      success: true,
      status: 200,
      message: "Treatment removed from practitioner",
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
