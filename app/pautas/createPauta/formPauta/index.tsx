"use client";

import Loading from "@/app/components/loading";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";
import { UserPermission } from "@/app/types/UserPermission";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

type Props = {
  token: string;
  typeUser: number;
  onClose?: () => void;
};

interface IUser {
  id: string;
  name: string;
}

interface IVehicle {
  id: string;
  model: string;
}

interface ICamera {
  id: string;
  name: string;
}

interface IPauta {
  name: string;
  infomation: string;
  cameraId?: string;
  vehicleId?: string;
  team?: string[];
}

export default function FormPauta({ token, typeUser, onClose }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pautaId = searchParams.get("pautaId");

  const [loading, setLoading] = useState(false);
  const [pautaData, setPautaData] = useState<IPauta | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [cameras, setCameras] = useState<ICamera[]>([]);

  const schema = z.object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    infomation: z
      .string()
      .min(10, "A informação deve ter pelo menos 10 caracteres"),
    team:
      typeUser === UserPermission.Admin
        ? z.array(z.string()).min(1, "Selecione pelo menos um usuário")
        : z.array(z.string()).optional(),
    vehicleId:
      typeUser === UserPermission.Admin
        ? z.string().nonempty("Selecione um veículo")
        : z.string().optional(),
    cameraId:
      typeUser === UserPermission.Admin
        ? z.string().nonempty("Selecione uma câmera")
        : z.string().optional(),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      infomation: "",
      team: [],
      vehicleId: "",
      cameraId: "",
    },
  });

  const { team, vehicleId, cameraId } = watch();

  useEffect(() => {
    async function fetchOptions() {
      try {
        const [user, vehicle, camera] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/nopagination`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicle/nopagination`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/camera/nopagination`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const [usersData, vehiclesData, camerasData] = await Promise.all([
          user.json(),
          vehicle.json(),
          camera.json(),
        ]);

        setUsers(usersData.data || []);
        setVehicles(vehiclesData.data || []);
        setCameras(camerasData.data || []);
      } catch {
        toast.error("Erro ao carregar listas.");
      }
    }
    fetchOptions();
  }, [token]);

  useEffect(() => {
    async function fetchPauta() {
      if (!pautaId) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/pauta/${pautaId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        const pauta: IPauta = {
          name: data.name || "",
          infomation: data.infomation || "",
          team: data.teams?.map((user: any) => user.id) || [],
          vehicleId: data.vehicle?.id || "",
          cameraId: data.camera?.id || "",
        };

        setPautaData(pauta);
        reset(pauta);
      } catch {
        toast.error("Erro ao carregar pauta para edição!");
      }
    }
    fetchPauta();
  }, [pautaId, token, reset]);

  const ready =
    users.length > 0 &&
    vehicles.length > 0 &&
    cameras.length > 0 &&
    (pautaData || !pautaId);

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      const isEdit = !!pautaId;
      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_API_URL}/pauta/${pautaId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/pauta`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      toast.success(
        `${isEdit ? "Pauta atualizada" : "Pauta criada"} com sucesso!`,
        {
          position: "top-center",
          autoClose: 5000,
          theme: "colored",
        }
      );
      router.replace(`/pautas/${pautaId || result.id}`);
      onClose?.();
    } catch (e: any) {
      toast.error(e.message || "Erro ao salvar pauta", {
        position: "top-center",
        autoClose: 5000,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  }

  if (!ready) return <Loading />;

  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-6">
      {loading && <Loading />}
      <h1 className="text-2xl font-bold mb-5">
        {pautaId ? "Editar Pauta" : "Criar Nova Pauta"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium">Nome da pauta</label>
          <input
            {...register("name")}
            className="w-full border rounded p-2"
            placeholder="Digite o nome"
          />
          {errors.name && (
            <p className="text-red-600 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium">Informação</label>
          <Controller
            name="infomation"
            control={control}
            render={({ field }) => (
              <div className="border rounded overflow-hidden">
                <MDEditor
                  value={field.value}
                  onChange={field.onChange}
                  height={200}
                />
              </div>
            )}
          />
          {errors.infomation && (
            <p className="text-red-600 text-sm">{errors.infomation.message}</p>
          )}
        </div>

        {typeUser === UserPermission.Admin && (
          <>
            <div>
              <label className="block mb-2 font-medium">Usuários</label>
              <div className="flex flex-wrap gap-2">
                {users.map((user) => {
                  const selected = team?.includes(user.id);
                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() =>
                        setValue(
                          "team",
                          selected
                            ? team?.filter((id) => id !== user.id)
                            : [...(team || []), user.id]
                        )
                      }
                      className={`px-3 py-1 rounded ${
                        selected
                          ? "bg-gray-700 text-white"
                          : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      {user.name}
                    </button>
                  );
                })}
              </div>
              {errors.team && (
                <p className="text-red-600 text-sm">{errors.team.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 font-medium">Veículo</label>
              <div className="flex flex-wrap gap-2">
                {vehicles.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    type="button"
                    onClick={() => setValue("vehicleId", vehicle.id)}
                    className={`px-3 py-1 rounded ${
                      vehicleId === vehicle.id
                        ? "bg-gray-700 text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    {vehicle.model}
                  </button>
                ))}
              </div>
              {errors.vehicleId && (
                <p className="text-red-600 text-sm">
                  {errors.vehicleId.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 font-medium">Câmera</label>
              <div className="flex flex-wrap gap-2">
                {cameras.map((camera) => (
                  <button
                    key={camera.id}
                    type="button"
                    onClick={() => setValue("cameraId", camera.id)}
                    className={`px-3 py-1 rounded ${
                      cameraId === camera.id
                        ? "bg-gray-700 text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    {camera.name}
                  </button>
                ))}
              </div>
              {errors.cameraId && (
                <p className="text-red-600 text-sm">
                  {errors.cameraId.message}
                </p>
              )}
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full text-gray-100 bg-gray-700 py-3 rounded-lg font-medium hover:bg-gray-800 transition cursor-pointer"
        >
          {pautaId ? "Atualizar Pauta" : "Salvar Pauta"}
        </button>
      </form>
    </div>
  );
}
