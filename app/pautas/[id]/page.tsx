import Sidebar from "@/app/components/Sidebar";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ICamera, IOffice, IPauta, IUser, IVehicle } from "@/app/types/types";
import MarkdownView from "@/app/components/MarkdownView";
import Link from "next/link";
import ModalConfirm from "@/app/components/ModalConfirm";
import { UserPermission } from "@/app/types/UserPermission";
import { getUserSession } from "@/app/lib/session";

interface IDataPauta extends IPauta {
  user: IUser;
  camera: ICamera;
  vehicle: IVehicle;
  teams: {
    id: string;
    name: string;
    office: IOffice;
  }[];
}

export default async function PautaDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const { userName, typeUser, token } = await getUserSession();

  let pauta: IDataPauta;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/pauta/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("Erro HTTP:", response.status);
      return redirect("/pautas");
    }

    pauta = await response.json();
  } catch (error: unknown) {
    console.error(
      "Erro ao buscar pauta:",
      error instanceof Error ? error.message : error
    );
    return redirect("/pautas");
  }
  async function deletePauta() {
    "use server";
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pauta/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Erro ao excluir pauta");

      redirect("/pautas");
    } catch (error) {
      console.error("Erro ao excluir pauta:", error);
      throw error;
    }
  }

  return (
    <Sidebar typeUser={typeUser} userName={userName}>
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm text-gray-500">
              {format(new Date(pauta.createdAt), "dd/MM/yyyy", {
                locale: ptBR,
              })}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              {pauta.name}
            </h2>
          </div>

          {typeUser === UserPermission.Admin && (
            <div className="flex gap-3 items-center">
              <Link
                href={`/pautas/createPauta?pautaId=${pauta.id}`}
                className="px-3 py-1 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 hover:text-gray-900 transition font-medium"
              >
                Editar
              </Link>

              <ModalConfirm
                titleModal="Tem certeza que deseja excluir esta pauta?"
                buttonDelete={
                  <button className="px-3 py-1 text-gray-600 border border-gray-300 rounded-md hover:bg-red-50 hover:text-red-600 transition font-medium cursor-pointer">
                    Excluir
                  </button>
                }
                onConfirm={deletePauta}
              />
            </div>
          )}
        </div>

        <div className="mt-3">
          <MarkdownView content={pauta.infomation} />
        </div>

        <hr className="border-gray-200" />

        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <h3 className="font-semibold bg-gray-100 rounded text-gray-800 mb-1">
              Usuário responsável
            </h3>
            <ul className="space-y-1">
              <li>
                <strong>Nome:</strong> {pauta.user.name}
              </li>
              <li>
                <strong>Telefone:</strong> {pauta.user.phone}
              </li>
            </ul>
          </div>

          {pauta.camera && (
            <div>
              <h3 className="font-semibold bg-gray-100 rounded text-gray-800 mb-1">
                Câmera
              </h3>
              <ul className="space-y-1">
                <li>
                  <strong>Nome:</strong> {pauta.camera.name}
                </li>
                <li>
                  <strong>ID:</strong> {pauta.camera.identifierNumber}
                </li>
              </ul>
            </div>
          )}

          {pauta.vehicle && (
            <div>
              <h3 className="font-semibold bg-gray-100 rounded text-gray-800 mb-1">
                Veículo
              </h3>
              <ul className="space-y-1">
                <li>
                  <strong>Modelo:</strong> {pauta.vehicle.model}
                </li>
                <li>
                  <strong>Fabricante:</strong> {pauta.vehicle.manufacturer}
                </li>
                <li>
                  <strong>Placa:</strong> {pauta.vehicle.plate}
                </li>
                <li>
                  <strong>Cor:</strong> {pauta.vehicle.color}
                </li>
              </ul>
            </div>
          )}

          {pauta.teams && pauta.teams.length > 0 && (
            <div>
              <h3 className="font-semibold bg-gray-100 rounded text-gray-800 mb-1">
                Equipe
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {pauta.teams.map((team) => (
                  <li key={team.id}>
                    {team.name} ({team.office?.name ?? "Sem cargo"})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
}
