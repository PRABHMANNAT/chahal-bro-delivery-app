export type UserRole = 'customer' | 'admin' | 'delivery';
export type AddressType = 'home' | 'office' | 'other';
export type OrderStatus = 'placed' | 'confirmed' | 'packing' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentMethod = 'online' | 'cod';

export interface Address {
  id: string;
  label: string;
  type: AddressType;
  fullAddress: string;
  landmark?: string;
  city?: string;
  state?: string;
  pincode?: string;
  isDefault?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  accent?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  mrp?: number;
  imageUrl?: string;
  categoryId: string;
  category?: Category;
  unitLabel: string;
  inStock: boolean;
  stock: number;
  tags?: string[];
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  address: Address;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  totalAmount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  role: UserRole;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  addresses?: Address[];
}
