import db from "@/db/db";
import { clinic } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function clinicSlugToId(clinicSlug: string) {
  return await db
    .selectDistinct({ id: clinic.id })
    .from(clinic)
    .where(eq(clinic.slug, clinicSlug));
}
