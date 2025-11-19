"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiTrash2 } from "react-icons/fi";
import ModalConfirm from "@/app/components/ModalConfirm";

type Props = {
  id: string;
  name: string;
  token: string;
};

export default function DeleteCamera({ id, name, token }: Props) {
  const router = useRouter();

  async function handleDelete() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/camera/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Erro ao apagar câmera", {
          position: "top-center",
          autoClose: 5000,
          theme: "colored",
        });
        return;
      }

      toast.success(`Câmera ${name} apagado com sucesso!`, {
        position: "top-center",
        autoClose: 5000,
        theme: "colored",
      });

      router.replace("/cameras");
    } catch (error: unknown) {
      toast.error("Erro ao apagar câmera", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
      console.error(
        "Erro ao apagar câmera:",
        error instanceof Error ? error.message : error
      );
    }
  }

  return (
    <ModalConfirm
      buttonDelete={
        <FiTrash2 className="text-gray-900 cursor-pointer" size={18} />
      }
      titleModal={`Deseja apagar este câmera: ${name}?`}
      onConfirm={handleDelete}
    />
  );
}
