"use client";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { AuthPortal } from "@authportal/firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBR0ezd1imhjJ0zduCKQ7fC8j5F-PsPMF0",
  authDomain: "authportal-app.firebaseapp.com",
  projectId: "authportal-app",
  storageBucket: "authportal-app.appspot.com",
  messagingSenderId: "758794462444",
  appId: "1:758794462444:web:fc918ef692aec519beb1c9",
};

const app = initializeApp(firebaseConfig);

const authportal = new AuthPortal({
  domain: "GRk701VF2ECSDoyWuZP0.authportal.site",
  client_id: "pk_gMuD8PnVYosdNsEekWhjyx6l",
  firebase_auth: getAuth(app),
});

export default function Home() {
  return (
    <main className="flex flex-col items-center p-24">
      <button onClick={authportal.signInWithPopup}>Login</button>
      <p>Login Status: {getAuth(app).currentUser?.email ?? "Not Logged In"}</p>
    </main>
  );
}
