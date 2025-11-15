"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

import { IUser } from "@/app/types/types";

// Corrigido: IOffice deve ter `user`
interface IOffice {
  id: string;
  name: string;
  user: IUser[];
}

type Props = {
  token: string;
};

// Mapeamento manual dos tipos de usuário
const tipoUsuarioMap: Record<number, string> = {
  1: "Padrão",
  2: "Intermediário",
  3: "Administrador",
};

const RelatorioOffice = ({ token }: Props) => {
  const [data, setData] = useState<IOffice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/office/nopagination`,
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

  // 1. Usuários por Cargo (quantidade de usuários por cargo)
  const usuariosPorCargo = data.map((office) => ({
    name: office.name,
    usuarios: office.user.length,
  }));

  // 2. Usuários por tipoUser
  const tipoUsuarioCount: Record<number, number> = {};
  data.forEach((office) => {
    office.user.forEach((user) => {
      tipoUsuarioCount[user.typeUser] =
        (tipoUsuarioCount[user.typeUser] || 0) + 1;
    });
  });

  const usuariosPorTipo = Object.entries(tipoUsuarioCount).map(
    ([typeUser, total]) => ({
      typeUser: tipoUsuarioMap[Number(typeUser)] || "Desconhecido",
      total,
    })
  );

  // 3. Cargos preenchidos vs vazios
  const cargosVazios = data.filter((office) => office.user.length === 0).length;
  const cargosPreenchidos = data.length - cargosVazios;

  const resumoCargos = [
    { name: "Com usuários", value: cargosPreenchidos },
    { name: "Sem usuários", value: cargosVazios },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FF8042", "#AA336A"];

  return (
    <div style={{ padding: 20 }}>
      <h3>Usuários por Cargo</h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={usuariosPorCargo}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="usuarios" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3>Distribuição de Cargos (preenchidos x vazios)</h3>
      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={resumoCargos}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {resumoCargos.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <h3>Distribuição por Tipo de Usuário</h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={usuariosPorTipo}>
            <XAxis dataKey="typeUser" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#FF8042" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RelatorioOffice;
