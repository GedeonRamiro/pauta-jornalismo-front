"use client";

import { IPauta } from "@/app/types/types";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface IOffice {
  id: string;
  name: string;
}

interface IUser {
  id: string;
  name: string;
  typeUser: number;
  office?: IOffice;
  pauta: IPauta[];
}

type Props = {
  token: string;
};

// Mapeamento dos tipos de usuário
const tipoUsuarioMap: Record<number, string> = {
  1: "Padrão",
  2: "Intermediário",
  3: "Administrador",
};

const RelatorioPautas = ({ token }: Props) => {
  const [data, setData] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/nopagination`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const result = await response.json();
        setData(result.data || []);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  if (loading) return <p>Carregando dados...</p>;

  // 1. Total de pautas por usuário
  const pautasPorUsuario = data.map((user) => ({
    name: user.name,
    total: user.pauta.length,
  }));

  // 2. Total de pautas por tipo de usuário
  const pautasPorTipoCount: Record<number, number> = {};
  data.forEach((user) => {
    pautasPorTipoCount[user.typeUser] =
      (pautasPorTipoCount[user.typeUser] || 0) + user.pauta.length;
  });

  const pautasPorTipo = Object.entries(pautasPorTipoCount).map(
    ([typeUser, total]) => ({
      typeUser: tipoUsuarioMap[Number(typeUser)] || "Desconhecido",
      total,
    })
  );

  return (
    <div style={{ padding: 20 }}>
      <h3>Total de Pautas por Usuário</h3>
      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <BarChart data={pautasPorUsuario}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#0088FE" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3>Total de Pautas por Tipo de Usuário</h3>
      <div style={{ width: "100%", height: 400, marginTop: 50 }}>
        <ResponsiveContainer>
          <BarChart data={pautasPorTipo}>
            <XAxis dataKey="typeUser" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RelatorioPautas;
