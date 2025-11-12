"use client";

import { useRouter } from "next/navigation";
import { TbError404 } from "react-icons/tb"; // ícone opcional

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center h-screen text-center px-6">
      <TbError404 className="text-6xl text-gray-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Página não encontrada</h1>
      <p className="text-gray-600 mb-6">
        Parece que você tentou acessar uma página que não existe.
      </p>

      <button
        onClick={() => router.push("/")}
        className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition cursor-pointer"
      >
        Voltar para a página inicial
      </button>
    </main>
  );
}
