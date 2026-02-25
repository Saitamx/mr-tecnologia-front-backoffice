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

interface ProductData {
  productId: string;
  productName: string;
  totalQuantity: number;
  totalRevenue: number;
}

interface TopProductsChartProps {
  data: ProductData[];
}

export function TopProductsChart({ data }: TopProductsChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const chartData = data.map((item) => ({
    name: item.productName.length > 20 
      ? item.productName.substring(0, 20) + "..." 
      : item.productName,
    cantidad: item.totalQuantity,
    ingresos: item.totalRevenue,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          height={100}
          style={{ fontSize: "12px" }}
        />
        <YAxis
          yAxisId="left"
          style={{ fontSize: "12px" }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tickFormatter={formatCurrency}
          style={{ fontSize: "12px" }}
        />
        <Tooltip
          formatter={(value: any, name?: string) => {
            if (name === "Ingresos") {
              return formatCurrency(value);
            }
            return value;
          }}
        />
        <Legend />
        <Bar
          yAxisId="left"
          dataKey="cantidad"
          fill="#3b82f6"
          name="Cantidad Vendida"
        />
        <Bar
          yAxisId="right"
          dataKey="ingresos"
          fill="#10b981"
          name="Ingresos"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
