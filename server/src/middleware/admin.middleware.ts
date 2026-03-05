import { AuthType } from "@/lib/types";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

export const adminMiddleware = createMiddleware<AuthType>(async (c, next) => {
  const user = c.get("user");
  if (!user) {
    throw new HTTPException(401, { message: "Unauthorized" });
  } else if (user.role !== "admin") {
    throw new HTTPException(403, { message: "Forbidden" });
  } else {
    c.set("adminId", user.id);
  }
  await next();
});
