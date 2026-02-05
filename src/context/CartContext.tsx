import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/app/types';
import { getItemSubtotal } from '@/lib/priceUtils'; // Importamos la utilidad centralizada

export interface CartItem extends Product {
  qtyUnidad: number;
  qtyMayor: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, type: 'unidad' | 'mayor') => void;
  removeFromCart: (productId: string | number, type: 'unidad' | 'mayor') => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Función para SUMAR productos (diferenciando tipo)
  const addToCart = (product: Product, type: 'unidad' | 'mayor') => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);

      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? {
                ...item,
                qtyUnidad: type === 'unidad' ? item.qtyUnidad + 1 : item.qtyUnidad,
                qtyMayor: type === 'mayor' ? item.qtyMayor + 1 : item.qtyMayor,
              }
            : item
        );
      }

      return [
        ...prevCart,
        {
          ...product,
          qtyUnidad: type === 'unidad' ? 1 : 0,
          qtyMayor: type === 'mayor' ? 1 : 0,
        },
      ];
    });
  };

  // Función para RESTAR productos
  const removeFromCart = (productId: string | number, type: 'unidad' | 'mayor') => {
    setCart(prevCart => {
      const newCart = prevCart.map(item => {
        if (item.id === productId) {
          return {
            ...item,
            qtyUnidad: type === 'unidad' ? Math.max(0, item.qtyUnidad - 1) : item.qtyUnidad,
            qtyMayor: type === 'mayor' ? Math.max(0, item.qtyMayor - 1) : item.qtyMayor,
          };
        }
        return item;
      });

      return newCart.filter(item => item.qtyUnidad > 0 || item.qtyMayor > 0);
    });
  };

  const clearCart = () => setCart([]);

  // CÁLCULOS DINÁMICOS
  const totalItems = cart.reduce((acc, item) => acc + item.qtyUnidad + item.qtyMayor, 0);

  // PRECIO TOTAL: Delegamos la cuenta a la utilidad de precios
  const totalPrice = cart.reduce((acc, item) => {
    return acc + getItemSubtotal(item);
  }, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      totalItems, 
      totalPrice 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};