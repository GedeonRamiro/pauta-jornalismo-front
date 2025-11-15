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

interface IPauta {
  id: string;
  name: string;
  infomation: string;
  createdAt: string;
}

interface ICamera {
  id: string;
  name: string;
  identifierNumber: string;
  pauta: IPauta[];
}

type Props = {
  token: string;
};

const RelatorioCameras = ({ token }: Props) => {
  const [data, setData] = useState<ICamera[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/camera/nopagination`,
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

  // 1. Quantidade de pautas por câmera
  const pautasPorCamera = data.map((camera) => ({
    name: camera.name,
    pautas: camera.pauta.length,
  }));

  // 2. Câmeras com pautas vs sem pautas
  const camerasSemPauta = data.filter(
    (camera) => camera.pauta.length === 0
  ).length;
  const camerasComPauta = data.length - camerasSemPauta;

  const resumoPautas = [
    { name: "Com pautas", value: camerasComPauta },
    { name: "Sem pautas", value: camerasSemPauta },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FF8042", "#AA336A"];

  return (
    <div style={{ padding: 20 }}>
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
    </div>
  );
};

export default RelatorioCameras;
