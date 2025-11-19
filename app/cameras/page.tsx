import Pagination from "../components/pagination";
import Link from "next/link";
import { ICamera, IPagination } from "../types/types";
import CreateCameraModal from "./components/CreateCameraModal";
import EditButtonCamera from "./components/EditButtonOffice";
import DeleteCamera from "./components/DeleteCamera";
import { getUserSession } from "../lib/session";
import Sidebar from "../components/Sidebar";
import { UserPermission } from "../types/UserPermission";
import { redirect } from "next/navigation";

interface IDataCamera extends IPagination {
  data: ICamera[];
}

export default async function Cameras({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { userName, typeUser, token } = await getUserSession();
  if (typeUser !== UserPermission.Admin) return redirect("/");

  const params = await searchParams;
  const currentPage = parseInt(params.page ?? "1");

  let cameras: IDataCamera | null = null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/camera?page=${currentPage}`,
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

    cameras = await response.json();
  } catch (error: unknown) {
    console.error(
      "Erro ao buscar câmeras:",
      error instanceof Error ? error.message : error
    );
  }

  return (
    <Sidebar typeUser={typeUser} userName={userName}>
      <div className="flex justify-center">
        <h3 className="text-gray-900 text-center text-xl border-b-2 mb-6 font-bold">
          CÂMERAS
        </h3>
      </div>

      <CreateCameraModal token={token} />

      {!cameras && <p className="text-center">Nenhum câmera cadastrada!</p>}

      <div className="w-full mx-auto mt-8">
        {cameras !== null && (
          <div className="grid grid-cols-3 bg-gray-80 font-semibold py-2 px-4 rounded-t w-full">
            <div>Nome</div>
            <div className="text-center">Número de identificação</div>
            <div className="flex justify-end">Ação</div>
          </div>
        )}

        {cameras?.data.map((camera) => (
          <div key={camera.id}>
            <div className="grid grid-cols-3 border-b border-gray-200 py-2 px-4  hover:bg-gray-50 w-full">
              <Link href={`/cameras/${camera.id}`}>
                <div className="w-full cursor-pointer">{camera.name}</div>
              </Link>
              <div className="text-center">{camera.identifierNumber}</div>
              <div className="flex justify-end gap-3 w-full">
                <EditButtonCamera camera={camera} token={token} />
                <DeleteCamera id={camera.id} name={camera.name} token={token} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="md:mt-10 flex justify-center">
        <Pagination
          count={cameras?.count}
          currentPage={cameras?.currentPage}
          nextPage={cameras?.nextPage}
          lastPage={cameras?.lastPage}
          prevPage={cameras?.prevPage}
        />
      </div>
    </Sidebar>
  );
}
