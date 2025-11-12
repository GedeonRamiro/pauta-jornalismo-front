"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import React from "react";

// --- MOCK SIMPLIFICADO ---
const mockData = {
  data: [
    { model: "Sentra SL", manufacturer: "Nissan", pauta: Array(9).fill({}) },
    { model: "Sandero", manufacturer: "Renault", pauta: Array(1).fill({}) },
    { model: "Loagn", manufacturer: "Renault", pauta: Array(1).fill({}) },
    { model: "Uno", manufacturer: "Fiat", pauta: Array(4).fill({}) },
    { model: "Cronos", manufacturer: "Fiat", pauta: Array(2).fill({}) },
    { model: "Argo", manufacturer: "Fiat", pauta: Array(1).fill({}) },
    { model: "Fox", manufacturer: "Volkswagen", pauta: [] },
    { model: "Gol", manufacturer: "Volkswagen", pauta: Array(13).fill({}) },
  ],
};

// --- TRANSFORMA OS DADOS PARA O GRÁFICO ---
const chartData = mockData.data.map((item) => ({
  name: item.model,
  pautas: item.pauta.length,
}));

export default function RelatorioPautasPorVeiculo() {
  return (
    <div style={{ width: "100%", height: 400 }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>
        📊 Pautas por Veículo
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="pautas" fill="#3b82f6" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
