import createRoute from "@/lib/create-route";

const treatment = createRoute();

treatment
  .get("/clinic/:clinicId/treatment", (c) => {
    return c.text(`treatments for ${c.req.param("clinicId")}`);
  })
  .get("/clinic/:clinicId/treatment/:treatmentId", (c) => {
    return c.text(
      `get treatment ${c.req.param("treatmentId")} for ${c.req.param("clinicId")}`,
    );
  })
  .post("/clinic/:clinicId/treatment/", (c) => {
    return c.text(`create treatment for ${c.req.param("clinicId")}`);
  });

export default treatment;
