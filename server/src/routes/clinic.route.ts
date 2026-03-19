import {
  activateClinic,
  createClinic,
  deactivateClinic,
  getActiveClinic,
  getAllClinics,
  getClinic,
  updateClinic,
} from "@/handlers/clinic.handlers";
import createRoute from "@/lib/create-route";
import { createClinicSchema, updateClinicSchema } from "@/lib/validators";
import { adminMiddleware } from "@/middleware/admin.middleware";
import { authMiddleware } from "@/middleware/auth.middleware";
import { clinicMiddleware } from "@/middleware/clinic.middleware";
import { zValidator } from "@hono/zod-validator";

const clinic = createRoute();

clinic
  // Public Routes return active clinic's details only, while admin routes return inactive clinic's details.
  // Public Routes
  .get("/clinic", async (c) => {
    const result = await getAllClinics();
    return c.json(result, result.status);
  })
  .get("/clinic/:slug", clinicMiddleware, async (c) => {
    const clinicId = c.get("clinicId");
    const result = await getActiveClinic(clinicId);
    return c.json(result, result.status);
  })
  // Admin Routes
  .get(
    "/clinic/:slug",
    clinicMiddleware,
    authMiddleware,
    adminMiddleware,
    async (c) => {
      const clinicId = c.get("clinicId");
      const result = await getClinic(clinicId);
      return c.json(result, result.status);
    })
  .post(
    "/clinic/register",
    authMiddleware,
    adminMiddleware,
    zValidator("form", createClinicSchema),
    async (c) => {
      const validData = c.req.valid("form");
      const adminId = c.get("adminId");
      const data = { ...validData, adminId: adminId! };
      const result = await createClinic(data);
      return c.json(result, result.status);
    },
  )
  .put(
    "/clinic/:slug",
    clinicMiddleware,
    authMiddleware,
    adminMiddleware,
    zValidator("form", updateClinicSchema),
    async (c) => {
      const validData = c.req.valid("form");
      const clinicId = c.get("clinicId");
      const result = await updateClinic(clinicId, validData);
      return c.json(result, result.status);
    },
  )
  .put(
    "/clinic/:slug/activate",
    clinicMiddleware,
    authMiddleware,
    adminMiddleware,
    async (c) => {
      const clinicId = c.get("clinicId");
      const result = await activateClinic(clinicId)
      return c.json(result, result.status);
    },
  )
  .put(
    "/clinic/:slug/deactivate",
    clinicMiddleware,
    authMiddleware,
    adminMiddleware,
    async (c) => {
      const clinicId = c.get("clinicId");
      const result = await deactivateClinic(clinicId)
      return c.json(result, result.status);
    },
  );

export default clinic;
