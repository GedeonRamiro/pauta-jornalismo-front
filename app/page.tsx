// app/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route"; // ajuste o caminho correto
import Sidebar from "./components/Sidebar";
import Card from "./components/Card";
import Pagination from "./components/pagination";

interface IPautas {
  count: number;
  currentPage: number;
  lastPage: number;
  nextPage: number | null;
  prevPage: number | null;
  data: {
    id: string;
    name: string;
    cpf: string;
    email: string;
    pauta: PautaInfoPros[];
  };
}

interface PautaInfoPros {
  id: string;
  name: string;
  infomation: string;
  createdAt: Date;
}

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const userName = String(session.user?.name);
  const typeUser = Number(session.user?.typeUser);
  const token = String(session.user?.accessToken);

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

  console.log(pautaUser);

  return (
    <Sidebar typeUser={typeUser} userName={userName}>
      <p className="text-right">
        Bem-vindo, <strong>{session.user?.name}</strong>!
      </p>
      <div className="flex flex-col items-center justify-center mt-10">
        <h3 className="text-gray-900 text-xl border-b-2 mb-6 font-bold">
          PAUTAS
        </h3>
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
