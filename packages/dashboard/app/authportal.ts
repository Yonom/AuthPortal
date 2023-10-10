import { AuthPortal } from "@authportal/firebase";
import { auth } from "./firebase";

export const authportal = new AuthPortal({
  client_id: process.env.NEXT_PUBLIC_AUTHPORTAL_CLIENT_ID as string,
  domain: process.env.NEXT_PUBLIC_AUTHPORTAL_DOMAIN as string,
  redirect_path: "/signin-authportal",
  firebase_auth: auth,
});
