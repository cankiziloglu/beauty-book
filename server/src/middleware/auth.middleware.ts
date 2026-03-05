import { auth } from "@/lib/auth";
import { AuthType } from "@/lib/types";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

export const authMiddleware = createMiddleware<AuthType>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    throw new HTTPException(401, { message: "Unauthorized" });
  } else {
    c.set("user", session.user);
    c.set("session", session.session);
  }
  await next();
});
