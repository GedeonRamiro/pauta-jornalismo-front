import Card from "../components/Card";
import Sidebar from "../components/Sidebar";
import Pagination from "../components/pagination";
import InputFilter from "../components/InputFilter";
import { IPagination, IPauta } from "../types/types";
import { MdInsertDriveFile } from "react-icons/md";
import Link from "next/link";
import { getUserSession } from "../lib/session";
import { UserPermission } from "../types/UserPermission";
import { redirect } from "next/navigation";

interface IDataPauta extends IPagination {
  data: IPauta[];
}

export default async function Pautas({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; filter?: string }>;
}) {
  const { userName, typeUser, token } = await getUserSession();
  if (
    typeUser !== UserPermission.Admin &&
    typeUser !== UserPermission.UserIntermediary
  )
    return redirect("/");

  const params = await searchParams;
  const currentPage = parseInt(params.page ?? "1");
  const filterPautas = params.filter ?? "";

  let pautas: IDataPauta | null = null;

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
    <Sidebar typeUser={typeUser} userName={userName}>
      <div className="flex justify-center">
        <h3 className="text-gray-900 text-center text-xl border-b-2 mb-6 font-bold">
          TODAS AS PAUTAS
        </h3>
      </div>
      <Link
        href={"/pautas/createPauta"}
        className="flex justify-end items-center mb-6"
      >
        <button className="flex justify-center items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white font-medium rounded text-sm px-6 py-2 cursor-pointer w-full md:w-auto">
          <MdInsertDriveFile />
          Nova Pauta
        </button>
      </Link>

      <div className="flex flex-col items-center justify-center">
        <div className="mb-6">{pautas && <InputFilter />}</div>
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
