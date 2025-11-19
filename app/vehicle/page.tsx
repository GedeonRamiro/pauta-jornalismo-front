import Sidebar from "../components/Sidebar";
import Pagination from "../components/pagination";
import Link from "next/link";
import { IPagination, IVehicle } from "../types/types";
import EditButtonVehicle from "./components/EditButtonVehicle";
import DeleteVehicle from "./components/DeleteVehicle";
import CreateVehicleModal from "./components/CreateVehicleModal";
import { getUserSession } from "../lib/session";
import { UserPermission } from "../types/UserPermission";
import { redirect } from "next/navigation";

interface IDataVehicle extends IPagination {
  data: IVehicle[];
}

export default async function Vehicles({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { userName, typeUser, token } = await getUserSession();
  if (typeUser !== UserPermission.Admin) return redirect("/");

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
  } catch (error: unknown) {
    console.error(
      "Erro ao buscar veículos:",
      error instanceof Error ? error.message : error
    );
  }

  return (
    <Sidebar typeUser={typeUser} userName={userName}>
      <div className="flex justify-center">
        <h3 className="text-gray-900 text-center text-xl border-b-2 mb-6 font-bold">
          VEÍCULOS
        </h3>
      </div>

      <CreateVehicleModal token={token} />

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
            <div className="grid grid-cols-3 border-b border-gray-200 py-2 px-4  hover:bg-gray-50 w-full">
              <Link href={`/vehicle/${vehicle.id}`}>
                <div className="w-full cursor-pointer">{vehicle.model}</div>
              </Link>
              <div className="w-full text-center">{vehicle.plate}</div>
              <div className="flex justify-end gap-3 w-full">
                <EditButtonVehicle token={token} vehicle={vehicle} />
                <DeleteVehicle
                  id={vehicle.id}
                  model={vehicle.model}
                  plate={vehicle.plate}
                  token={token}
                />
              </div>
            </div>
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
