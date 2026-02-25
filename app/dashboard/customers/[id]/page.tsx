"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { customersApi, ordersApi } from "@/lib/api";
import { Customer, Order } from "@/types";
import { Card } from "@/components/atoms/Card";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/atoms/Button";
import { ArrowLeft, User, Mail, Phone, MapPin, Package, Calendar } from "lucide-react";
import Link from "next/link";

export default function CustomerDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [customerData, ordersData] = await Promise.allSettled([
        customersApi.getById(id),
        ordersApi.getAll({ customerId: id }),
      ]);
      
      if (customerData.status === 'fulfilled') {
        setCustomer(customerData.value as Customer);
      } else {
        console.error("Error fetching customer:", customerData.reason);
        setCustomer(null);
      }
      
      if (ordersData.status === 'fulfilled') {
        setOrders(ordersData.value as Order[]);
      } else {
        console.error("Error fetching orders:", ordersData.reason);
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setCustomer(null);
      setOrders([]);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <Heading level={2}>Cliente no encontrado</Heading>
        <Link href="/dashboard/customers">
          <Button className="mt-4">Volver a clientes</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Link href="/dashboard/customers">
        <Button variant="ghost" size="sm" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a clientes
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Información del cliente */}
        <Card className="p-6">
          <Heading level={2} className="mb-4 text-lg">Información del cliente</Heading>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <Text className="text-sm text-gray-600">Nombre completo</Text>
                <Text className="font-semibold">{customer.fullName}</Text>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <Text className="text-sm text-gray-600">Email</Text>
                <Text className="font-semibold">{customer.email}</Text>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <Text className="text-sm text-gray-600">Teléfono</Text>
                <Text className="font-semibold">{customer.phone}</Text>
              </div>
            </div>
            {customer.address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <Text className="text-sm text-gray-600">Dirección</Text>
                  <Text className="font-semibold">{customer.address}</Text>
                  {(customer.city || customer.region) && (
                    <Text className="text-sm text-gray-600">
                      {customer.city}
                      {customer.city && customer.region && ", "}
                      {customer.region}
                    </Text>
                  )}
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <Text className="text-sm text-gray-600">Registrado</Text>
                <Text className="font-semibold">{formatDate(customer.createdAt)}</Text>
              </div>
            </div>
            {customer.lastLogin && (
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <Text className="text-sm text-gray-600">Último acceso</Text>
                  <Text className="font-semibold">{formatDate(customer.lastLogin)}</Text>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Estadísticas */}
        <Card className="p-6">
          <Heading level={2} className="mb-4 text-lg">Estadísticas</Heading>
          <div className="space-y-4">
            <div>
              <Text className="text-sm text-gray-600">Total de órdenes</Text>
              <Text className="text-2xl font-bold text-primary-600">{orders.length}</Text>
            </div>
            <div>
              <Text className="text-sm text-gray-600">Total gastado</Text>
              <Text className="text-2xl font-bold text-primary-600">
                {formatPrice(orders.reduce((sum, order) => sum + order.total, 0))}
              </Text>
            </div>
            <div>
              <Text className="text-sm text-gray-600">Estado</Text>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  customer.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {customer.isActive ? "Activo" : "Inactivo"}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Órdenes del cliente */}
      <Card className="p-6">
        <Heading level={2} className="mb-4 text-lg">Órdenes del cliente</Heading>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <Text className="text-gray-600">Este cliente no tiene órdenes</Text>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Número</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Total</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Estado</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <Text className="font-semibold">{order.orderNumber}</Text>
                    </td>
                    <td className="py-3 px-4">
                      <Text className="text-sm">{formatDate(order.createdAt)}</Text>
                    </td>
                    <td className="text-right py-3 px-4">
                      <Text className="font-semibold">{formatPrice(order.total)}</Text>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Link href={`/dashboard/orders/${order.id}`}>
                        <Button variant="ghost" size="sm">Ver</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
