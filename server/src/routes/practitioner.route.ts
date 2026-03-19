import {
  activatePractitioner,
  addTreatmentToPractitioner,
  createPractitioner,
  deactivatePractitioner,
  getActivePractitioner,
  getActivePractitioners,
  getPractitioner,
  getPractitioners,
  removeTreatmentFromPractitioner,
  updatePractitioner,
} from "@/handlers/practitioner.handlers";
import { auth } from "@/lib/auth";
import createRoute from "@/lib/create-route";
import { createPractitionerSchema, updatePractitionerSchema } from "@/lib/validators";
import { adminMiddleware } from "@/middleware/admin.middleware";
import { authMiddleware } from "@/middleware/auth.middleware";
import { clinicMiddleware } from "@/middleware/clinic.middleware";
import { zValidator } from "@hono/zod-validator";
import z from "zod";

const practitioner = createRoute();

practitioner
  // Public Routes return active practitioners only, while admin routes return all practitioners.
  // Public Routes
  .get("/clinic/:slug/practitioners", clinicMiddleware, async (c) => {
    const clinicId = c.get("clinicId");
    const result = await getActivePractitioners(clinicId);

    return c.json(result, result.status)
  })
  .get(
    "/clinic/:slug/practitioners/:id",
    clinicMiddleware,
    zValidator("param", z.object({ id: z.coerce.number() })),
    async (c) => {
      const clinicId = c.get("clinicId");
      const { id } = c.req.valid("param");
      const result = await getActivePractitioner(clinicId, id);

      return c.json(result, result.status)
    },
  )
  // Admin Routes
  .get(
    "/clinic/:slug/practitioner",
    clinicMiddleware,
    authMiddleware,
    adminMiddleware,
    async (c) => {
    const clinicId = c.get("clinicId");
    const result = await getPractitioners(clinicId);

    return c.json(result, result.status)
  })
  .get(
    "/clinic/:slug/practitioner/:id",
    clinicMiddleware,
    authMiddleware,
    adminMiddleware,
    zValidator("param", z.object({ id: z.coerce.number() })),
    async (c) => {
      const clinicId = c.get("clinicId");
      const { id } = c.req.valid("param");
      const result = await getPractitioner(clinicId, id);

      return c.json(result, result.status)
    },
  )
  .post(
    "/clinic/:slug/practitioner/new",
    clinicMiddleware,
    authMiddleware,
    adminMiddleware,
    zValidator("form", createPractitionerSchema),
    async (c) => {
      const clinicId = c.get("clinicId");
      const validData = c.req.valid("form");
      const data = { ...validData, clinicId: clinicId };
      const result = await createPractitioner(data);

      return c.json(result, result.status)
    },
  )
  .put(
    "/clinic/:slug/practitioner/:id",
    clinicMiddleware,
    authMiddleware,
    adminMiddleware,
    zValidator("param", z.object({ id: z.coerce.number() })),
    zValidator("form", updatePractitionerSchema),
    async (c) => {
      const clinicId = c.get("clinicId");
      const { id } = c.req.valid("param");
      const validData = c.req.valid("form");
      const result = await updatePractitioner(clinicId, id, validData);

      return c.json(result, result.status)
    },
  )
  .put(
    "/clinic/:slug/practitioner/:id/activate",
    clinicMiddleware,
    authMiddleware,
    adminMiddleware,
    zValidator("param", z.object({ id: z.coerce.number() })),
    async (c) => {
      const clinicId = c.get("clinicId");
      const { id } = c.req.valid("param");
      const result = await activatePractitioner(clinicId, id);

      return c.json(result, result.status)
    },
  )
  .put(
    "/clinic/:slug/practitioner/:id/deactivate",
    clinicMiddleware,
    authMiddleware,
    adminMiddleware,
    zValidator("param", z.object({ id: z.coerce.number() })),
    async (c) => {
      const clinicId = c.get("clinicId");
      const { id } = c.req.valid("param");
      const result = await deactivatePractitioner(clinicId, id);

      return c.json(result, result.status)
    }
  )
  .post(
    "/clinic/:slug/practitioner/:id/treatment/:treatmentId",
    clinicMiddleware,
    authMiddleware,
    adminMiddleware,
    zValidator("param", z.object({
      id: z.coerce.number(),
      treatmentId: z.coerce.number(),
    })),
    async (c) => {
      const clinicId = c.get("clinicId");
      const { id, treatmentId } = c.req.valid("param");
      const result = await addTreatmentToPractitioner(clinicId, id, treatmentId);

      return c.json(result, result.status)
    }
  )
  .delete(
    "/clinic/:slug/practitioner/:id/treatment/:treatmentId",
    clinicMiddleware,
    authMiddleware,
    adminMiddleware,
    zValidator("param", z.object({
      id: z.coerce.number(),
      treatmentId: z.coerce.number(),
    })),
    async (c) => {
      const clinicId = c.get("clinicId");
      const { id, treatmentId } = c.req.valid("param");
      const result = await removeTreatmentFromPractitioner(clinicId, id, treatmentId);

      return c.json(result, result.status)
    }
  );

export default practitioner;
