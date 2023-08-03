import { AuthPortal } from "@authportal/firebase";

export const authPortal = new AuthPortal({
  client_id: process.env.NEXT_PUBLIC_AUTH_PORTAL_CLIENT_ID as string,
  domain: "auth.authportal.dev",
  redirect_path: "/signin-authportal",
});
