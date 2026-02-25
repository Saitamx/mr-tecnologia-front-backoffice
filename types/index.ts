export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  slug: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  categoryId: string;
  category?: Category;
  compatibleModel?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order: number;
  isActive: boolean;
  products?: Product[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}

export type ShippingType = 'chilexpress' | 'correos_chile' | 'starken' | 'motocicleta' | 'retiro_tienda';

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customer?: Customer;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress?: string;
  shippingType?: ShippingType;
  trackingNumber?: string;
  subtotal: number;
  discount: number;
  total: number;
  status: 'pending' | 'processing' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'webpay' | 'transfer' | 'cash';
  paymentStatus: 'pending' | 'approved' | 'rejected' | 'cancelled';
  webpayToken?: string;
  webpayTransactionId?: string;
  notes?: string;
  items?: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  region?: string;
  isActive: boolean;
  lastLogin?: string;
  orders?: Order[];
  createdAt: string;
  updatedAt: string;
}
