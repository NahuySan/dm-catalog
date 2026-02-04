import { Package, CheckCircle2, AlertCircle, Plus, Minus, User } from 'lucide-react';
import { Product, Category } from '../types';
import { useCart } from '@/context/CartContext';

// --- MAPEO DE COLORES PASTEL ---
const categoryStyles: Record<Exclude<Category, 'Todas'>, { 
  primary: string, badge: string, border: string, lightBg: string, icon: string 
}> = {
  Ofertas: { primary: 'text-[#FCA5A5]', badge: 'bg-[#FCA5A5]', border: 'border-[#FCA5A5]/40', lightBg: 'bg-[#FCA5A5]/10', icon: 'bg-[#FCA5A5]' },
  Comestibles: { primary: 'text-[#FDBA74]', badge: 'bg-[#FDBA74]', border: 'border-[#FDBA74]/40', lightBg: 'bg-[#FDBA74]/10', icon: 'bg-[#FDBA74]' },
  Bebidas: { primary: 'text-[#93C5FD]', badge: 'bg-[#93C5FD]', border: 'border-[#93C5FD]/40', lightBg: 'bg-[#93C5FD]/10', icon: 'bg-[#93C5FD]' },
  Higiene: { primary: 'text-[#5EEAD4]', badge: 'bg-[#5EEAD4]', border: 'border-[#5EEAD4]/40', lightBg: 'bg-[#5EEAD4]/10', icon: 'bg-[#5EEAD4]' },
  Limpieza: { primary: 'text-[#D8B4FE]', badge: 'bg-[#D8B4FE]', border: 'border-[#D8B4FE]/40', lightBg: 'bg-[#D8B4FE]/10', icon: 'bg-[#D8B4FE]' },
  Medicamentos: { primary: 'text-[#FCA5A5]', badge: 'bg-[#FCA5A5]', border: 'border-[#FCA5A5]/40', lightBg: 'bg-[#FCA5A5]/10', icon: 'bg-[#FCA5A5]' },
  Otros: { primary: 'text-[#CBD5A0]', badge: 'bg-[#CBD5A0]', border: 'border-[#CBD5A0]/40', lightBg: 'bg-[#CBD5A0]/10', icon: 'bg-[#CBD5A0]' },
};

export function ProductCard({ product }: { product: Product }) {
  const { cart, addToCart, removeFromCart } = useCart();
  
  const itemInCart = cart.find(item => item.id === product.id);
  const qtyU = itemInCart?.qtyUnidad || 0;
  const qtyM = itemInCart?.qtyMayor || 0;

  const isOffer = product.priceOferta && product.priceOferta > 0;
  const hasStock = product.stock > 0;
  const localPlaceholder = "/assets/logoBig.png";
  const baseStyle = categoryStyles[product.category as Exclude<Category, 'Todas'>] || categoryStyles.Otros;

  const formatPrice = (price: number) => 
    price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 }).replace(/\s+/g, '');

  // --- SELECTOR DE CANTIDAD OPTIMIZADO ---
  const QtySelector = ({ qty, type, disabled }: { qty: number, type: 'unidad' | 'mayor', disabled?: boolean }) => {
    const currentStyle = isOffer ? categoryStyles.Ofertas : baseStyle;
    return (
      <div className={`flex items-center gap-1 sm:gap-1.5 rounded-lg p-0.5 sm:p-1 border shadow-sm transition-all shrink-0 ${disabled ? 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed' : 'bg-white/80 backdrop-blur-sm border-black/5'}`}>
        <button 
          onClick={() => removeFromCart(product.id, type)}
          disabled={disabled || qty === 0}
          className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-md transition-all ${!disabled && qty > 0 ? 'text-red-500 hover:bg-red-50 active:scale-90' : 'text-gray-300'}`}
        >
          <Minus size={12} className="sm:w-[14px]" strokeWidth={3} />
        </button>
        
        <span className={`text-[10px] sm:text-[11px] font-black min-w-[14px] sm:min-w-[18px] text-center ${!disabled && qty > 0 ? 'text-secondary' : 'text-gray-400'}`}>
          {qty}
        </span>

        <button 
          onClick={() => addToCart(product, type)}
          disabled={disabled || !hasStock}
          className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-md text-white shadow-sm transition-all active:scale-90 
            ${disabled || !hasStock ? 'bg-gray-300' : `${currentStyle.badge} hover:brightness-110`}`}
        >
          <Plus size={12} className="sm:w-[14px]" strokeWidth={3} />
        </button>
      </div>
    );
  }

  const PriceRow = ({ type, price, label, icon: Icon, currentQty }: { type: 'unidad' | 'mayor', price: number, label: string, icon: any, currentQty: number }) => {
    const isActive = price > 0;
    const rowStyle = isActive ? {
        bg: baseStyle.lightBg,
        border: baseStyle.border,
        text: 'text-secondary',
        labelColor: baseStyle.primary,
        iconBg: baseStyle.icon,
        activeBorder: currentQty > 0 ? 'border-l-2 sm:border-l-4 ring-1 ring-black/5' : ''
    } : {
        bg: 'bg-gray-100/50',
        border: 'border-gray-200',
        text: 'text-gray-400',
        labelColor: 'text-gray-400',
        iconBg: 'bg-gray-300',
        activeBorder: ''
    };

    return (
      <div className={`flex items-center justify-between ${rowStyle.bg} p-1.5 sm:p-2 rounded-lg border ${rowStyle.border} transition-all ${rowStyle.activeBorder} gap-1`}>
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <div className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-sm ${rowStyle.iconBg} flex items-center justify-center shrink-0`}>
              <Icon className="w-2 sm:w-2.5 text-white" />
            </div>
            <span className={`text-[7px] sm:text-[9px] ${rowStyle.labelColor} font-black uppercase truncate`}>{label}</span>
          </div>
          <span className={`text-[10px] sm:text-sm font-black tracking-tighter truncate ${rowStyle.text}`}>
            {isActive ? formatPrice(price) : "---"}
          </span>
        </div>
        <QtySelector qty={currentQty} type={type} disabled={!isActive} />
      </div>
    );
  }

  return (
    <div className={`group bg-card rounded-xl shadow-sm border ${isOffer ? categoryStyles.Ofertas.border : baseStyle.border} overflow-hidden flex flex-col hover:shadow-xl sm:hover:-translate-y-1 transition-all duration-300 h-full`}>
      
      {/* IMAGEN */}
      <div className="relative aspect-square w-full bg-white overflow-hidden flex items-center justify-center p-2 sm:p-4 text-center">
        <div className="absolute top-1.5 left-1.5 z-10 flex flex-col gap-0.5">
          <span className={`${isOffer ? categoryStyles.Ofertas.badge : baseStyle.badge} text-white text-[7px] sm:text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm`}>
            {product.category}
          </span>
          {product.description && product.description !== product.category && (
            <span className="bg-white/90 text-muted-foreground border border-border text-[6px] sm:text-[8px] font-bold px-1 py-0.5 rounded uppercase truncate max-w-[80px]">
              {product.description}
            </span>
          )}
        </div>
        <img 
          src={product.image ? `/${product.image}` : localPlaceholder} 
          alt={product.name} 
          className="max-h-full max-w-full object-contain group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { const target = e.target as HTMLImageElement; if (target.src !== window.location.origin + localPlaceholder) target.src = localPlaceholder; }}
        />
      </div>
      
      {/* CUERPO */}
      <div className="p-2 sm:p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2 sm:mb-3 gap-1">
          <h3 className="font-bold text-foreground uppercase text-[9px] sm:text-[11px] leading-tight line-clamp-2 min-h-[1.8rem] sm:min-h-[2.2rem] flex-1">
            {product.name}
          </h3>
          {hasStock ? (
            <CheckCircle2 className={`w-3 h-3 sm:w-4 sm:h-4 ${isOffer ? categoryStyles.Ofertas.primary : baseStyle.primary} shrink-0`} />
          ) : (
            <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-destructive shrink-0" />
          )}
        </div>

        <div className="mt-auto space-y-2 sm:space-y-2.5 h-[100px] sm:h-[124px] flex flex-col justify-end">
          {isOffer ? (
            <div className="relative overflow-hidden bg-red-500 p-2 sm:p-3 rounded-lg shadow-md border-b-[3px] sm:border-b-4 border-black/10 flex flex-col justify-center items-center h-full">
              <span className="text-[7px] sm:text-[9px] text-white/90 font-black uppercase italic mb-0.5 sm:mb-1 tracking-widest">¡Oferta!</span>
              <span className="text-base sm:text-3xl font-black text-white italic tracking-tighter mb-1.5 sm:mb-2 leading-none">
                {formatPrice(product.priceOferta!)}
              </span>
              <div className="scale-90 sm:scale-110">
                 <QtySelector qty={qtyU} type="unidad" disabled={!hasStock} />
              </div>
            </div>
          ) : (
            <>
              <PriceRow type="unidad" label="Unidad" price={product.priceUnidad} icon={User} currentQty={qtyU} />
              <PriceRow type="mayor" label="X Bulto" price={product.priceCantidad} icon={Package} currentQty={qtyM} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}