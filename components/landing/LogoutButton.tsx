"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("https://quran-be-59779bf2.fastapicloud.dev/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Remove token locally
      localStorage.removeItem("token");

      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);

      localStorage.removeItem("token");

      router.push("/login");
    }
  };

  return (
    <button onClick={handleLogout}>
      <LogOut className="size-5 cursor-pointer" />
    </button>
  );
}
