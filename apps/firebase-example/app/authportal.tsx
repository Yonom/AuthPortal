import { AuthPortal } from "@authportal/firebase";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = JSON.parse(
  process.env.NEXT_PUBLIC_FIREBASE_CONFIG ?? "{}",
);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const authportal = new AuthPortal({
  client_id: process.env.NEXT_PUBLIC_AUTHPORTAL_CLIENT_ID as string,
  domain: process.env.NEXT_PUBLIC_AUTHPORTAL_DOMAIN as string,
  redirect_path: "/signin-authportal",
  firebase_auth: auth,
});
