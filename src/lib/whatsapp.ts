import { CartItem } from '@/context/CartContext';
import { getEffectiveUnitPrice, getItemSubtotal } from '@/lib/priceUtils';

export const formatWhatsAppMessage = (cart: CartItem[], isMobile: boolean) => {
  // Iconos condicionales según dispositivo
  const iconRocket = isMobile ? "🚀" : "";
  const iconFinger = isMobile ? "☝️" : "";
  const iconBox    = isMobile ? "📦" : "";

  const lineas = cart.map(item => {
    const unitPrice = getEffectiveUnitPrice(item);
    
    // Lógica de pluralización
    const txtUnidad = item.qtyUnidad > 1 ? "Unidades" : "Unidad";
    const txtBulto  = item.qtyMayor > 1 ? "Bultos" : "Bulto";

    let detalle = `• *${item.name.toUpperCase()}*\n`;
    
    if (item.qtyUnidad > 0) {
      detalle += `   - ${item.qtyUnidad} ${txtUnidad} ${iconFinger} x $${unitPrice.toLocaleString('es-AR')} c/u\n`;
    }
    if (item.qtyMayor > 0) {
      detalle += `   - ${item.qtyMayor} ${txtBulto} ${iconBox} x $${(item.priceCantidad || 0).toLocaleString('es-AR')} c/u\n`;
    }
    
    detalle += `   _Subtotal: $${getItemSubtotal(item).toLocaleString('es-AR')}_`;
    return detalle;
  });

  const total = cart.reduce((acc, item) => acc + getItemSubtotal(item), 0);

  const mensajeArray = [
    `${iconRocket} *NUEVO PEDIDO - DISTRIBUIDORA MAURI*`,
    "---------------------------------------",
    ...lineas,
    "---------------------------------------",
    `*TOTAL ESTIMADO: $${total.toLocaleString('es-AR')}*`,
    "\n¿Me confirmás stock y el total final?",
  ];

  return mensajeArray.join("\n");
};