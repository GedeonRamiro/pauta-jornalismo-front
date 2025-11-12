import Sidebar from "@/app/components/Sidebar";
import FormPauta from "./formPauta";
import { getUserSession } from "@/app/lib/session";

export default async function CreatePautaPage() {
  const { userName, typeUser, token } = await getUserSession();

  return (
    <Sidebar typeUser={typeUser} userName={userName}>
      <div className="md:p-10  min-h-screen">
        <FormPauta token={token} typeUser={typeUser} />
      </div>
    </Sidebar>
  );
}
