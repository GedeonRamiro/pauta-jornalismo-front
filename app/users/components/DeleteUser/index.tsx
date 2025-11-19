"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ModalConfirm from "@/app/components/ModalConfirm";
import { MdDelete } from "react-icons/md";

type Props = {
  id: string;
  name: string;
  token: string;
};

export default function DeleteUser({ id, name, token }: Props) {
  const router = useRouter();

  async function handleDelete() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${id}`,
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
        toast.error(data.message || "Erro ao apagar usuário!", {
          position: "top-center",
          autoClose: 5000,
          theme: "colored",
        });
        return;
      }

      toast.success(`Usuário ${name} apagado com sucesso!`, {
        position: "top-center",
        autoClose: 5000,
        theme: "colored",
      });

      router.refresh();
    } catch (error: unknown) {
      toast.error("Erro ao apagar usuário!", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
      console.error(
        "Erro ao apagar usuário!",
        error instanceof Error ? error.message : error
      );
    }
  }

  return (
    <ModalConfirm
      buttonDelete={
        <button className="bg-gray-700 hover:bg-gray-700 p-2 rounded transition cursor-pointer">
          <MdDelete />
        </button>
      }
      titleModal={`Deseja apagar este usuário: ${name} ?`}
      onConfirm={handleDelete}
    />
  );
}
