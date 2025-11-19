import Sidebar from "../components/Sidebar";
import Pagination from "../components/pagination";
import Link from "next/link";
import { IOffice, IPagination } from "../types/types";
import CreateOfficeModal from "./components/CreateOfficeModal"; // ✅ novo
import EditButtonOffice from "./components/EditButtonOffice";
import DeleteOffice from "./components/DeleteOffice";
import { getUserSession } from "../lib/session";
import { UserPermission } from "../types/UserPermission";
import { redirect } from "next/navigation";

interface IDataOffice extends IPagination {
  data: IOffice[];
}

export default async function Offices({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { userName, typeUser, token } = await getUserSession();
  if (typeUser !== UserPermission.Admin) return redirect("/");

  const params = await searchParams;
  const currentPage = parseInt(params.page ?? "1");

  let offices: IDataOffice | null = null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/office?page=${currentPage}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

    offices = await response.json();
  } catch (error: unknown) {
    console.error(
      "Erro ao buscar cargos:",
      error instanceof Error ? error.message : error
    );
  }

  return (
    <Sidebar typeUser={typeUser} userName={userName}>
      <div className="flex justify-center">
        <h3 className="text-gray-900 text-center text-xl border-b-2 mb-6 font-bold">
          Cargos
        </h3>
      </div>

      <CreateOfficeModal token={token} />

      {!offices && <p className="text-center">Nenhum cargo cadastrado!</p>}

      <div className="w-full mx-auto mt-8">
        {offices && (
          <div className="grid grid-cols-2 bg-gray-80 font-semibold py-2 px-4 rounded-t w-full">
            <div>Nome</div>
            <div className="flex justify-end">Ação</div>
          </div>
        )}

        {offices?.data.map((office) => (
          <div key={office.id}>
            <div className="grid grid-cols-2 border-b border-gray-200 py-2 px-4 hover:bg-gray-50 w-full">
              <Link href={`/offices/${office.id}`}>
                <div className="w-full cursor-pointer">{office.name}</div>
              </Link>
              <div className="flex justify-end items-center gap-3 w-full">
                <EditButtonOffice office={office} token={token} />
                <DeleteOffice
                  id={office.id}
                  nameOffice={office.name}
                  token={token}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="md:mt-10 flex justify-center">
        <Pagination
          count={offices?.count}
          currentPage={offices?.currentPage}
          nextPage={offices?.nextPage}
          lastPage={offices?.lastPage}
          prevPage={offices?.prevPage}
        />
      </div>
    </Sidebar>
  );
}
