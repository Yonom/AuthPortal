"use client";

import { logout } from "@/components/withAuth";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";

export const LogoutButton = () => {
  const handleLogout = () => {
    logout();
  };

  return <button onClick={handleLogout}>Log out</button>;
};
