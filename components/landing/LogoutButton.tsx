"use client";

import { logout } from "@/lib/utils/auth";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const handleLogout = async () => {
    await logout();
  };

  return (
    <button onClick={handleLogout}>
      <LogOut className="size-5 cursor-pointer" />
    </button>
  );
}
