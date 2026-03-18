
import { createRoom, getRoom, getRooms } from "@/handlers/room.handlers";
import createRoute from "@/lib/create-route";
import { createRoomSchema, createTreatmentSchema } from "@/lib/validators";
import { adminMiddleware } from "@/middleware/admin.middleware";
import { authMiddleware } from "@/middleware/auth.middleware";
import { clinicMiddleware } from "@/middleware/clinic.middleware";
import { zValidator } from "@hono/zod-validator";
import z from "zod";

const room = createRoute();

room
  .get("/clinic/:slug/room", clinicMiddleware, async (c) => {
    const clinicId = c.get("clinicId")
    const result = await getRooms(clinicId)

    if (result.success) {
      return c.json(result, 200);
    } else {
      return c.json(result, 500);
    }
  })
  .get("/clinic/:slug/room/:id",
    clinicMiddleware,
    zValidator("param", z.object({ id: z.coerce.number() })),
    async (c) => {
      const clinicId = c.get("clinicId");
      const { id } = c.req.valid("param");
      const result = await getRoom(clinicId, id);

      if (result.success) {
        return c.json(result, 200);
      } else {
        return c.json(result, 500);
      }
    },
  )
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

      if (result.success) {
        return c.json(result, 200);
      } else {
        return c.json(result, 500);
      }
    },
  );

export default room;
