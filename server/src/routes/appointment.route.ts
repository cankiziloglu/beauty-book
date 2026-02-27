import createRoute from "@/lib/create-route";

const appointment = createRoute();

appointment
  .get("/clinic/:clinicId/appointment", (c) => {
    return c.text(`appointments for ${c.req.param("clinicId")}`);
  })
  .get("/clinic/:clinicId/appointment/:appointmentId", (c) => {
    return c.text(
      `get appointment ${c.req.param("appointmentId")} for ${c.req.param("clinicId")}`,
    );
  })
  .post("/clinic/:clinicId/appointment/", (c) => {
    return c.text(`create appointment for ${c.req.param("clinicId")}`);
  });

export default appointment;
