"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/login" });
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
    >
      Sair
    </button>
  );
}
