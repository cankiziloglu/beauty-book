import { activateTreatment, addRoomToTreatment, createTreatment, deactivateTreatment, getActiveTreatment, getActiveTreatments, getTreatment, getTreatments, removeRoomFromTreatment, updateTreatment } from "@/handlers/treatment.handlers";
import createRoute from "@/lib/create-route";
import { createTreatmentSchema, updateTreatmentSchema } from "@/lib/validators";
import { adminMiddleware } from "@/middleware/admin.middleware";
import { authMiddleware } from "@/middleware/auth.middleware";
import { clinicMiddleware } from "@/middleware/clinic.middleware";
import { zValidator } from "@hono/zod-validator";
import z from "zod";

const treatment = createRoute();

treatment
  // Public Routes return active treatments only, while admin routes return all treatments.
  // Public Routes
  .get("/clinic/:slug/treatments", clinicMiddleware, async (c) => {
    const clinicId = c.get("clinicId")
    const result = await getActiveTreatments(clinicId)
    return c.json(result, result.status)
  })
  .get("/clinic/:slug/treatments/:id",
    clinicMiddleware,
    zValidator("param", z.object({ id: z.coerce.number() })),
    async (c) => {
      const clinicId = c.get("clinicId");
      const { id } = c.req.valid("param");
      const result = await getActiveTreatment(clinicId, id);
      return c.json(result, result.status)
  })
  // Admin Routes
  .get(
    "/clinic/:slug/treatment",
    clinicMiddleware,
    authMiddleware,
    adminMiddleware,
    async (c) => {
      const clinicId = c.get("clinicId")
      const result = await getTreatments(clinicId)
      return c.json(result, result.status)
  })
  .get(
    "/clinic/:slug/treatment/:id",
    clinicMiddleware,
    authMiddleware,
    adminMiddleware,
    zValidator("param", z.object({ id: z.coerce.number() })),
    async (c) => {
      const clinicId = c.get("clinicId");
      const { id } = c.req.valid("param");
      const result = await getTreatment(clinicId, id);
      return c.json(result, result.status)
    }
  )
  .post("/clinic/:slug/treatment/new",
    clinicMiddleware,
    authMiddleware,
    adminMiddleware,
    zValidator("form", createTreatmentSchema),
    async (c) => {
      const clinicId = c.get("clinicId");
      const validData = c.req.valid("form");
      const data = { ...validData, clinicId: clinicId };
      const result = await createTreatment(data);
      return c.json(result, result.status)
    },
  )
  .put(
    "/clinic/:slug/treatment/:id",
    clinicMiddleware,
    authMiddleware,
    adminMiddleware,
    zValidator("param", z.object({ id: z.coerce.number() })),
    zValidator("form", updateTreatmentSchema),
    async (c) => {
      const clinicId = c.get("clinicId");
      const { id } = c.req.valid("param");
      const validData = c.req.valid("form");
      const result = await updateTreatment(clinicId, id, validData);
      return c.json(result, result.status)
    },
  )
  .put(
    "/clinic/:slug/treatment/:id/activate",
    clinicMiddleware,
    authMiddleware,
    adminMiddleware,
    zValidator("param", z.object({ id: z.coerce.number() })),
    async (c) => {
      const clinicId = c.get("clinicId");
      const { id } = c.req.valid("param");
      const result = await activateTreatment(clinicId, id);
      return c.json(result, result.status)
    },
  )
  .put(
    "/clinic/:slug/treatment/:id/deactivate",
    clinicMiddleware,
    authMiddleware,
    adminMiddleware,
    zValidator("param", z.object({ id: z.coerce.number() })),
    async (c) => {
      const clinicId = c.get("clinicId");
      const { id } = c.req.valid("param");
      const result = await deactivateTreatment(clinicId, id);
      return c.json(result, result.status)
    },
  )
  .post(
    "clinic/:slug/treatment/:id/room/:roomId",
    clinicMiddleware,
    authMiddleware,
    adminMiddleware,
    zValidator("param", z.object({
      id: z.coerce.number(),
      roomId: z.coerce.number(),
    })),
    async (c) => {
      const clinicId = c.get("clinicId");
      const { id, roomId } = c.req.valid("param");
      const result = await addRoomToTreatment(clinicId, id, roomId);
      return c.json(result, result.status)
    }
  )
  .delete(
    "clinic/:slug/treatment/:id/room/:roomId",
    clinicMiddleware,
    authMiddleware,
    adminMiddleware,
    zValidator("param", z.object({
      id: z.coerce.number(),
      roomId: z.coerce.number(),
    })),
    async (c) => {
      const clinicId = c.get("clinicId");
      const { id, roomId } = c.req.valid("param");
      const result = await removeRoomFromTreatment(clinicId, id, roomId);
      return c.json(result, result.status)
    }
  )

export default treatment;
