"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { productsApi, categoriesApi } from "@/lib/api";
import { Product, Category } from "@/types";
import { Card } from "@/components/atoms/Card";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/atoms/Button";
import { useNotification } from "@/contexts/NotificationContext";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const notification = useNotification();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productData, categoriesData] = await Promise.all([
          productsApi.getById(id),
          categoriesApi.getAll(),
        ]);
        setProduct(productData as Product);
        setCategories(categoriesData as Category[]);
      } catch (err: any) {
        console.error("Error fetching product:", err);
        setError("No se pudo cargar el producto. Es posible que no exista.");
        notification.showError("Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, notification]);

  const handleChange = (field: keyof Product, value: any) => {
    if (!product) return;
    setProduct({ ...product, [field]: value });
  };

  const handleSave = async () => {
    if (!product) return;
    setSaving(true);
    setError(null);
    try {
      await productsApi.update(product.id, {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        categoryId: product.categoryId,
        compatibleModel: product.compatibleModel,
        color: product.color,
        image: product.image,
      });
      notification.showSuccess(`Producto "${product.name}" actualizado exitosamente`);
      router.push("/dashboard/products");
    } catch (err: any) {
      console.error("Error updating product:", err);
      const errorMessage = err.message || "Error al guardar el producto";
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

  if (!product) {
    return (
      <div className="p-6">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => router.push("/dashboard/products")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a productos
        </Button>
        <Card className="p-6 flex items-center gap-3 text-red-600 bg-red-50 border border-red-200">
          <AlertCircle className="w-6 h-6" />
          <div>
            <Heading level={2} className="text-lg mb-1">Producto no encontrado</Heading>
            <Text className="text-sm text-red-700">
              No se encontró ningún producto con el ID proporcionado.
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
            onClick={() => router.push("/dashboard/products")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <Heading level={1} className="text-2xl font-bold text-gray-900">
            Editar producto
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
            value={product.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            value={product.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[80px]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio
            </label>
            <input
              type="number"
              value={product.price}
              onChange={(e) => handleChange("price", Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock
            </label>
            <input
              type="number"
              value={product.stock}
              onChange={(e) => handleChange("stock", Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              value={product.categoryId}
              onChange={(e) => handleChange("categoryId", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
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
              value={product.compatibleModel || ""}
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
              value={product.color || ""}
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
            value={product.image || ""}
            onChange={(e) => handleChange("image", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={product.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Activo</span>
          </label>

          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={product.isFeatured}
              onChange={(e) => handleChange("isFeatured", e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Destacado</span>
          </label>
        </div>
      </Card>
    </div>
  );
}

