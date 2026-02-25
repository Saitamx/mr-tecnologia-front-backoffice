"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ordersApi } from "@/lib/api";
import { Order } from "@/types";
import { Card } from "@/components/atoms/Card";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/atoms/Button";
import { ArrowLeft, Package, CheckCircle, XCircle, Clock, Truck, User, Mail, Phone, MapPin, PackageSearch } from "lucide-react";
import Link from "next/link";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await ordersApi.getById(id);
      setOrder(data as Order);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-CL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const updateOrderStatus = async (status: string) => {
    try {
      await ordersApi.updateStatus(id, { status: status as any });
      fetchOrder();
    } catch (error) {
      console.error("Error updating order:", error);
      // Error será manejado por el sistema de notificaciones si se implementa
      console.error("Error al actualizar el estado de la orden");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <Heading level={2}>Orden no encontrada</Heading>
        <Link href="/dashboard/orders">
          <Button className="mt-4">Volver a órdenes</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="p-6">
        <Link href="/dashboard/orders">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a órdenes
          </Button>
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <Heading level={1} className="mb-2">{order.orderNumber}</Heading>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}
              >
                {order.status}
              </span>
              {order.paymentStatus === "approved" && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                  Pagado
                </span>
              )}
            </div>
          </div>
          <div className="mt-4 lg:mt-0 flex gap-2">
            {order.status === "paid" && (
              <Button onClick={() => updateOrderStatus("processing")}>
                Marcar como procesando
              </Button>
            )}
            {order.status === "processing" && (
              <Button onClick={() => updateOrderStatus("shipped")}>
                Marcar como enviado
              </Button>
            )}
            {order.status === "shipped" && (
              <Button onClick={() => updateOrderStatus("delivered")}>
                Marcar como entregado
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información del cliente */}
          <Card className="p-6">
            <Heading level={2} className="mb-4 text-lg">Información del cliente</Heading>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <Text className="text-sm text-gray-600">Nombre</Text>
                  <Text className="font-semibold">{order.customerName}</Text>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <Text className="text-sm text-gray-600">Email</Text>
                  <Text className="font-semibold">{order.customerEmail}</Text>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <Text className="text-sm text-gray-600">Teléfono</Text>
                  <Text className="font-semibold">{order.customerPhone}</Text>
                </div>
              </div>
              {order.shippingAddress && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <Text className="text-sm text-gray-600">Dirección</Text>
                    <Text className="font-semibold">{order.shippingAddress}</Text>
                  </div>
                </div>
              )}
              {order.shippingType && (
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <Text className="text-sm text-gray-600">Tipo de envío</Text>
                    <Text className="font-semibold">
                      {order.shippingType === 'chilexpress' && 'Chilexpress'}
                      {order.shippingType === 'correos_chile' && 'Correos de Chile'}
                      {order.shippingType === 'starken' && 'Starken'}
                      {order.shippingType === 'motocicleta' && 'Envío en Motocicleta'}
                      {order.shippingType === 'retiro_tienda' && 'Retiro en Tienda'}
                    </Text>
                  </div>
                </div>
              )}
              {order.trackingNumber && (
                <div className="flex items-start gap-3">
                  <PackageSearch className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <Text className="text-sm text-gray-600">Número de seguimiento</Text>
                    <Text className="font-semibold font-mono">{order.trackingNumber}</Text>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Resumen de pago */}
          <Card className="p-6">
            <Heading level={2} className="mb-4 text-lg">Resumen de pago</Heading>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Text className="text-gray-600">Subtotal</Text>
                <Text className="font-semibold">{formatPrice(order.subtotal)}</Text>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <Text className="text-gray-600">Descuento</Text>
                  <Text className="font-semibold text-red-600">-{formatPrice(order.discount)}</Text>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <Text className="font-bold text-lg">Total</Text>
                  <Text className="font-bold text-lg text-primary-600">{formatPrice(order.total)}</Text>
                </div>
              </div>
              <div className="pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <Text className="text-gray-600">Método de pago</Text>
                  <Text className="font-semibold">{order.paymentMethod}</Text>
                </div>
                {order.webpayTransactionId && (
                  <div className="flex justify-between">
                    <Text className="text-gray-600">ID Transacción</Text>
                    <Text className="font-semibold">{order.webpayTransactionId}</Text>
                  </div>
                )}
                <div className="flex justify-between">
                  <Text className="text-gray-600">Fecha</Text>
                  <Text className="font-semibold">{formatDate(order.createdAt)}</Text>
                </div>
              </div>
            </div>
          </Card>

          {/* Información adicional */}
          <Card className="p-6">
            <Heading level={2} className="mb-4 text-lg">Información adicional</Heading>
            <div className="space-y-3 text-sm">
              {order.notes && (
                <div>
                  <Text className="text-gray-600 mb-1">Notas</Text>
                  <Text>{order.notes}</Text>
                </div>
              )}
              <div>
                <Text className="text-gray-600 mb-1">Creada</Text>
                <Text>{formatDate(order.createdAt)}</Text>
              </div>
              <div>
                <Text className="text-gray-600 mb-1">Actualizada</Text>
                <Text>{formatDate(order.updatedAt)}</Text>
              </div>
            </div>
          </Card>
        </div>

        {/* Items de la orden */}
        <Card className="p-6 mt-6">
          <Heading level={2} className="mb-4 text-lg">Productos</Heading>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Producto</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Cantidad</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Precio unitario</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div>
                        <Text className="font-semibold">{item.productName}</Text>
                        {item.product && (
                          <Text className="text-sm text-gray-600">{item.product.name}</Text>
                        )}
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Text>{item.quantity}</Text>
                    </td>
                    <td className="text-right py-3 px-4">
                      <Text>{formatPrice(item.unitPrice)}</Text>
                    </td>
                    <td className="text-right py-3 px-4">
                      <Text className="font-semibold">{formatPrice(item.subtotal)}</Text>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
