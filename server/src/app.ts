import { Hono } from "hono";
import { logger } from "hono/logger";
import onError from "./middleware/error";
import clinic from "./routes/clinic.route";
import appointment from "./routes/appointment.route";
import practitioner from "./routes/practitioner.route";
import treatment from "./routes/treatment.route";
import room from "./routes/room.route";

const app = new Hono({ strict: false }).basePath("/api");

app.use(logger());

app.notFound((c) => {
  return c.json({
    message: "404 Not Found",
    path: `${c.req.path}`,
  });
});
app.onError(onError);

const routes = [clinic, appointment, practitioner, treatment, room] as const;

routes.forEach((route) => {
  app.route("/", route);
});

export type AppType = (typeof routes)[number];
export default app;
