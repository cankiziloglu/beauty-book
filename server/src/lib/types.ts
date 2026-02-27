import { auth } from "./auth";

export type SendEmail = {
  to: string;
  subject: string;
  url: string;
  type: "verifying" | "restoring";
  user: string;
};

export type AuthType = {
  Variables: {
    session: typeof auth.$Infer.Session.session | null;
    user: typeof auth.$Infer.Session.user | null;
  };
};
