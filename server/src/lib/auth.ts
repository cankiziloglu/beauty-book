import { betterAuth } from "better-auth";
import db from "../db";

export const auth = betterAuth({
  database: db,
  user: {
    additionalFields: {
      role: {
        type: ["user", "admin"],
        required: true,
        defaultValue: "user",
      },
    },
  },
  experimental: { joins: true },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  },
});
