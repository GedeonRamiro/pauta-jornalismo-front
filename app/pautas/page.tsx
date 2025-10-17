import { getServerSession } from "next-auth";
import Card from "../components/Card";
import Sidebar from "../components/Sidebar";
import Pagination from "../components/pagination";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import InputFilter from "../components/InputFilter";

interface IPautas {
  count: number;
  currentPage: number;
  lastPage: number;
  nextPage: number | null;
  prevPage: number | null;
  data: { id: string; name: string; infomation: string; createdAt: Date }[];
}

export default async function Pautas({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; filter?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const typeUser = Number(session.user?.typeUser);
  const token = String(session.user?.accessToken);

  const params = await searchParams;
  const currentPage = parseInt(params.page ?? "1");
  const filterPautas = params.filter ?? "";

  console.log(filterPautas);

  let pautas: IPautas | null = null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/pauta?page=${currentPage}&filter=${filterPautas}`,
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
    pautas = await response.json();
  } catch (error: any) {
    console.error("Erro ao buscar pautas:", error.message || error);
  }

  return (
    <Sidebar typeUser={typeUser}>
      <div className="flex flex-col items-center justify-center mt-10">
        <h3 className="text-gray-900 text-xl border-b-2 mb-6 font-bold">
          TODAS AS PAUTAS
        </h3>
        <div className="mb-6">
          <InputFilter />
        </div>
        <Card pautas={pautas?.data ?? []} />
        <div className="md:mt-10">
          <Pagination
            count={pautas?.count}
            currentPage={pautas?.currentPage}
            nextPage={pautas?.nextPage}
            lastPage={pautas?.lastPage}
            prevPage={pautas?.prevPage}
          />
        </div>
      </div>
    </Sidebar>
  );
}
