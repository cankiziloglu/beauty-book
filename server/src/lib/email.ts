import { SendEmail } from "./types";
import { BrevoClient } from "@getbrevo/brevo";

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY!,
});

export async function sendEmail({ to, subject, url, type, user }: SendEmail) {
  const result = await brevo.transactionalEmails.sendTransacEmail({
    subject: subject,
    textContent: `Click the link for ${type} your email: ${url} `,
    sender: { name: "BeautyBook", email: "membercgk@gmail.com" },
    to: [{ email: to, name: user }],
  });
  console.log("Email sent:", result);
  return result;
}
