import { Category } from '@/app/types';

const categoryColors: Record<Exclude<Category, 'Todas'>, string> = {
  Ofertas: 'bg-[#FCA5A5]', // Rojo pastel suave
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
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
      <h3 className="mb-6 text-center text-lg font-black tracking-widest text-primary">
        Filtrar Por Categoría
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
                  ? `${bgColor} text-white shadow-lg scale-105 ring-2 ring-offset-2 ring-offset-white`
                  : 'bg-accent/50 text-muted-foreground hover:bg-accent hover:text-foreground'
              } ${isOferta && !isSelected ? 'border border-red-200' : ''}`}
            >
              {isOferta ? `🔥${category}` : category}
            </button>
          );
        })}
      </div>
    </div>
  );
}