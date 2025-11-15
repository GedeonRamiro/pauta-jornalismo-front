"use client";

import { useState } from "react";
import RelatorioVeiculo from "./RelatorioVeiculos";
import RelatorioOffice from "./RelatorioCargos";
import RelatorioCameras from "./RelatorioCameras";
import RelatorioUsuarios from "./RelatorioUsuarios";
import RelatorioPautas from "./RelatorioPautas";

type Props = {
  token: string;
};

export default function MenuRelatorio({ token }: Props) {
  const [menuAtivo, setMenuAtivo] = useState("pautas");

  const tabs = [
    { id: "pautas", label: "Pautas" },
    { id: "usuarios", label: "Usuários" },
    { id: "veiculos", label: "Veículos" },
    { id: "cargos", label: "Cargos" },
    { id: "cameras", label: "Câmeras" },
  ];

  return (
    <div className="py-6">
      {/* NAV MODERNO */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex flex-wrap gap-6 text-sm font-medium text-gray-600">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMenuAtivo(tab.id)}
              className={`
                relative pb-3 transition-colors
                hover:text-gray-900
                ${menuAtivo === tab.id ? "text-gray-900" : ""}
              `}
            >
              {tab.label}

              {/* linha animada embaixo */}
              {menuAtivo === tab.id && (
                <span
                  className="
                    absolute left-0 bottom-0 h-[2px] w-full
                    bg-gray-900 rounded-full
                    transition-all
                  "
                />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Conteúdo Responsivo */}
      <div className="w-full overflow-x-auto">
        {menuAtivo === "pautas" && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Relatório de Pautas</h2>
            <RelatorioPautas token={token} />
          </div>
        )}

        {menuAtivo === "usuarios" && (
          <div>
            <h2 className="text-xl font-semibold mb-3">
              Relatório de Usuários
            </h2>
            <RelatorioUsuarios token={token} />
          </div>
        )}

        {menuAtivo === "veiculos" && (
          <div>
            <h2 className="text-xl font-semibold mb-3">
              Relatório de Veículos
            </h2>
            <RelatorioVeiculo token={token} />
          </div>
        )}

        {menuAtivo === "cargos" && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Relatório de Cargos</h2>
            <RelatorioOffice token={token} />
          </div>
        )}

        {menuAtivo === "cameras" && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Relatório de Câmeras</h2>
            <RelatorioCameras token={token} />
          </div>
        )}
      </div>
    </div>
  );
}
