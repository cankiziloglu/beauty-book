import { createClinic, getAllClinics, getClinic } from "@/handlers/clinic.handlers";
import createRoute from "@/lib/create-route";
import { createClinicSchema } from "@/lib/validators";
import { adminMiddleware } from "@/middleware/admin.middleware";
import { authMiddleware } from "@/middleware/auth.middleware";
import { clinicMiddleware } from "@/middleware/clinic.middleware";
import { zValidator } from "@hono/zod-validator";

const clinic = createRoute();

clinic
  .get("/clinics", async (c) => {
      const result = await getAllClinics();
      if (result.success) {
        return c.json(result, 200);
      } else {
        return c.json(result, 500);
      }
  })
	.get(
		"/clinic/:slug",
		clinicMiddleware,
		async (c) => {
    const clinicId = c.get("clinicId");
    const result = await getClinic(clinicId);
		if (result.success) {
			return c.json(result, 200);
		} else {
			return c.json(result, 500);
		}
  })
  .post(
    "/register",
    authMiddleware,
    adminMiddleware,
    zValidator("form", createClinicSchema),
    async (c) => {
      const validData = c.req.valid("form");
      const adminId = c.get("adminId");
      const data = { ...validData, adminId: adminId! };
      const result = await createClinic(data);
      if (result.success) {
        return c.json(result, 201);
      } else {
        return c.json(result, 500);
      }
    },
  );

export default clinic;
