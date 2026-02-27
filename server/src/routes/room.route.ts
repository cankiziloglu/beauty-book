import createRoute from "@/lib/create-route";

const room = createRoute();

room
  .get("/clinic/:clinicId/room", (c) => {
    return c.text(`rooms for ${c.req.param("clinicId")}`);
  })
  .get("/clinic/:clinicId/room/:roomId", (c) => {
    return c.text(
      `get room ${c.req.param("roomId")} for ${c.req.param("clinicId")}`,
    );
  })
  .post("/clinic/:clinicId/room/", (c) => {
    return c.text(`create room for ${c.req.param("clinicId")}`);
  });

export default room;
