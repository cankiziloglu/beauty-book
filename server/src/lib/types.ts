export type SendEmail = {
  to: string;
  subject: string;
  url: string;
  type: "verifying" | "restoring";
  user: string;
};
