"use client";

import Loading from "@/app/components/loading";
import { IOffice } from "@/app/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";

type Props = {
  token: string;
  office?: IOffice;
  onClose?: () => void;
};

export default function OfficeForm({ token, office, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const route = useRouter();

  const schema = z.object({
    name: z.string().min(3, "No mínimo 3 caracteres "),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: office?.name || "" },
  });

  async function handleSubmitOffice(data: FormData) {
    setLoading(true);
    try {
      const isEdit = !!office;
      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_API_URL}/office/${office.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/office`;
      const method = isEdit ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Erro ao salvar cargo", {
          position: "top-center",
          autoClose: 5000,
          theme: "colored",
        });
        return;
      }

      toast.success(
        isEdit
          ? `Cargo ${result.name} atualizado com sucesso!`
          : `Cargo ${result.name} criado com sucesso!`,
        {
          position: "top-center",
          autoClose: 5000,
          theme: "colored",
        }
      );

      reset();
      onClose?.();
      route.refresh();
    } catch (error: any) {
      console.error("Erro ao salvar cargo:", error.message || error);
      toast.error("Erro ao salvar cargo", {
        position: "top-center",
        autoClose: 5000,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-5">
      {loading && <Loading />}
      <form onSubmit={handleSubmit(handleSubmitOffice)} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Nome
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-gray-500 focus:border-gray-500"
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-gray-700 hover:bg-gray-800 text-white font-medium rounded-lg text-sm px-5 py-2.5 cursor-pointer"
        >
          {office ? "Atualizar" : "Salvar"}
        </button>
      </form>
    </div>
  );
}
