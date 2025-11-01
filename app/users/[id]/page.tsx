import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Sidebar from "@/app/components/Sidebar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { IOffice, IPauta, IUser } from "@/app/types/types";

export interface IDataUser extends IUser {
  office: IOffice;
  pauta: IPauta[];
}

export default async function UserDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const typeUser = Number(session.user?.typeUser);
  const token = String(session.user?.accessToken);

  let user: IDataUser;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/${id}`,
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
      return redirect("/users");
    }

    user = await response.json();
  } catch (error: any) {
    console.error("Erro ao buscar usuários:", error.message || error);
    return redirect("/users");
  }

  return (
    <Sidebar typeUser={typeUser}>
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <div>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">{user.name}</h2>
        </div>

        <hr className="border-gray-200" />

        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <ul className="space-y-1">
              <li>
                <strong>Nome:</strong> {user.name}
              </li>
              <li>
                <strong>Cargo:</strong> {user.office?.name}
              </li>
              <li>
                <strong>Telefone:</strong> {user.phone}
              </li>
              <li>
                <strong>Email:</strong> {user.email}
              </li>
              <li>
                <strong>Telefone:</strong> {user.cpf}
              </li>
            </ul>
          </div>

          {user.pauta && user.pauta.length > 0 && (
            <div>
              <h3 className="font-semibold bg-gray-50 rounded text-gray-800 mb-1">
                Pautas Relacionadas
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {user.pauta.map((pauta) => (
                  <li key={pauta.id}>
                    <Link
                      href={`/pautas/${pauta.id}`}
                      className="hover:bg-gray-200 underline cursor-pointer"
                    >
                      {pauta.name} (
                      {format(new Date(pauta.createdAt), "dd/MM/yyyy", {
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
