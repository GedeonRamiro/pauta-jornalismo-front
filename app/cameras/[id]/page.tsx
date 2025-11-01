import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Sidebar from "@/app/components/Sidebar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { ICamera, IPauta } from "@/app/types/types";

interface IDataCamera extends ICamera {
  pauta: IPauta[];
}

export default async function cameraDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const typeUser = Number(session.user?.typeUser);
  const token = String(session.user?.accessToken);

  let camera: IDataCamera;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/camera/${id}`,
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
      return redirect("/camera");
    }

    camera = await response.json();
  } catch (error: any) {
    console.error("Erro ao buscar câmera:", error.message || error);
    return redirect("/camera");
  }

  return (
    <Sidebar typeUser={typeUser}>
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <div>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {camera.name}
          </h2>
        </div>

        <hr className="border-gray-200" />

        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <ul className="space-y-1">
              <li>
                <strong>Nome:</strong> {camera.name}
              </li>

              <li>
                <strong>Número de identificação:</strong>{" "}
                {camera.identifierNumber}
              </li>
            </ul>
          </div>

          {camera.pauta && camera.pauta.length > 0 && (
            <div>
              <h3 className="font-semibold bg-gray-50 rounded text-gray-800 mb-1">
                Pautas Relacionadas
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {camera.pauta.map((pautas) => (
                  <li key={pautas.id}>
                    <Link
                      href={`/pautas/${pautas.id}`}
                      className="hover:bg-gray-200 underline cursor-pointer"
                    >
                      {pautas.name} (
                      {format(new Date(pautas.createdAt), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                      )
                    </Link>
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
