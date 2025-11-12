"use client";

import { IPauta } from "@/app/types/types";
import { format } from "date-fns";
import MarkdownView from "@/app/components/MarkdownView";
import { useRouter } from "next/navigation";
import { ptBR } from "date-fns/locale";

type PautaProps = {
  pautas: IPauta[];
};

export default function Card({ pautas }: PautaProps) {
  const router = useRouter();
  return (
    <>
      {pautas.length === 0 && <p>Nenhum registro encontrado!</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 sm:gap-4">
        {pautas.map((pauta) => (
          <div
            onClick={() => router.push(`/pautas/${pauta.id}`)}
            key={pauta.id}
            className="block max-w-sm p-6 mb-4 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition cursor-pointer"
          >
            <p className="text-sm">
              {format(new Date(pauta.createdAt), "dd/MM/yyyy", {
                locale: ptBR,
              })}
            </p>

            <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
              {pauta.name}
            </h5>

            {/* ⚙️ Usa o componente MarkdownView */}
            <div className="prose prose-sm text-gray-700 max-h-40 overflow-hidden">
              <MarkdownView
                content={
                  pauta.infomation.length > 200
                    ? pauta.infomation.slice(0, 200) + "..."
                    : pauta.infomation
                }
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
