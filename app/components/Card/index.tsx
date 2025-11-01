"use client";

import { IPauta } from "@/app/types/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

type PautaProps = {
  pautas: IPauta[];
};

export default function Card({ pautas }: PautaProps) {
  return (
    <>
      {pautas.length === 0 && <p>Nenhum registro encontrado!</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 sm:gap-4">
        {pautas.map((pauta) => (
          <Link
            href={`/pautas/${pauta.id}`}
            key={pauta.id}
            className="block max-w-sm p-6 mb-4 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition"
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
          </Link>
        ))}
      </div>
    </>
  );
}
