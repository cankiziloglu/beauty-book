import createRoute from "@/lib/create-route";

const practitioner = createRoute();

practitioner
  .get("/clinic/:clinicId/practitioner", (c) => {
    return c.text(`practitioners for ${c.req.param("clinicId")}`);
  })
  .get("/clinic/:clinicId/practitioner/:practitionerId", (c) => {
    return c.text(
      `get practitioner ${c.req.param("practitionerId")} for ${c.req.param("clinicId")}`,
    );
  })
  .post("/clinic/:clinicId/practitioner/", (c) => {
    return c.text(`create practitioner for ${c.req.param("clinicId")}`);
  });

export default practitioner;
