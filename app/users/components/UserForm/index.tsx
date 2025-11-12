"use client";

import Loading from "@/app/components/loading";
import { IOffice, IPagination, IUser } from "@/app/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";

type Props = {
  token: string;
  user?: IUser;
  onClose?: () => void;
};

interface IDataOffice extends IPagination {
  data: IOffice[];
}

export default function UserForm({ token, user, onClose }: Props) {
  const [loading, setLoading] = useState(true);
  const [offices, setOffices] = useState<IDataOffice | undefined>();
  const router = useRouter();

  const userTypes = [
    { value: 1, label: "Usuário Padrão" },
    { value: 2, label: "Usuário Intermediário" },
    { value: 3, label: "Administrador" },
  ];

  const formatPhoneValue = (phone?: string) => {
    if (!phone) return "";
    return phone
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d{4})$/, "$1-$2");
  };

  function formatPhone(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatPhoneValue(e.target.value);
    e.target.value = formatted;
    setValue("phone", formatted);
  }

  const schema = z.object({
    name: z.string().min(3, "No mínimo 3 caracteres"),
    phone: z.string().length(15, "Digite um telefone válido!"),
    office_id: z.string().min(1, "Obrigatório um cargo"),
    typeUser: z.number().min(1, "Selecione o tipo de usuário"),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || "",
      phone: formatPhoneValue(user?.phone),
      office_id: user?.office_id || "",
      typeUser: user?.typeUser || 1,
    },
  });

  const handleSubmitUser = async (data: FormData) => {
    setLoading(true);

    const cleanedData = {
      ...data,
      phone: data.phone.replace(/\D/g, ""),
    };

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/user/${user?.id}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cleanedData),
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Erro ao atualizar usuário!", {
          position: "top-center",
          autoClose: 5000,
          theme: "colored",
        });
        return;
      }

      toast.success(`Usuário ${result.name} atualizado com sucesso!`, {
        position: "top-center",
        autoClose: 5000,
        theme: "colored",
      });

      reset();
      onClose?.();
      router.refresh();
    } catch (err: any) {
      console.error("Erro ao atualizar usuário:", err.message || err);
      toast.error("Erro ao atualizar usuário!", {
        position: "top-center",
        autoClose: 5000,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOffices = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/office/nopagination`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }
      );

      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      const data = (await response.json()) as IDataOffice;
      setOffices(data);
    } catch (err: any) {
      console.error("Erro ao buscar cargos:", err.message || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffices();
  }, [token]);

  return (
    <div className="p-5">
      {loading && <Loading />}
      <form onSubmit={handleSubmit(handleSubmitUser)} className="space-y-4">
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

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Telefone
          </label>
          <input
            type="tel"
            placeholder="(00) 00000-0000"
            maxLength={15}
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-gray-500 focus:border-gray-500"
            {...register("phone", { onChange: formatPhone })}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Cargo
          </label>
          <select
            className="w-full p-2 border rounded-lg bg-gray-50 text-gray-900 focus:ring-gray-500 focus:border-gray-500"
            {...register("office_id")}
          >
            <option value="">Selecione um cargo...</option>
            {offices?.data.map((office) => (
              <option key={office.id} value={office.id}>
                {office.name}
              </option>
            ))}
          </select>
          {errors.office_id && (
            <p className="mt-1 text-sm text-red-600">
              {errors.office_id.message}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          {userTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              className={`p-2 rounded cursor-pointer ${
                watch("typeUser") === type.value
                  ? "bg-gray-700 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
              onClick={() => setValue("typeUser", type.value)}
            >
              {type.label}
            </button>
          ))}
        </div>

        {errors.typeUser && (
          <p className="mt-1 text-sm text-red-600">{errors.typeUser.message}</p>
        )}

        {/* Botão */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-700 hover:bg-gray-800 text-white font-medium rounded-lg text-sm px-5 py-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Atualizando..." : "Atualizar"}
        </button>
      </form>
    </div>
  );
}
