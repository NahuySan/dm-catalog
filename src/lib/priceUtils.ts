import { Product } from '@/app/types';

/**
 * Determina el precio unitario real.
 * Si priceOferta no es null ni undefined y es mayor a 0, usa ese.
 */
export const getEffectiveUnitPrice = (item: Partial<Product>) => {
  // Usamos != null para chequear null y undefined al mismo tiempo
  return (item.priceOferta != null && item.priceOferta > 0) 
    ? item.priceOferta 
    : (item.priceUnidad || 0);
};

/**
 * Calcula el subtotal de un ítem contemplando unidades y bultos.
 */
export const getItemSubtotal = (item: { 
  qtyUnidad: number; 
  qtyMayor: number; 
  priceUnidad: number; 
  priceCantidad: number; 
  priceOferta?: number | null 
}) => {
  const unitPrice = getEffectiveUnitPrice(item);
  return (item.qtyUnidad * unitPrice) + (item.qtyMayor * (item.priceCantidad || 0));
};