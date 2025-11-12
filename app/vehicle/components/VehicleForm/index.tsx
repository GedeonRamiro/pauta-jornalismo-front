"use client";

import Loading from "@/app/components/loading";
import { IVehicle } from "@/app/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";

type Props = {
  token: string;
  vehicle?: IVehicle;
  onClose?: () => void;
};

export default function VehicleForm({ token, vehicle, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const route = useRouter();

  const schema = z.object({
    model: z.string().min(3, "No mínimo 3 caracteres"),
    manufacturer: z.string().min(3, "No mínimo 3 caracteres"),
    plate: z.string().min(3, "No mínimo 3 caracteres"),
    color: z.string().min(3, "No mínimo 3 caracteres"),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      model: vehicle?.model || "",
      manufacturer: vehicle?.manufacturer || "",
      plate: vehicle?.plate || "",
      color: vehicle?.color || "",
    },
  });

  async function handleSubmitVehicle(data: FormData) {
    setLoading(true);
    try {
      const isEdit = !!vehicle;
      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_API_URL}/vehicle/${vehicle.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/vehicle`;
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
        toast.error(result.message || "Erro ao salvar veículo!", {
          position: "top-center",
          autoClose: 5000,
          theme: "colored",
        });
        return;
      }

      toast.success(
        isEdit
          ? `Veículo ${result.model} atualizado com sucesso!`
          : `Veículo ${result.model} criado com sucesso!`,
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
      console.error("Erro ao salvar veículo:", error.message || error);
      toast.error("Erro ao salvar veículo", {
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
      <form onSubmit={handleSubmit(handleSubmitVehicle)} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Modelo
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-gray-500 focus:border-gray-500"
            {...register("model")}
          />
          {errors.model && (
            <p className="mt-1 text-sm text-red-600">{errors.model.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Frabricante
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-gray-500 focus:border-gray-500"
            {...register("manufacturer")}
          />
          {errors.manufacturer && (
            <p className="mt-1 text-sm text-red-600">
              {errors.manufacturer.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Placa
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-gray-500 focus:border-gray-500"
            {...register("plate")}
          />
          {errors.plate && (
            <p className="mt-1 text-sm text-red-600">{errors.plate.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Cor
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-gray-500 focus:border-gray-500"
            {...register("color")}
          />
          {errors.color && (
            <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-gray-700 hover:bg-gray-800 text-white font-medium rounded-lg text-sm px-5 py-2.5 cursor-pointer"
        >
          {vehicle ? "Atualizar" : "Salvar"}
        </button>
      </form>
    </div>
  );
}
