"use client";

import { useEffect, useState } from "react";
import { productsApi, categoriesApi } from "@/lib/api";
import { ShoppingBag, Tag, TrendingUp, Package } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    featuredProducts: 0,
    totalStock: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [products, categories] = await Promise.all([
          productsApi.getAll(),
          categoriesApi.getAll(),
        ]);

        const productsList = products as any[];
        const featuredCount = productsList.filter((p: any) => p.isFeatured).length;
        const totalStock = productsList.reduce((sum: number, p: any) => sum + (p.stock || 0), 0);

        setStats({
          products: productsList.length,
          categories: (categories as any[]).length,
          featuredProducts: featuredCount,
          totalStock,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Productos",
      value: stats.products,
      icon: ShoppingBag,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Categorías",
      value: stats.categories,
      icon: Tag,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Destacados",
      value: stats.featuredProducts,
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Stock Total",
      value: stats.totalStock,
      icon: Package,
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-soft p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-soft p-6 hover:shadow-medium transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
