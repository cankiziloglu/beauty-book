import { Hono } from "hono";
import { logger } from "hono/logger";
import clinic from "./routes/clinic.route";
import appointment from "./routes/appointment.route";
import practitioner from "./routes/practitioner.route";
import treatment from "./routes/treatment.route";
import room from "./routes/room.route";
import authRoute from "./routes/auth.route";
import corsMiddleware from "./middleware/cors.middleware";
import { HTTPException } from "hono/http-exception";
import { ErrorResponse } from "./lib/types";

const app = new Hono({ strict: false }).basePath("/api");

app.use(logger());
app.use(corsMiddleware());

app.notFound((c) => {
  return c.json(
    {
      message: "404 Not Found",
      path: `${c.req.path}`,
    },
    404,
  );
});
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json<ErrorResponse>(
      {
        success: false,
        status: err.status,
        message: err.message,
        data: process.env.NODE_ENV === "development" ? err.stack : "Error",
      },
      err.status,
    );
  } else {
    return c.json<ErrorResponse>(
      {
        success: false,
        status: 500,
        message: "Internal Server Error",
        data: "Error",
      },
      500,
    );
  }
});

const routes = [
  authRoute,
  clinic,
  appointment,
  practitioner,
  treatment,
  room,
] as const;

routes.forEach((route) => {
  app.route("/", route);
});

export type AppType = (typeof routes)[number];
export default app;
