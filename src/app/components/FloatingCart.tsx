import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, X, Send, Trash2, Package, User } from 'lucide-react';

export const FloatingCart = () => {
  const { cart, totalItems, totalPrice, removeFromCart, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  if (totalItems === 0) return null;

  const handleWhatsAppSend = () => {
    const phoneNumber = "5493743411662"; // Número de Mauri
    
    // 1. FORMATEO DETALLADO DEL MENSAJE
    const lineas = cart.map(item => {
      let detalle = `• *${item.name.toUpperCase()}*\n`;
      if (item.qtyUnidad > 0) {
        detalle += `   - ${item.qtyUnidad} Un. ☝️​​ x $${item.priceUnidad.toLocaleString('es-AR')} c/u\n`;
      }
      if (item.qtyMayor > 0) {
        detalle += `   - ${item.qtyMayor} Bultos 📦​ x $${item.priceCantidad.toLocaleString('es-AR')} c/u\n`;
      }
      const subtotalItem = (item.qtyUnidad * item.priceUnidad) + (item.qtyMayor * item.priceCantidad);
      detalle += `   _Subtotal: $${subtotalItem.toLocaleString('es-AR')}_`;
      return detalle;
    });

    const mensaje = [
      "🚀 *NUEVO PEDIDO - DISTRIBUIDORA MAURI*",
      "---------------------------------------",
      ...lineas,
      "---------------------------------------",
      `*TOTAL ESTIMADO: $${totalPrice.toLocaleString('es-AR')}*`,
      "\n¿Me confirmás stock y el total final?",
    ].join("\n");

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      
      {/* VENTANA DE RESUMEN */}
      {isOpen && (
        <div className="bg-white border border-border shadow-2xl rounded-2xl w-80 sm:w-96 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-secondary p-4 flex justify-between items-center text-white">
            <h3 className="font-bold flex items-center gap-2 uppercase tracking-tighter">
              <ShoppingBag size={18} /> Mi Pedido
            </h3>
            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
              <X size={20} />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto p-4 space-y-4">
            {cart.map((item) => {
              const subtotalItem = (item.qtyUnidad * item.priceUnidad) + (item.qtyMayor * item.priceCantidad);
              
              return (
                <div key={item.id} className="border-b border-gray-100 pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[11px] font-black text-foreground uppercase leading-tight flex-1">
                      {item.name}
                    </p>
                    <span className="text-xs font-black text-secondary ml-2">
                      ${subtotalItem.toLocaleString('es-AR')}
                    </span>
                  </div>
                  
                  {/* Desglose de cantidades */}
                  <div className="flex flex-col gap-1 px-1">
                    {item.qtyUnidad > 0 && (
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground bg-gray-50 p-1 rounded">
                        <span className="flex items-center gap-1"><User size={10} /> {item.qtyUnidad} Unidades</span>
                        <button onClick={() => removeFromCart(item.id, 'unidad')} className="text-red-400 hover:text-red-600">Quitar</button>
                      </div>
                    )}
                    {item.qtyMayor > 0 && (
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground bg-gray-50 p-1 rounded">
                        <span className="flex items-center gap-1"><Package size={10} /> {item.qtyMayor} Bultos</span>
                        <button onClick={() => removeFromCart(item.id, 'mayor')} className="text-red-400 hover:text-red-600">Quitar</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* TOTAL Y ACCIONES */}
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-muted-foreground text-xs font-bold uppercase">Total estimado:</span>
              <span className="text-xl font-black text-secondary tracking-tighter">
                ${totalPrice.toLocaleString('es-AR')}
              </span>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={clearCart}
                className="flex-1 border border-red-200 text-red-500 py-3 rounded-xl font-bold text-[10px] uppercase hover:bg-red-50 transition-colors"
              >
                <Trash2 size={14} className="inline mr-1" /> Vaciar
              </button>
              <button 
                onClick={handleWhatsAppSend}
                className="flex-[2] bg-green-600 text-white py-3 rounded-xl font-bold text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-lg shadow-green-200 active:scale-95"
              >
                <Send size={14} /> Enviar Pedido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOTÓN FLOTANTE */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-secondary text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all relative group"
      >
        <ShoppingBag size={28} />
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
          {totalItems}
        </span>
        
        {!isOpen && (
          <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-secondary text-white text-[10px] font-bold py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-white/20">
            VER PEDIDO: ${totalPrice.toLocaleString()}
          </span>
        )}
      </button>
    </div>
  );
};