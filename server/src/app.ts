import { Hono } from "hono";
import { auth } from "@/lib/auth";
import { logger } from "hono/logger";

const app = new Hono().basePath("/api");

app.use(logger());
app.on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw));

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
