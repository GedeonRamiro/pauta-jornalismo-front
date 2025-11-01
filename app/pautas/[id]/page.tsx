import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Sidebar from "@/app/components/Sidebar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ICamera, IOffice, IPauta, IUser, IVehicle } from "@/app/types/types";

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
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const typeUser = Number(session.user?.typeUser);
  const token = String(session.user?.accessToken);

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
  } catch (error: any) {
    console.error("Erro ao buscar pauta:", error.message || error);
    return redirect("/pautas");
  }

  return (
    <Sidebar typeUser={typeUser}>
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <div>
          <p className="text-sm text-gray-500">
            {format(new Date(pauta.createdAt), "dd/MM/yyyy", { locale: ptBR })}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {pauta.name}
          </h2>

          <p className="mt-3 text-gray-700">{pauta.infomation}</p>
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
                {pauta &&
                  pauta.teams.map((team) => (
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
