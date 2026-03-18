import {
  createPractitioner,
  getPractitioner,
  getPractitioners,
} from "@/handlers/practitioner.handlers";
import createRoute from "@/lib/create-route";
import { createPractitionerSchema } from "@/lib/validators";
import { adminMiddleware } from "@/middleware/admin.middleware";
import { authMiddleware } from "@/middleware/auth.middleware";
import { clinicMiddleware } from "@/middleware/clinic.middleware";
import { zValidator } from "@hono/zod-validator";
import z from "zod";

const practitioner = createRoute();

practitioner
  .get("/clinic/:slug/practitioner", clinicMiddleware, async (c) => {
    const clinicId = c.get("clinicId");
    const result = await getPractitioners(clinicId);

    if (result.success) {
      return c.json(result, 200);
    } else {
      return c.json(result, 500);
    }
  })
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

      if (result.success) {
        return c.json(result, 200);
      } else {
        return c.json(result, 500);
      }
    },
  )
  .get(
    "/clinic/:slug/practitioner/:id",
    clinicMiddleware,
    zValidator("param", z.object({ id: z.coerce.number() })),
    async (c) => {
      const clinicId = c.get("clinicId");
      const { id } = c.req.valid("param");
      const result = await getPractitioner(clinicId, id);

      if (result.success) {
        return c.json(result, 200);
      } else {
        return c.json(result, 500);
      }
    },
  );
export default practitioner;
