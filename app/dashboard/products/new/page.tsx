"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { productsApi, categoriesApi } from "@/lib/api";
import { Product, Category } from "@/types";
import { Card } from "@/components/atoms/Card";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/atoms/Button";
import { useNotification } from "@/contexts/NotificationContext";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const notification = useNotification();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    isActive: true,
    isFeatured: false,
    categoryId: "",
    compatibleModel: "",
    color: "",
    image: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await categoriesApi.getAll();
        setCategories(categoriesData as Category[]);
        if (categoriesData.length > 0) {
          setFormData((prev) => ({
            ...prev,
            categoryId: categoriesData[0].id,
          }));
        }
      } catch (err: any) {
        console.error("Error fetching categories:", err);
        notification.showError("Error al cargar las categorías");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (field: keyof Product, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (!formData.name || !formData.categoryId) {
      setError("El nombre y la categoría son obligatorios");
      notification.showError("Por favor completa todos los campos obligatorios");
      setSaving(false);
      return;
    }

    try {
      await productsApi.create({
        name: formData.name!,
        description: formData.description || "",
        price: formData.price || 0,
        stock: formData.stock || 0,
        isActive: formData.isActive ?? true,
        isFeatured: formData.isFeatured ?? false,
        categoryId: formData.categoryId,
        compatibleModel: formData.compatibleModel || "",
        color: formData.color || "",
        image: formData.image || "",
      });
      notification.showSuccess(`Producto "${formData.name}" creado exitosamente`);
      router.push("/dashboard/products");
    } catch (err: any) {
      console.error("Error creating product:", err);
      const errorMessage = err.message || "Error al crear el producto";
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

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/products")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <Heading level={1} className="text-2xl font-bold text-gray-900">
            Nuevo producto
          </Heading>
        </div>
        <Button onClick={handleSubmit} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Creando..." : "Crear producto"}
        </Button>
      </div>

      {error && (
        <Card className="p-4 mb-4 border border-red-200 bg-red-50 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <Text className="text-sm text-red-700">{error}</Text>
        </Card>
      )}

      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleChange("price", Number(e.target.value))}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => handleChange("stock", Number(e.target.value))}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => handleChange("categoryId", e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modelo compatible
              </label>
              <input
                type="text"
                value={formData.compatibleModel || ""}
                onChange={(e) => handleChange("compatibleModel", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <input
                type="text"
                value={formData.color || ""}
                onChange={(e) => handleChange("color", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL de imagen
            </label>
            <input
              type="text"
              value={formData.image || ""}
              onChange={(e) => handleChange("image", e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive ?? true}
                onChange={(e) => handleChange("isActive", e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Activo</span>
            </label>

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isFeatured ?? false}
                onChange={(e) => handleChange("isFeatured", e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Destacado</span>
            </label>
          </div>
        </Card>
      </form>
    </div>
  );
}
