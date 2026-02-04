import { Category } from '@/app/types';

const categoryColors: Record<Exclude<Category, 'Todas'>, string> = {
  Ofertas: 'bg-[#FCA5A5]', 
  Comestibles: 'bg-[#FDBA74]',
  Bebidas: 'bg-[#93C5FD]',
  Higiene: 'bg-[#5EEAD4]',
  Limpieza: 'bg-[#D8B4FE]',
  Medicamentos: 'bg-[#FCA5A5]',
  Otros: 'bg-[#CBD5E1]',
};

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-lg border border-border group">
      
      {/* 1. CAPA DE FONDO (Imagen responsiva) */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105
                   bg-[url('/assets/fondoMercadoMobile.webp')] 
                   md:bg-[url('/assets/fondoMercado.webp')]"
      />

      {/* 2. OVERLAY (Para dar contraste) */}
      <div className="absolute inset-0 z-10 bg-black/50" />

      {/* 3. CONTENIDO (Por encima de todo) */}
      <div className="relative z-20 p-6">
        <h3 className="mb-6 text-center text-lg font-black tracking-widest text-white drop-shadow-md">
          FILTRAR POR CATEGORÍA
        </h3>
        
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            const isOferta = category === 'Ofertas';
            const bgColor = category === 'Todas' ? 'bg-primary' : (categoryColors[category as Exclude<Category, 'Todas'>] || 'bg-slate-200');

            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  isSelected
                    ? `${bgColor} text-white shadow-xl scale-105 ring-2 ring-offset-2 ring-offset-black/20`
                    : 'bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:text-white border border-white/20'
                } ${isOferta && !isSelected ? 'border border-red-400' : ''}`}
              >
                {isOferta ? `🔥 ${category}` : category}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}