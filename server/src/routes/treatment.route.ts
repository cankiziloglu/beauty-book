import { createTreatment, getTreatment, getTreatments } from "@/handlers/treatment.handlers";
import createRoute from "@/lib/create-route";
import { createTreatmentSchema } from "@/lib/validators";
import { adminMiddleware } from "@/middleware/admin.middleware";
import { authMiddleware } from "@/middleware/auth.middleware";
import { clinicMiddleware } from "@/middleware/clinic.middleware";
import { zValidator } from "@hono/zod-validator";
import z from "zod";

const treatment = createRoute();

treatment
  .get("/clinic/:slug/treatment", clinicMiddleware, async (c) => {
    const clinicId = c.get("clinicId")
    const result = await getTreatments(clinicId)

    if (result.success) {
      return c.json(result, 200);
    } else {
      return c.json(result, 500);
    }
  })
  .get("/clinic/:slug/treatment/:id",
    clinicMiddleware,
    zValidator("param", z.object({ id: z.coerce.number() })),
    async (c) => {
      const clinicId = c.get("clinicId");
      const { id } = c.req.valid("param");
      const result = await getTreatment(clinicId, id);

      if (result.success) {
        return c.json(result, 200);
      } else {
        return c.json(result, 500);
      }
    },
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

      if (result.success) {
        return c.json(result, 200);
      } else {
        return c.json(result, 500);
      }
    },
  );

export default treatment;
