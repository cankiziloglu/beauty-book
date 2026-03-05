import { clinicSlugToId } from "@/lib/clinic-slug-to-id";
import { ClinicType } from "@/lib/types";
import { createMiddleware } from "hono/factory";

export const clinicMiddleware = createMiddleware<ClinicType>(async (c, next) => {
  const clinic = c.req.param("slug")!;
  const [clinicId] = await clinicSlugToId(clinic);
	if (!clinicId) {
		throw new Error("Clinic not found");
  }
  c.set("clinicId", clinicId.id);
  await next();
});
