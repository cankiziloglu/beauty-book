import createRoute from "@/lib/create-route";

const clinic = createRoute();

clinic
  .get("/clinic/:clinicId", (c) => {
    return c.text(`get clinic ${c.req.param("clinicId")}`);
  })
  .post("/clinic", (c) => {
    return c.text(`create clinic`);
  });

export default clinic;
