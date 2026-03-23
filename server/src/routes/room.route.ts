
import { activateRoom, createRoom, deactivateRoom, getRoom, getRooms, updateRoom } from "@/handlers/room.handlers";
import createRoute from "@/lib/create-route";
import { createRoomSchema, createTreatmentSchema, updateRoomSchema } from "@/lib/validators";
import { adminMiddleware } from "@/middleware/admin.middleware";
import { authMiddleware } from "@/middleware/auth.middleware";
import { clinicMiddleware } from "@/middleware/clinic.middleware";
import { zValidator } from "@hono/zod-validator";
import z from "zod";

const room = createRoute();

room
  // Admin Routes
  .get(
    "/clinic/:slug/room",
    clinicMiddleware,
    authMiddleware,
    adminMiddleware,
    async (c) => {
      const clinicId = c.get("clinicId")
      const result = await getRooms(clinicId)

      return c.json(result, result.status)
  })
  .get("/clinic/:slug/room/:id",
    clinicMiddleware,
    authMiddleware,
    adminMiddleware,
    zValidator("param", z.object({ id: z.coerce.number() })),
    async (c) => {
      const clinicId = c.get("clinicId");
      const { id } = c.req.valid("param");
      const result = await getRoom(clinicId, id);

      return c.json(result, result.status)
    })
  .post("/clinic/:slug/room/new",
    clinicMiddleware,
    authMiddleware,
    adminMiddleware,
    zValidator("form", createRoomSchema),
    async (c) => {
      const clinicId = c.get("clinicId");
      const validData = c.req.valid("form");
      const data = { ...validData, clinicId: clinicId };
      const result = await createRoom(data);

      return c.json(result, result.status)
      },
  )
  .put("/clinic/:slug/room/:id",
    clinicMiddleware,
    authMiddleware,
    adminMiddleware,
    zValidator("param", z.object({ id: z.coerce.number() })),
    zValidator("form", updateRoomSchema),
    async (c) => {
      const clinicId = c.get("clinicId");
      const { id } = c.req.valid("param");
      const validData = c.req.valid("form");
      const result = await updateRoom(clinicId, id, validData);

      return c.json(result, result.status)
      },
  )
  .put("/clinic/:slug/room/:id/activate",
    clinicMiddleware,
    authMiddleware,
    adminMiddleware,
    zValidator("param", z.object({ id: z.coerce.number() })),
    async (c) => {
      const clinicId = c.get("clinicId");
      const { id } = c.req.valid("param");
      const result = await activateRoom(clinicId, id);

      return c.json(result, result.status)
      },
  )
  .put("/clinic/:slug/room/:id/deactivate",
    clinicMiddleware,
    authMiddleware,
    adminMiddleware,
    zValidator("param", z.object({ id: z.coerce.number() })),
    async (c) => {
      const clinicId = c.get("clinicId");
      const { id } = c.req.valid("param");
      const result = await deactivateRoom(clinicId, id);

      return c.json(result, result.status)
      },
  )

export default room;
