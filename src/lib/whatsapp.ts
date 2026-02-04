import { CartItem } from '@/app/types';

export const formatWhatsAppMessage = (cart: CartItem[]) => {
  const lineas = cart.map(item => 
    `• ${item.quantity}x ${item.name} - $${(item.priceUnidad * item.quantity).toLocaleString('es-AR')}`
  );

  const total = cart.reduce((acc, item) => acc + (item.priceUnidad * item.quantity), 0);

  const mensaje = [
    "🚀 *Nuevo Pedido - Distribuidora Mauri*",
    "---------------------------------------",
    ...lineas,
    "---------------------------------------",
    `*TOTAL ESTIMADO: $${total.toLocaleString('es-AR')}*`,
    "\n¿Me confirmás stock y el total final?",
  ].join("\n");

  return encodeURIComponent(mensaje);
};