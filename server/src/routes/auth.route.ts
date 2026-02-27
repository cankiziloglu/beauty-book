import { auth } from "@/lib/auth";
import createRoute from "@/lib/create-route";

const authRoute = createRoute();

authRoute.on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw));

export default authRoute;
