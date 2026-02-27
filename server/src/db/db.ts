import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "src/db/schema";

const db = drizzle({
  connection: process.env.DATABASE_URL,
  schema,
  logger: true,
});
export default db;
