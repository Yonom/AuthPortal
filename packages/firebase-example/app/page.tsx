"use client";

import { authPortal } from "./authportal";

export default function Home() {
  return (
    <main className="flex flex-col items-center p-24">
      <button onClick={authPortal.signInWithRedirect}>Login</button>
    </main>
  );
}
