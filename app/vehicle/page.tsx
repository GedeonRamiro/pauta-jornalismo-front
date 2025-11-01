import { getServerSession } from "next-auth";
import Sidebar from "../components/Sidebar";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Pagination from "../components/pagination";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Link from "next/link";
import { IPagination, IVehicle } from "../types/types";

interface IDataVehicle extends IPagination {
  data: IVehicle[];
}

export default async function Vehicles({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const typeUser = Number(session.user?.typeUser);
  const token = String(session.user?.accessToken);

  const params = await searchParams;
  const currentPage = parseInt(params.page ?? "1");

  let vehicles: IDataVehicle | null = null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vehicle?page=${currentPage}`,
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

    vehicles = await response.json();
  } catch (error: any) {
    console.error("Erro ao buscar veículos:", error.message || error);
  }

  return (
    <Sidebar typeUser={typeUser}>
      <div className="flex justify-center">
        <h3 className="text-gray-900 text-center text-xl border-b-2 mb-6 font-bold">
          VEÍCULOS
        </h3>
      </div>
      {!vehicles && <p className="text-center">Nenhum veículo cadastrado!</p>}
      <div className="w-full mx-auto mt-8">
        {vehicles !== null && (
          <div className="grid grid-cols-3 bg-gray-80 font-semibold py-2 px-4 rounded-t w-full">
            <div>Modelo</div>
            <div className="text-center">Placa</div>
            <div className="flex justify-end">Ação</div>
          </div>
        )}
        {vehicles?.data.map((vehicle) => (
          <div key={vehicle.id}>
            <Link href={`/vehicle/${vehicle.id}`}>
              <div className="grid grid-cols-3 border-b border-gray-200 py-2 px-4 cursor-pointer hover:bg-gray-50 w-full">
                <div className="w-full">{vehicle.model}</div>
                <div className="w-full text-center">{vehicle.plate}</div>
                <div className="flex justify-end gap-3 w-full">
                  <button
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="Editar"
                  >
                    <FiEdit
                      className="text-gray-900 cursor-pointer"
                      size={18}
                    />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Apagar"
                  >
                    <FiTrash2
                      className="text-gray-900 cursor-pointer"
                      size={18}
                    />
                  </button>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="md:mt-10 flex justify-center">
        <Pagination
          count={vehicles?.count}
          currentPage={vehicles?.currentPage}
          nextPage={vehicles?.nextPage}
          lastPage={vehicles?.lastPage}
          prevPage={vehicles?.prevPage}
        />
      </div>
    </Sidebar>
  );
}
