import { AuthType } from "@/lib/types";
import { Hono } from "hono";

export default function createRoute() {
  return new Hono<{ Bindings: AuthType }>({ strict: false });
}
