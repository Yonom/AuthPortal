"use client";

import { authportal } from "./authportal";

export default function Home() {
  return (
    <main className="flex flex-col items-center p-24">
      <button onClick={authportal.signInWithRedirect}>Login</button>
    </main>
  );
}
