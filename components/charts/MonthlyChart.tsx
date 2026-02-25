"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface MonthlyData {
  month: string;
  count?: number;
  revenue?: number;
}

interface MonthlyChartProps {
  data: MonthlyData[];
  type: "orders" | "customers";
}

export function MonthlyChart({ data, type }: MonthlyChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split("-");
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString("es-CL", { month: "short", year: "numeric" });
  };

  const chartData = data.map((item) => ({
    month: formatMonth(item.month),
    ...(type === "orders" 
      ? { 
          "Órdenes": item.count || 0,
          "Ingresos": item.revenue || 0,
        }
      : {
          "Clientes": item.count || 0,
        }
    ),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          style={{ fontSize: "12px" }}
        />
        <YAxis
          yAxisId="left"
          style={{ fontSize: "12px" }}
        />
        {type === "orders" && (
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={formatCurrency}
            style={{ fontSize: "12px" }}
          />
        )}
        <Tooltip
          formatter={(value: any, name: string) => {
            if (name === "Ingresos") {
              return formatCurrency(value);
            }
            return value;
          }}
        />
        <Legend />
        {type === "orders" ? (
          <>
            <Bar
              yAxisId="left"
              dataKey="Órdenes"
              fill="#3b82f6"
            />
            <Bar
              yAxisId="right"
              dataKey="Ingresos"
              fill="#10b981"
            />
          </>
        ) : (
          <Bar
            yAxisId="left"
            dataKey="Clientes"
            fill="#8b5cf6"
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}
