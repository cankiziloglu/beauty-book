import { ContentfulStatusCode } from "hono/utils/http-status";
import { auth } from "./auth";

export type SuccessResponse<T = void> = {
  success: true;
  status: ContentfulStatusCode;
  message: string;
} & (T extends void ? {} : { data: T });

export type ErrorResponse = {
  success: false;
  status: ContentfulStatusCode;
  message: string;
  data: string | unknown | undefined;
};

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
    adminId: typeof auth.$Infer.Session.user.id | null;
  };
};

export type ClinicType = {
  Variables: {
    clinicId: number;
  };
};
