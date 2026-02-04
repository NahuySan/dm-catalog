import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/app/types'; // Chequeá que la ruta sea esta

// 1. Definimos el item del carrito con las dos cantidades
export interface CartItem extends Product {
  qtyUnidad: number;
  qtyMayor: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, type: 'unidad' | 'mayor') => void;
  removeFromCart: (productId: number, type: 'unidad' | 'mayor') => void;
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

      // Si el producto no estaba, lo agregamos con la cantidad inicial según el tipo
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
  const removeFromCart = (productId: number, type: 'unidad' | 'mayor') => {
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

      // Si ambas cantidades llegan a 0, volamos el producto del array
      return newCart.filter(item => item.qtyUnidad > 0 || item.qtyMayor > 0);
    });
  };

  const clearCart = () => setCart([]);

  // CÁLCULOS DINÁMICOS
  // Sumamos todas las unidades y todos los bultos
  const totalItems = cart.reduce((acc, item) => acc + item.qtyUnidad + item.qtyMayor, 0);

  // El precio total es la suma de (unidades * precioUnidad) + (bultos * precioCantidad)
  const totalPrice = cart.reduce((acc, item) => {
    const subtotalUnidad = item.qtyUnidad * (item.priceUnidad || 0);
    const subtotalMayor = item.qtyMayor * (item.priceCantidad || 0);
    // Nota: Si el item tiene priceOferta, podrías priorizarlo acá con una lógica extra
    return acc + subtotalUnidad + subtotalMayor;
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

// Hook para usar el carrito en cualquier componente
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};