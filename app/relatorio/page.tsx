import Sidebar from "../components/Sidebar";
import { getUserSession } from "../lib/session";
import MenuRelarorio from "./components/MenuRelatorio";

export default async function RelatorioPautasPorVeiculo() {
  const { typeUser, userName, token } = await getUserSession();
  return (
    <Sidebar typeUser={typeUser} userName={userName}>
      <MenuRelarorio token={token} />
    </Sidebar>
  );
}
