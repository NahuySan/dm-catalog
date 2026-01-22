// src/app/types.ts
export type Category = 'Todas' | 'Ofertas' | 'Comestibles' | 'Bebidas' | 'Higiene' | 'Limpieza' | 'Medicamentos' | 'Otros';

export interface Product {
  id: number;
  name: string;
  priceUnidad: number;
  priceCantidad: number;
  priceOferta?: number | null;
  description: string;
  image: string;
  category: string;
  stock: number;
}