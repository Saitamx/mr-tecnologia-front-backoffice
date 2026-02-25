"use client";

import { useEffect, useState } from "react";
import { customersApi } from "@/lib/api";
import { Customer } from "@/types";
import { Card } from "@/components/atoms/Card";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/atoms/Button";
import { Users, Search, Filter, Eye, UserCheck, UserX, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { useNotification } from "@/contexts/NotificationContext";

export default function CustomersPage() {
  const notification = useNotification();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    isActive: "all" as "all" | "true" | "false",
    city: "",
    region: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, [filters, search]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (search) params.search = search;
      if (filters.isActive !== "all") params.isActive = filters.isActive === "true";
      if (filters.city) params.city = filters.city;
      if (filters.region) params.region = filters.region;
      
      const data = await customersApi.getAll(params);
      setCustomers(data as Customer[]);
    } catch (error) {
      console.error("Error fetching customers:", error);
      notification.showError("Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-CL", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await customersApi.updateStatus(id, !currentStatus);
      notification.showSuccess(`Cliente ${!currentStatus ? "activado" : "desactivado"} exitosamente`);
      fetchCustomers();
    } catch (error) {
      notification.showError("Error al actualizar el estado del cliente");
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
        <Heading level={1}>Clientes</Heading>
      </div>

      {/* Filtros y búsqueda */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o teléfono..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <select
              value={filters.isActive}
              onChange={(e) => setFilters({ ...filters, isActive: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              placeholder="Ciudad"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </Card>

      {customers.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <Heading level={2} className="mb-2">No hay clientes</Heading>
          <Text className="text-gray-600">
            {search || filters.isActive !== "all" || filters.city
              ? "No se encontraron clientes con los filtros aplicados"
              : "Aún no hay clientes registrados"}
          </Text>
        </Card>
      ) : (
        <div className="space-y-4">
          {customers.map((customer) => (
            <Card key={customer.id} className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Heading level={3} className="text-lg">
                      {customer.fullName}
                    </Heading>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                        customer.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {customer.isActive ? (
                        <>
                          <UserCheck className="w-3 h-3" />
                          Activo
                        </>
                      ) : (
                        <>
                          <UserX className="w-3 h-3" />
                          Inactivo
                        </>
                      )}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <Text>{customer.email}</Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <Text>{customer.phone}</Text>
                    </div>
                    {customer.city && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <Text>
                          {customer.city}
                          {customer.region && `, ${customer.region}`}
                        </Text>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    <Text>
                      Registrado: {formatDate(customer.createdAt)}
                      {customer.lastLogin && ` • Último acceso: ${formatDate(customer.lastLogin)}`}
                      {customer.orders && ` • ${customer.orders.length} orden(es)`}
                    </Text>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Link href={`/dashboard/customers/${customer.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver detalles
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant={customer.isActive ? "secondary" : "default"}
                    onClick={() => toggleStatus(customer.id, customer.isActive)}
                  >
                    {customer.isActive ? (
                      <>
                        <UserX className="w-4 h-4 mr-2" />
                        Desactivar
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4 mr-2" />
                        Activar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
