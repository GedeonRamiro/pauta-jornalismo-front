import Sidebar from "../components/Sidebar";
import Pagination from "../components/pagination";
import Link from "next/link";
import { IPagination, IUser } from "../types/types";
import EditButtonUser from "./components/EditButtonUser";
import DeleteUser from "./components/DeleteUser";
import { UserPermission } from "../types/UserPermission";
import { getUserSession } from "../lib/session";
import { redirect } from "next/navigation";

interface IDataUser extends IPagination {
  data: IUser[];
}

export default async function Users({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { userName, typeUser, token } = await getUserSession();
  if (typeUser !== UserPermission.Admin) return redirect("/");

  const params = await searchParams;
  const currentPage = parseInt(params.page ?? "1");

  let users: IDataUser | null = null;

  function getTypeUserLabel(type: number) {
    switch (type) {
      case 1:
        return "Usuário Padrão";
      case 2:
        return "Usuário Intermediário";
      case 3:
        return "Administrador";
      default:
        return "Desconhecido";
    }
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user?page=${currentPage}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    users = await response.json();
  } catch (error: any) {
    console.error("Erro ao buscar usuários:", error.message || error);
  }

  return (
    <Sidebar typeUser={typeUser} userName={userName}>
      <div className="flex justify-center">
        <h3 className="text-gray-900 text-center text-xl border-b-2 mb-6 font-bold">
          USUÁRIOS
        </h3>
      </div>
      {!users && <p className="text-center">Nenhum usuário cadastrado!</p>}

      <div className="flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 sm:gap-4">
          {users?.data.map((user) => (
            <div key={user.id}>
              <div className="block max-w-sm p-4 mb-4 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition">
                <Link href={`/users/${user.id}`} className="block">
                  <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
                    {user.name}
                  </h5>
                  <p className="mb-3 font-normal text-gray-500">
                    {getTypeUserLabel(user.typeUser)}
                  </p>
                </Link>
                {typeUser === UserPermission.Admin && (
                  <div className="flex gap-4 text-white text-sm mt-3">
                    <EditButtonUser user={user} token={token} />
                    <DeleteUser id={user.id} name={user.name} token={token} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="md:mt-10 flex  justify-center">
          <Pagination
            count={users?.count}
            currentPage={users?.currentPage}
            nextPage={users?.nextPage}
            lastPage={users?.lastPage}
            prevPage={users?.prevPage}
          />
        </div>
      </div>
    </Sidebar>
  );
}
