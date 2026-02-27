import { cors } from "hono/cors";

export default function corsMiddleware() {
  return cors({
    origin: "http://localhost:3000", // replace with your origin
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  });
}
