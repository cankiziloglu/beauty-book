import { createSelf, getClient, getClients, getSelf, updateSelf } from "@/handlers/client.handlers";
import createRoute from "@/lib/create-route";
import { ErrorResponse } from "@/lib/types";
import { createClientSchema, updateClientSchema } from "@/lib/validators";
import { adminMiddleware } from "@/middleware/admin.middleware";
import { authMiddleware } from "@/middleware/auth.middleware";
import { clinicMiddleware } from "@/middleware/clinic.middleware";
import { zValidator } from "@hono/zod-validator";
import z from "zod";


const client = createRoute();

client
  // Routes only authorized client can access
  // View and update self information
  .get("/clinic/:slug/me",
    clinicMiddleware,
    authMiddleware,
    async (c) => {
      const clinicId = c.get("clinicId");
      const user = c.get("user");
      if (!user) {
        return c.json<ErrorResponse>({ success: false, status: 401, message: "Unauthorized", data: null }, 401);
      }
      const result = await getSelf(clinicId, user.id);

      return c.json(result, result.status)
    },
  )
  .put("/clinic/:slug/me",
    clinicMiddleware,
    authMiddleware,
    zValidator("form", updateClientSchema),
    async (c) => {
      const clinicId = c.get("clinicId");
      const user = c.get("user");
      if (!user) {
        return c.json<ErrorResponse>({ success: false, status: 401, message: "Unauthorized", data: null }, 401);
      }
      const validData = c.req.valid("form");
      const result = await updateSelf(clinicId, user.id, validData);

      return c.json(result, result.status)
    },
  )
  // Create client. Only clients can create an account for themselves.
  .post("clinic/:slug/me/new",
    clinicMiddleware,
    authMiddleware,
    zValidator("form", createClientSchema),
      async (c) => {
      const clinicId = c.get("clinicId");
      const user = c.get("user");
      if (!user) {
        return c.json<ErrorResponse>({ success: false, status: 401, message: "Unauthorized", data: null }, 401);
      }
      const validData = c.req.valid("form");
      const data = { ...validData, clinicId: clinicId, userId: user.id };
      const result = await createSelf(clinicId, user.id, data);

      return c.json(result, result.status)
    },
  )
// Routes admins can access
// Admins can view client information. They cannot update or create client information.
  .get("/clinic/:slug/client/:id",
    clinicMiddleware,
    authMiddleware,
    adminMiddleware,
    zValidator("param", z.object({ id: z.coerce.number() })),
    async (c) => {
      const clinicId = c.get("clinicId");
      const { id } = c.req.valid("param");
      const result = await getClient(clinicId, id);

      return c.json(result, result.status)
    },
  )
  .get("/clinic/:slug/client",
    clinicMiddleware,
    authMiddleware,
    adminMiddleware,
    async (c) => {
      const clinicId = c.get("clinicId");
      const result = await getClients(clinicId);

      return c.json(result, result.status)
    },
  )

export default client;
