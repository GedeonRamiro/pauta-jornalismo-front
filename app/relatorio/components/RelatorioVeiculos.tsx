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
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

interface IUser {
  id: string;
  name: string;
  typeUser: number;
}

interface ICamera {
  id: string;
  name: string;
}

interface IVehicle {
  id: string;
  model: string;
  manufacturer: string;
}

interface IPauta {
  id: string;
  createdAt: string;
  user?: IUser;
  camera?: ICamera;
  vehicle?: IVehicle;
}

type Props = {
  token: string;
};

const tipoUsuarioMap: Record<number, string> = {
  1: "Padrão",
  2: "Intermediário",
  3: "Administrador",
};

const COLORS = ["#0088FE", "#00C49F", "#FF8042", "#AA336A", "#FFBB28"];

const RelatorioPautas = ({ token }: Props) => {
  const [data, setData] = useState<IPauta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/pauta/nopagination`,
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

  // Preparar dados

  // 1. Pautas por Usuário
  const pautasPorUsuarioCount: Record<string, number> = {};
  data.forEach((pauta) => {
    const name = pauta.user?.name || "Sem usuário";
    pautasPorUsuarioCount[name] = (pautasPorUsuarioCount[name] || 0) + 1;
  });
  const pautasPorUsuario = Object.entries(pautasPorUsuarioCount).map(
    ([name, pautas]) => ({ name, pautas })
  );

  // 2. Pautas por Tipo de Usuário
  const pautasPorTipoCount: Record<string, number> = {};
  data.forEach((pauta) => {
    const type = tipoUsuarioMap[pauta.user?.typeUser || 0] || "Desconhecido";
    pautasPorTipoCount[type] = (pautasPorTipoCount[type] || 0) + 1;
  });
  const pautasPorTipo = Object.entries(pautasPorTipoCount).map(
    ([name, pautas]) => ({ name, pautas })
  );

  // 3. Pautas por Veículo
  const pautasPorVeiculoCount: Record<string, number> = {};
  const pautasPorFabricanteCount: Record<string, number> = {};
  data.forEach((pauta) => {
    const model = pauta.vehicle?.model || "Sem veículo";
    const manufacturer = pauta.vehicle?.manufacturer || "Desconhecido";
    pautasPorVeiculoCount[model] = (pautasPorVeiculoCount[model] || 0) + 1;
    pautasPorFabricanteCount[manufacturer] =
      (pautasPorFabricanteCount[manufacturer] || 0) + 1;
  });
  const pautasPorVeiculo = Object.entries(pautasPorVeiculoCount).map(
    ([name, pautas]) => ({ name, pautas })
  );
  const pautasPorFabricante = Object.entries(pautasPorFabricanteCount).map(
    ([name, pautas]) => ({ name, pautas })
  );

  // 4. Pautas por Câmera
  const pautasPorCameraCount: Record<string, number> = {};
  data.forEach((pauta) => {
    const name = pauta.camera?.name || "Sem câmera";
    pautasPorCameraCount[name] = (pautasPorCameraCount[name] || 0) + 1;
  });
  const pautasPorCamera = Object.entries(pautasPorCameraCount).map(
    ([name, pautas]) => ({ name, pautas })
  );
  const resumoPautas = [
    { name: "Com pautas", value: data.length },
    { name: "Sem pautas", value: 0 }, // pode ser ajustado se houver lógica
  ];

  // 5. Pautas por Data
  const pautasPorMesCount: Record<string, number> = {};
  data.forEach((pauta) => {
    const date = new Date(pauta.createdAt).toLocaleDateString();
    pautasPorMesCount[date] = (pautasPorMesCount[date] || 0) + 1;
  });
  const pautasPorMesArray = Object.entries(pautasPorMesCount).map(
    ([name, pautas]) => ({ name, pautas })
  );

  return (
    <div style={{ padding: "20px" }}>
      <h3>Pautas por Usuário</h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={pautasPorUsuario}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pautas" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3>Distribuição por Tipo de Usuário</h3>
      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={pautasPorTipo}
              dataKey="pautas"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pautasPorTipo.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <h3>Pautas por Veículo</h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={pautasPorVeiculo}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pautas" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3>Pautas por Fabricante</h3>
      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={pautasPorFabricante}
              dataKey="pautas"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pautasPorFabricante.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <h3>Pautas por Câmera</h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={pautasPorCamera}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pautas" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3>Distribuição de Câmeras (com pautas x sem pautas)</h3>
      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={resumoPautas}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {resumoPautas.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <h3>Pautas ao Longo do Tempo</h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={pautasPorMesArray}>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Tooltip />
            <Line type="monotone" dataKey="pautas" stroke="#ff7300" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RelatorioPautas;
