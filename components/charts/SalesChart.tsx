"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface SalesData {
  date: string;
  total: number;
  count: number;
}

interface SalesChartProps {
  data: SalesData[];
}

export function SalesChart({ data }: SalesChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-CL", {
      month: "short",
      day: "numeric",
    });
  };

  const labelFormatter = (label: any) => {
    if (typeof label === 'string') {
      return formatDate(label);
    }
    return label;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          style={{ fontSize: "12px" }}
        />
        <YAxis
          yAxisId="left"
          tickFormatter={formatCurrency}
          style={{ fontSize: "12px" }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          style={{ fontSize: "12px" }}
        />
        <Tooltip
          formatter={(value: any, name?: string) => {
            if (name === "Ventas") {
              return formatCurrency(value);
            }
            return value;
          }}
          labelFormatter={labelFormatter}
        />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="total"
          stroke="#3b82f6"
          strokeWidth={2}
          name="Ventas"
          dot={{ r: 4 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="count"
          stroke="#10b981"
          strokeWidth={2}
          name="Órdenes"
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
