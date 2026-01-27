import { useState, useRef, useMemo } from 'react';
// Importamos la función mágica del helper
import { handleDownloadFullCatalog } from '@/lib/pdfHelper'; 
import { Header } from '@/app/components/Header';
import { Hero } from '@/app/components/Hero';
import { SearchBar } from '@/app/components/SearchBar';
import { CategoryFilter } from '@/app/components/CategoryFilter';
import { ProductCard } from '@/app/components/ProductCard';
import { products } from '@/app/data/products'; 
import { Category, Product } from '@/app/types';

const categories: Category[] = ['Todas', 'Ofertas', 'Comestibles', 'Bebidas', 'Higiene', 'Limpieza', 'Medicamentos', 'Otros'];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const catalogRef = useRef<HTMLDivElement>(null);

  const filteredProducts = useMemo(() => {
    return (products as Product[]).filter((product: Product) => {
      const matchesCategory = 
        selectedCategory === 'Todas' || 
        (selectedCategory === 'Ofertas' 
          ? (product.priceOferta && product.priceOferta > 0) 
          : product.category === selectedCategory);

      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  const horizontalOffers = useMemo(() => {
    return (products as Product[]).filter(p => p.priceOferta && p.priceOferta > 0);
  }, []);

  const handleScrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // ==========================================
  //  NUEVA LÓGICA DE EXPORTACIÓN (FUSIÓN)
  // ==========================================
  const handleExportPDF = async () => {
    if (filteredProducts.length === 0) {
      alert("No hay productos para exportar.");
      return;
    }

    let progressInterval: NodeJS.Timeout;
    
    try {
      setIsGenerating(true);
      setDownloadProgress(10); // Arrancamos con un empujón visual

      // Simulamos progreso mientras pdf-lib hace el laburo pesado
      progressInterval = setInterval(() => {
        setDownloadProgress((prev) => (prev < 95 ? prev + 2 : prev));
      }, 500);

      // LLAMADA AL HELPER: Acá sucede la magia de la fusión
      await handleDownloadFullCatalog(filteredProducts, selectedCategory);
      
      clearInterval(progressInterval);
      setDownloadProgress(100);

    } catch (error) {
      console.error('Error al generar el catálogo fusionado:', error);
      alert('Hubo un error al generar el catálogo completo.');
    } finally {
      // Esperamos un cachito para que el usuario vea el 100%
      setTimeout(() => {
        setIsGenerating(false);
        setDownloadProgress(0);
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-accent transition-colors duration-300">
      <Header 
        onExportPDF={handleExportPDF} 
        isGenerating={isGenerating} 
        progress={downloadProgress}
      />
      
      <div className="pt-0"> 
        <Hero onScrollToCatalog={handleScrollToCatalog} />
        
        <main className="max-w-7xl mx-auto px-2 sm:px-6 py-8" ref={catalogRef}>
          <div className="px-2 sm:px-0">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>
          
          <div className="mt-6">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          {/* Carrusel de Ofertas */}
          {horizontalOffers.length > 0 && selectedCategory === 'Todas' && searchTerm === '' && (
            <section className="mt-12 mb-6">
              <div className="flex items-center gap-2 mb-4 px-2">
                <span className="text-xl">🔥</span>
                <h3 className="text-xl font-black uppercase tracking-tighter text-secondary">
                  Ofertas del Momento
                </h3>
              </div>
              <div className="flex overflow-x-auto gap-4 pb-6 px-2 snap-x scroll-smooth scrollbar-hide">
                {horizontalOffers.map((product) => (
                  <div key={`offer-h-${product.id}`} className="min-w-[260px] sm:min-w-[300px] snap-start">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Grilla de Productos */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6 border-b border-border pb-4 px-2 sm:px-0">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground uppercase tracking-tight">
                {selectedCategory === 'Todas' ? 'Catálogo General' : selectedCategory}
              </h2>
              <span className="bg-card px-3 py-1 rounded-full border border-border text-xs sm:text-sm font-bold text-primary">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'ítem' : 'ítems'}
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="mx-2 text-center py-20 bg-card rounded-xl border border-dashed border-border">
                <p className="text-muted-foreground italic text-lg">
                  No se encontraron productos en esta sección.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <footer className="bg-card border-t border-border mt-20 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground text-sm">
          <p className="font-bold text-foreground">© 2026 Distribuidora Mauri</p>
          <p className="mt-1">Jardín América, Misiones</p>
        </div>
      </footer>
    </div>
  );
}