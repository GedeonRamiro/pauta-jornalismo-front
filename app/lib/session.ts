import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export async function getUserSession() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const userName = String(session.user?.name);
  const typeUser = Number(session.user?.typeUser);
  const token = String(session.user?.accessToken);

  return { userName, typeUser, token };
}
