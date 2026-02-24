"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { ordersApi } from "@/lib/api";
import { Order } from "@/types";
import { Card } from "@/components/atoms/Card";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/atoms/Button";
import { Package, Eye, CheckCircle, XCircle, Clock, Truck } from "lucide-react";
import Link from "next/link";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusIcons = {
  pending: Clock,
  processing: Package,
  paid: CheckCircle,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (filter !== "all") {
        filters.status = filter;
      }
      const data = await ordersApi.getAll(filters);
      setOrders(data as Order[]);
    } catch (error) {
      console.error("Error fetching orders:", error);
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

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await ordersApi.updateStatus(orderId, { status: status as any });
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Error al actualizar el estado de la orden");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <Heading level={1}>Órdenes</Heading>
          <div className="mt-4 sm:mt-0 flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              Todas
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("pending")}
            >
              Pendientes
            </Button>
            <Button
              variant={filter === "paid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("paid")}
            >
              Pagadas
            </Button>
          </div>
        </div>

        {orders.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <Heading level={2} className="mb-2">No hay órdenes</Heading>
            <Text className="text-gray-600">
              {filter === "all"
                ? "Aún no hay órdenes registradas"
                : `No hay órdenes con estado "${filter}"`}
            </Text>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const StatusIcon = statusIcons[order.status] || Package;
              return (
                <Card key={order.id} className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Heading level={3} className="text-lg">
                          {order.orderNumber}
                        </Heading>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusColors[order.status]}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {order.status}
                        </span>
                        {order.paymentStatus === "approved" && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            Pagado
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>
                          <Text className="font-medium">Cliente:</Text> {order.customerName}
                        </div>
                        <div>
                          <Text className="font-medium">Email:</Text> {order.customerEmail}
                        </div>
                        <div>
                          <Text className="font-medium">Total:</Text>{" "}
                          <span className="font-bold text-primary-600">
                            {formatPrice(order.total)}
                          </span>
                        </div>
                        <div>
                          <Text className="font-medium">Fecha:</Text> {formatDate(order.createdAt)}
                        </div>
                      </div>
                      {order.shippingAddress && (
                        <div className="mt-2 text-sm text-gray-600">
                          <Text className="font-medium">Dirección:</Text> {order.shippingAddress}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link href={`/dashboard/orders/${order.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Ver detalles
                        </Button>
                      </Link>
                      {order.status === "paid" && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, "processing")}
                        >
                          Marcar como procesando
                        </Button>
                      )}
                      {order.status === "processing" && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, "shipped")}
                        >
                          Marcar como enviado
                        </Button>
                      )}
                      {order.status === "shipped" && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, "delivered")}
                        >
                          Marcar como entregado
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
