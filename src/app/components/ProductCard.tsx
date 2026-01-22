import { Package, Tag, CheckCircle2, AlertCircle } from 'lucide-react';
import { Product, Category } from '../types';

// Mapeo de colores TONOS PASTEL sincronizados
const categoryStyles: Record<Exclude<Category, 'Todas'>, { 
  primary: string, 
  badge: string, 
  border: string, 
  lightBg: string,
  icon: string 
}> = {
  // Agregamos el estilo de Ofertas para resaltar
  Ofertas: {
    primary: 'text-[#FCA5A5]',
    badge: 'bg-[#FCA5A5]',
    border: 'border-[#FCA5A5]/40',
    lightBg: 'bg-[#FCA5A5]/10',
    icon: 'bg-[#FCA5A5]'
  },
  Comestibles: { 
    primary: 'text-[#FDBA74]', 
    badge: 'bg-[#FDBA74]', 
    border: 'border-[#FDBA74]/40', 
    lightBg: 'bg-[#FDBA74]/10',    
    icon: 'bg-[#FDBA74]'
  },
  Bebidas: { 
    primary: 'text-[#93C5FD]', 
    badge: 'bg-[#93C5FD]', 
    border: 'border-[#93C5FD]/40', 
    lightBg: 'bg-[#93C5FD]/10',
    icon: 'bg-[#93C5FD]'
  },
  Higiene: { 
    primary: 'text-[#5EEAD4]', 
    badge: 'bg-[#5EEAD4]', 
    border: 'border-[#5EEAD4]/40', 
    lightBg: 'bg-[#5EEAD4]/10',
    icon: 'bg-[#5EEAD4]'
  },
  Limpieza: { 
    primary: 'text-[#D8B4FE]', 
    badge: 'bg-[#D8B4FE]', 
    border: 'border-[#D8B4FE]/40', 
    lightBg: 'bg-[#D8B4FE]/10',
    icon: 'bg-[#D8B4FE]'
  },
  Medicamentos: { 
    primary: 'text-[#FCA5A5]', 
    badge: 'bg-[#FCA5A5]', 
    border: 'border-[#FCA5A5]/40', 
    lightBg: 'bg-[#FCA5A5]/10',
    icon: 'bg-[#FCA5A5]'
  },
  Otros: { 
    primary: 'text-[#CBD5A0]', 
    badge: 'bg-[#CBD5A0]', 
    border: 'border-[#CBD5A0]/40', 
    lightBg: 'bg-[#CBD5A0]/10',
    icon: 'bg-[#CBD5A0]'
  },
};

export function ProductCard({ product }: { product: Product }) {
  const isOffer = product.priceOferta && product.priceOferta > 0;
  
  // Si es oferta, usamos el estilo de 'Ofertas', si no, el de su categoría
  const style = isOffer 
    ? categoryStyles.Ofertas 
    : (categoryStyles[product.category as Exclude<Category, 'Todas'>] || categoryStyles.Otros);

  const formatPrice = (price: number) => 
    price.toLocaleString('es-AR', { 
      style: 'currency', 
      currency: 'ARS',
      minimumFractionDigits: 2 
    }).replace(/\s+/g, '');

  const renderPrice = (price: number) => {
    if (!price || price <= 0) return " --- ";
    return formatPrice(price);
  };

  const hasStock = product.stock > 0;

  return (
    <div className={`group bg-card rounded-xl shadow-sm border ${style.border} overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out h-full`}>
      
      {/* Contenedor de Imagen */}
      <div className="relative aspect-square w-full bg-white overflow-hidden flex items-center justify-center p-4">
        {/* Etiqueta de Categoría (Top-Left) */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          <span className={`${style.badge} text-white text-[8px] sm:text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm`}>
            {product.category}
          </span>
          {/* Subcategoría (Badge secundario) */}
          {product.description && product.description !== product.category && (
            <span className="bg-white/80 backdrop-blur-sm text-muted-foreground border border-border text-[7px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
              {product.description}
            </span>
          )}
        </div>
        
        <img 
          src={product.image || "/img/placeholder.png"} 
          alt={product.name} 
          className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/300?text=Sin+Foto" }}
        />
      </div>
      
      {/* Contenido */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3 gap-2">
          <h3 className="font-bold text-foreground uppercase text-[10px] sm:text-[12px] leading-tight line-clamp-2 min-h-[2.2rem]">
            {product.name}
          </h3>
          {hasStock ? (
            <CheckCircle2 className={`w-4 h-4 ${style.primary} shrink-0`} />
          ) : (
            <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
          )}
        </div>

        <div className="mt-auto space-y-2">
          {isOffer ? (
            /* VISTA DE OFERTA RESALTADA */
            <div className="relative overflow-hidden bg-red-500 p-2 sm:p-3 rounded-lg shadow-md border-b-4 border-black/10 transform -rotate-1 group-hover:rotate-0 transition-transform">
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-[8px] text-white/90 font-black uppercase tracking-tighter">
                  ¡Oferta!
                </span>
                <SparklesIcon className="w-3 h-3 text-white/50" />
              </div>
              <span className="text-sm sm:text-xl font-black text-white italic tracking-tighter">
                {formatPrice(product.priceOferta!)}
              </span>
            </div>
          ) : (
            /* VISTA NORMAL */
            <div className="flex flex-col gap-1.5">
              <div className={`flex items-center justify-between ${style.lightBg} p-2 rounded-lg border ${style.border}`}>
                <div className="flex items-center gap-1.5">
                  <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded ${style.icon} flex items-center justify-center text-[8px] sm:text-[9px] font-black text-white`}>
                    1
                  </div>
                  <span className={`text-[8px] sm:text-[10px] ${style.primary} font-bold uppercase`}>Unidad</span>
                </div>
                <span className={`text-[10px] sm:text-sm font-black tracking-tighter ${product.priceUnidad > 0 ? 'text-muted-foreground' : 'text-muted-foreground opacity-50'}`}>
                  {renderPrice(product.priceUnidad)}
                </span>
              </div>

              <div className={`flex items-center justify-between ${style.lightBg} p-2 rounded-lg border ${style.border}`}>
                <div className="flex items-center gap-1.5">
                  <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded ${style.icon} flex items-center justify-center`}>
                    <Package className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                  </div>
                  <span className={`text-[8px] sm:text-[10px] ${style.primary} font-bold uppercase`}>Mayor</span>
                </div>
                <span className={`text-[10px] sm:text-sm font-black tracking-tighter ${product.priceCantidad > 0 ? 'text-muted-foreground' : 'text-muted-foreground opacity-50'}`}>
                  {renderPrice(product.priceCantidad)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Pequeño icono auxiliar para la oferta
function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
    </svg>
  );
}