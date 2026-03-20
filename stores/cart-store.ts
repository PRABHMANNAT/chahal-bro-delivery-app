'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '../types';

export type CartStore = {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

function calculateTotals(items: CartItem[]) {
  return {
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    totalAmount: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  };
}

function createCartItem(product: Product, quantity: number): CartItem {
  return {
    productId: product.id,
    product,
    quantity,
    price: product.price,
    total: product.price * quantity,
  };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      totalItems: 0,
      totalAmount: 0,
      addItem: (product, quantity = 1) =>
        set((state) => {
          const nextQuantity = Math.max(1, Math.floor(quantity));
          const existing = state.items.find((item) => item.productId === product.id);
          const nextItems = existing
            ? state.items.map((item) =>
                item.productId === product.id
                  ? {
                      ...item,
                      quantity: item.quantity + nextQuantity,
                      price: product.price,
                      total: product.price * (item.quantity + nextQuantity),
                      product,
                    }
                  : item,
              )
            : [...state.items, createCartItem(product, nextQuantity)];

          return {
            items: nextItems,
            ...calculateTotals(nextItems),
          };
        }),
      removeItem: (productId) =>
        set((state) => {
          const nextItems = state.items.filter((item) => item.productId !== productId);

          return {
            items: nextItems,
            ...calculateTotals(nextItems),
          };
        }),
      updateQuantity: (productId, quantity) =>
        set((state) => {
          const nextQuantity = Math.floor(quantity);
          const nextItems =
            nextQuantity <= 0
              ? state.items.filter((item) => item.productId !== productId)
              : state.items.map((item) =>
                  item.productId === productId
                    ? {
                        ...item,
                        quantity: nextQuantity,
                        total: item.price * nextQuantity,
                      }
                    : item,
                );

          return {
            items: nextItems,
            ...calculateTotals(nextItems),
          };
        }),
      clearCart: () => ({
        items: [],
        totalItems: 0,
        totalAmount: 0,
      }),
    }),
    {
      name: 'chahalbros-cart',
    },
  ),
);
