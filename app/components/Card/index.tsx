"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type PautaProps = {
  pautas: PautaInfoPros[];
};

type PautaInfoPros = {
  id: string;
  name: string;
  infomation: string;
  createdAt: Date;
};

export default function Card({ pautas }: PautaProps) {
  return (
    <>
      {pautas.length === 0 && <p>Nenhum registro encontrado!</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 sm:gap-4">
        {pautas &&
          pautas.map((pauta) => (
            <div
              key={pauta.id}
              className="max-w-sm p-6 mb-4 bg-white border border-gray-200 rounded-lg "
            >
              <p className="text-sm">
                {format(new Date(pauta.createdAt), "dd/MM/yyyy", {
                  locale: ptBR,
                })}
              </p>
              <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
                {pauta.name}
              </h5>

              <p className="mb-3 font-normal text-gray-500">
                {pauta.infomation.slice(0, 100)}...
              </p>
            </div>
          ))}
      </div>
    </>
  );
}
