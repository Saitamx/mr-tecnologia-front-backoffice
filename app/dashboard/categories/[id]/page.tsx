"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { categoriesApi } from "@/lib/api";
import { Category } from "@/types";
import { Card } from "@/components/atoms/Card";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/atoms/Button";
import { useNotification } from "@/contexts/NotificationContext";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const notification = useNotification();
  const id = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoryData = await categoriesApi.getById(id);
        setCategory(categoryData as Category);
      } catch (err: any) {
        console.error("Error fetching category:", err);
        setError("No se pudo cargar la categoría. Es posible que no exista.");
        notification.showError("Error al cargar la categoría");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, notification]);

  const handleChange = (field: keyof Category, value: any) => {
    if (!category) return;
    setCategory({ ...category, [field]: value });
  };

  const handleSave = async () => {
    if (!category) return;
    setSaving(true);
    setError(null);
    try {
      await categoriesApi.update(category.id, {
        name: category.name,
        description: category.description,
        order: category.order,
        isActive: category.isActive,
      });
      notification.showSuccess(`Categoría "${category.name}" actualizada exitosamente`);
      router.push("/dashboard/categories");
    } catch (err: any) {
      console.error("Error updating category:", err);
      const errorMessage = err.message || "Error al guardar la categoría";
      setError(errorMessage);
      notification.showError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="p-6">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => router.push("/dashboard/categories")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a categorías
        </Button>
        <Card className="p-6 flex items-center gap-3 text-red-600 bg-red-50 border border-red-200">
          <AlertCircle className="w-6 h-6" />
          <div>
            <Heading level={2} className="text-lg mb-1">Categoría no encontrada</Heading>
            <Text className="text-sm text-red-700">
              No se encontró ninguna categoría con el ID proporcionado.
            </Text>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/categories")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <Heading level={1} className="text-2xl font-bold text-gray-900">
            Editar categoría
          </Heading>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>

      {error && (
        <Card className="p-4 mb-4 border border-red-200 bg-red-50 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <Text className="text-sm text-red-700">{error}</Text>
        </Card>
      )}

      <Card className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            type="text"
            value={category.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            value={category.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[80px]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Orden
            </label>
            <input
              type="number"
              value={category.order}
              onChange={(e) => handleChange("order", Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={category.isActive ? "active" : "inactive"}
              onChange={(e) => handleChange("isActive", e.target.value === "active")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="active">Activa</option>
              <option value="inactive">Inactiva</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  );
}
