import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Sidebar from "@/app/components/Sidebar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { IOffice, IUser } from "@/app/types/types";

import Link from "next/link";

interface IDataOffice extends IOffice {
  user: IUser[];
}

export default async function OfficeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const typeUser = Number(session.user?.typeUser);
  const token = String(session.user?.accessToken);

  let office: IDataOffice;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/office/${id}`,
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
      return redirect("/office");
    }

    office = await response.json();
  } catch (error: any) {
    console.error("Erro ao buscar Cargo:", error.message || error);
    return redirect("/office");
  }

  return (
    <Sidebar typeUser={typeUser}>
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <div>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {office.name}
          </h2>
        </div>

        <hr className="border-gray-200" />

        <div className="space-y-4 text-sm text-gray-700">
          {office.user.length === 0 && (
            <p className="text-center">
              Ainda não há registros para este cargo.
            </p>
          )}
          {office.user && office.user.length > 0 && (
            <div>
              <ul className="list-disc list-inside space-y-1">
                {office.user.map((user) => (
                  <li key={user.id}>
                    <Link
                      href={`/users/${user.id}`}
                      className="hover:bg-gray-200 underline cursor-pointer"
                    >
                      {user.name}
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
