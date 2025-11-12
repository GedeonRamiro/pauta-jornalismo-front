import Sidebar from "./components/Sidebar";
import Card from "./components/Card";
import Pagination from "./components/pagination";
import { IPagination, IPauta } from "./types/types";
import { getUserSession } from "./lib/session";

interface IPautas extends IPagination {
  data: {
    id: string;
    name: string;
    cpf: string;
    email: string;
    pauta: IPauta[];
  };
}

export default async function Home() {
  const { userName, typeUser, token } = await getUserSession();

  let pautaUser: IPautas | null = null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/climb/pauta`,
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

    pautaUser = await response.json();
  } catch (error: any) {
    console.error("Erro ao buscar pautas:", error.message || error);
  }

  return (
    <Sidebar typeUser={typeUser} userName={userName}>
      <div className="flex justify-center">
        <h3 className="text-gray-900 text-center text-xl border-b-2 mb-6 font-bold">
          PAUTAS
        </h3>
      </div>
      <div className="flex flex-col items-center justify-center">
        <Card pautas={pautaUser?.data.pauta ?? []} />
        <div className="md:mt-10">
          <Pagination
            count={pautaUser?.count}
            currentPage={pautaUser?.currentPage}
            nextPage={pautaUser?.nextPage}
            lastPage={pautaUser?.lastPage}
            prevPage={pautaUser?.prevPage}
          />
        </div>
      </div>
    </Sidebar>
  );
}
