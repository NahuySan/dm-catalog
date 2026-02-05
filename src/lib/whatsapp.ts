import { CartItem } from '@/context/CartContext.tsx'; // Ajustá según tu export
import { getEffectiveUnitPrice, getItemSubtotal } from '@/lib/priceUtils';

export const formatWhatsAppMessage = (cart: CartItem[], isMobile: boolean) => {
  // Definimos los iconos solo si es mobile, si no, usamos caracteres estándar
  const iconRocket = isMobile ? "🚀" : "";
  const iconFinger = isMobile ? "☝️" : "";
  const iconBox    = isMobile ? "📦" : "";

  const lineas = cart.map(item => {
    const unitPrice = getEffectiveUnitPrice(item);
    let detalle = `• *${item.name.toUpperCase()}*\n`;
    
    if (item.qtyUnidad > 0) {
      detalle += `   - ${item.qtyUnidad} Unidad ${iconFinger} x $${unitPrice.toLocaleString('es-AR')} c/u\n`;
    }
    if (item.qtyMayor > 0) {
      detalle += `   - ${item.qtyMayor} Bultos ${iconBox} x $${(item.priceCantidad || 0).toLocaleString('es-AR')} c/u\n`;
    }
    
    detalle += `   _Subtotal: $${getItemSubtotal(item).toLocaleString('es-AR')}_`;
    return detalle;
  });

  const mensajeArray = [
    `${iconRocket} *NUEVO PEDIDO - DISTRIBUIDORA MAURI*`,
    "---------------------------------------",
    ...lineas,
    "---------------------------------------",
    `*TOTAL ESTIMADO: $${cart.reduce((acc, item) => acc + getItemSubtotal(item), 0).toLocaleString('es-AR')}*`,
    "\n¿Me confirmás stock y el total final?",
  ];

  return mensajeArray.join("\n");
};