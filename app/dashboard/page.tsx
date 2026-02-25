"use client";

import { useEffect, useState } from "react";
import { statsApi } from "@/lib/api";
import { 
  ShoppingBag, 
  Tag, 
  TrendingUp, 
  Package, 
  Users, 
  DollarSign,
  ShoppingCart,
  BarChart3
} from "lucide-react";
import { Card } from "@/components/atoms/Card";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { SalesChart } from "@/components/charts/SalesChart";
import { OrdersByStatusChart } from "@/components/charts/OrdersByStatusChart";
import { TopProductsChart } from "@/components/charts/TopProductsChart";
import { MonthlyChart } from "@/components/charts/MonthlyChart";

interface DashboardStats {
  overview: {
    totalProducts: number;
    activeProducts: number;
    totalCategories: number;
    totalCustomers: number;
    activeCustomers: number;
    totalOrders: number;
    totalSales: number;
    salesLastMonth: number;
    salesCurrentMonth: number;
    totalStock: number;
  };
  ordersByStatus: Array<{ status: string; count: number }>;
  ordersByPaymentStatus: Array<{ paymentStatus: string; count: number }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [ordersByMonth, setOrdersByMonth] = useState<any[]>([]);
  const [customersByMonth, setCustomersByMonth] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [
          dashboardStats,
          sales,
          topProductsData,
          ordersMonthly,
          customersMonthly,
        ] = await Promise.all([
          statsApi.getDashboardStats(),
          statsApi.getSalesByPeriod(30),
          statsApi.getTopProducts(10),
          statsApi.getOrdersByMonth(6),
          statsApi.getCustomersByMonth(6),
        ]);

        setStats(dashboardStats as DashboardStats);
        setSalesData(sales as any[]);
        setTopProducts(topProductsData as any[]);
        setOrdersByMonth(ordersMonthly as any[]);
        setCustomersByMonth(customersMonthly as any[]);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const statCards = stats ? [
    {
      title: "Productos",
      value: stats.overview.totalProducts,
      subtitle: `${stats.overview.activeProducts} activos`,
      icon: ShoppingBag,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Ventas Totales",
      value: formatCurrency(stats.overview.totalSales),
      subtitle: `${formatCurrency(stats.overview.salesCurrentMonth)} este mes`,
      icon: DollarSign,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Órdenes",
      value: stats.overview.totalOrders,
      subtitle: `${stats.ordersByStatus.find(s => s.status === 'paid')?.count || 0} pagadas`,
      icon: ShoppingCart,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Clientes",
      value: stats.overview.totalCustomers,
      subtitle: `${stats.overview.activeCustomers} activos`,
      icon: Users,
      color: "from-orange-500 to-orange-600",
    },
  ] : [];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Heading level={1} className="text-3xl font-bold text-gray-900">
          Dashboard
        </Heading>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BarChart3 className="w-5 h-5" />
          <Text>Resumen General</Text>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-shadow border-0"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <Text className="text-sm font-medium text-gray-600 mb-1">
                {stat.title}
              </Text>
              <Heading level={2} className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </Heading>
              <Text className="text-xs text-gray-500">
                {stat.subtitle}
              </Text>
            </Card>
          );
        })}
      </div>

      {/* Gráficas principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas por período */}
        <Card className="p-6">
          <Heading level={2} className="text-xl font-bold text-gray-900 mb-4">
            Ventas Últimos 30 Días
          </Heading>
          {salesData.length > 0 ? (
            <SalesChart data={salesData} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              <Text>No hay datos de ventas disponibles</Text>
            </div>
          )}
        </Card>

        {/* Órdenes por estado */}
        <Card className="p-6">
          <Heading level={2} className="text-xl font-bold text-gray-900 mb-4">
            Órdenes por Estado
          </Heading>
          {stats && stats.ordersByStatus.length > 0 ? (
            <OrdersByStatusChart data={stats.ordersByStatus} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              <Text>No hay datos disponibles</Text>
            </div>
          )}
        </Card>
      </div>

      {/* Gráficas secundarias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productos más vendidos */}
        <Card className="p-6">
          <Heading level={2} className="text-xl font-bold text-gray-900 mb-4">
            Productos Más Vendidos
          </Heading>
          {topProducts.length > 0 ? (
            <TopProductsChart data={topProducts} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              <Text>No hay datos de productos disponibles</Text>
            </div>
          )}
        </Card>

        {/* Órdenes por mes */}
        <Card className="p-6">
          <Heading level={2} className="text-xl font-bold text-gray-900 mb-4">
            Órdenes por Mes (Últimos 6 Meses)
          </Heading>
          {ordersByMonth.length > 0 ? (
            <MonthlyChart data={ordersByMonth} type="orders" />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              <Text>No hay datos disponibles</Text>
            </div>
          )}
        </Card>
      </div>

      {/* Clientes por mes */}
      <Card className="p-6">
        <Heading level={2} className="text-xl font-bold text-gray-900 mb-4">
          Nuevos Clientes por Mes (Últimos 6 Meses)
        </Heading>
        {customersByMonth.length > 0 ? (
          <MonthlyChart data={customersByMonth} type="customers" />
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            <Text>No hay datos disponibles</Text>
          </div>
        )}
      </Card>
    </div>
  );
}
