"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiTrash2 } from "react-icons/fi";
import ModalConfirm from "@/app/components/ModalConfirm";

type Props = {
  id: string;
  model: string;
  plate: string;
  token: string;
};

export default function DeleteVehicle({ id, model, plate, token }: Props) {
  const router = useRouter();

  async function handleDelete() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/vehicle/${id}`,
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
        toast.error(data.message || "Erro ao apagar veículo", {
          position: "top-center",
          autoClose: 5000,
          theme: "colored",
        });
        return;
      }

      toast.success(`Veículo ${model} apagado com sucesso!`, {
        position: "top-center",
        autoClose: 5000,
        theme: "colored",
      });

      router.refresh();
    } catch (error: unknown) {
      toast.error("Erro ao apagar veículo", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
      console.error(
        "Erro ao apagar veículo:",
        error instanceof Error ? error.message : error
      );
    }
  }

  return (
    <ModalConfirm
      buttonDelete={
        <FiTrash2 className="text-gray-900 cursor-pointer" size={18} />
      }
      titleModal={`Deseja apagar este Veículo: ${model} - (${plate}) ?`}
      onConfirm={handleDelete}
    />
  );
}
