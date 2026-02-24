"use client";

import { useEffect, useState } from "react";
import { categoriesApi } from "@/lib/api";
import { Category } from "@/types";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import Link from "next/link";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.getAll();
        setCategories(data as Category[]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;
    
    try {
      await categoriesApi.delete(id);
      setCategories(categories.filter(c => c.id !== id));
    } catch (error) {
      alert('Error al eliminar la categoría');
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
        <Link
          href="/dashboard/categories/new"
          className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all shadow-medium"
        >
          <Plus className="w-5 h-5" />
          Nueva Categoría
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-soft p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar categorías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-soft p-6">
          <p className="text-gray-600">Cargando categorías...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-xl shadow-soft p-6 hover:shadow-medium transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-gray-600">{category.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/categories/${category.id}`}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  category.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {category.isActive ? 'Activa' : 'Inactiva'}
                </span>
                <span className="text-sm text-gray-500">Orden: {category.order}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredCategories.length === 0 && (
        <div className="bg-white rounded-xl shadow-soft p-6 text-center text-gray-500">
          No se encontraron categorías
        </div>
      )}
    </div>
  );
}
