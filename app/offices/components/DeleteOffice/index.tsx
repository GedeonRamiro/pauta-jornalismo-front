"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiTrash2 } from "react-icons/fi";
import ModalConfirm from "@/app/components/ModalConfirm";

type Props = {
  id: string;
  nameOffice: string;
  token: string;
};

export default function DeleteButton({ id, nameOffice, token }: Props) {
  const router = useRouter();

  async function handleDelete() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/office/${id}`,
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
        toast.error(data.message || "Erro ao apagar cargo", {
          position: "top-center",
          autoClose: 5000,
          theme: "colored",
        });
        return;
      }

      toast.success(`Cargo ${nameOffice} apagado com sucesso!`, {
        position: "top-center",
        autoClose: 5000,
        theme: "colored",
      });

      router.replace("/offices");
    } catch (error: any) {
      toast.error("Erro ao apagar cargo", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
      console.error("Erro ao apagar cargo:", error);
    }
  }

  return (
    <ModalConfirm
      buttonDelete={
        <FiTrash2 className="text-gray-900 cursor-pointer" size={18} />
      }
      titleModal={`Deseja apagar este cargo: ${nameOffice}?`}
      onConfirm={handleDelete}
    />
  );
}
