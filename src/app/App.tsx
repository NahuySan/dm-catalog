import { useState, useRef, useMemo } from 'react';
import { pdf } from '@react-pdf/renderer'; 
import { Header } from '@/app/components/Header';
import { Hero } from '@/app/components/Hero';
import { SearchBar } from '@/app/components/SearchBar';
import { CategoryFilter } from '@/app/components/CategoryFilter';
import { ProductCard } from '@/app/components/ProductCard';
import { CatalogPDF } from '@/app/components/CatalogPDF'; 
import { products } from '@/app/data/products'; 
import { Category, Product } from '@/app/types';

// 1. Agregamos 'Ofertas' a la lista oficial de categorías
const categories: Category[] = ['Todas', 'Ofertas', 'Comestibles', 'Bebidas', 'Higiene', 'Limpieza', 'Medicamentos', 'Otros'];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const catalogRef = useRef<HTMLDivElement>(null);

  // 2. Lógica de filtrado actualizada para manejar la categoría "Ofertas"
  const filteredProducts = useMemo(() => {
    return (products as Product[]).filter((product: Product) => {
      // Si elige 'Ofertas', filtramos por existencia de priceOferta
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

  // 3. Productos para el Carrusel Horizontal (solo ofertas, siempre visibles en 'Todas')
  const horizontalOffers = useMemo(() => {
    return (products as Product[]).filter(p => p.priceOferta && p.priceOferta > 0);
  }, []);

  const handleScrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExportPDF = async () => {
    if (filteredProducts.length === 0) {
      alert("No hay productos para exportar.");
      return;
    }
    let progressInterval: NodeJS.Timeout;
    try {
      setIsGenerating(true);
      setDownloadProgress(10);
      progressInterval = setInterval(() => {
        setDownloadProgress((prev) => (prev < 90 ? prev + 5 : prev));
      }, 400);

      const blob = await pdf(
        <CatalogPDF 
          products={filteredProducts} 
          selectedCategory={selectedCategory} 
        />
      ).toBlob();
      
      clearInterval(progressInterval);
      setDownloadProgress(100);

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `catalogo-mauri-${selectedCategory.toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Hubo un error al generar el catálogo.');
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setDownloadProgress(0);
      }, 500);
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

          {/* --- NUEVO: Carrusel Horizontal de Ofertas --- */}
          {/* Solo se muestra si estamos en 'Todas' y no hay una búsqueda activa para no saturar */}
          {horizontalOffers.length > 0 && selectedCategory === 'Todas' && searchTerm === '' && (
            <section className="mt-12 mb-6">
              <div className="flex items-center gap-2 mb-4 px-2">
                <span className="text-xl">🔥</span>
                <h3 className="text-xl font-black uppercase tracking-tighter text-secondary">
                  Ofertas del Momento
                </h3>
              </div>
              
              {/* Contenedor de Fila Única con Scroll Horizontal */}
              <div className="flex overflow-x-auto gap-4 pb-6 px-2 snap-x scroll-smooth outline-none scrollbar-hide">
                {horizontalOffers.map((product) => (
                  <div key={`offer-h-${product.id}`} className="min-w-[260px] sm:min-w-[300px] snap-start">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="mt-8">
            <div className="flex items-center justify-between mb-6 border-b border-border pb-4 px-2 sm:px-0">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground uppercase tracking-tight">
                {selectedCategory === 'Todas' ? 'Catálogo General' : selectedCategory}
              </h2>
              <span className="bg-card px-3 py-1 rounded-full border border-border text-xs sm:text-sm font-bold text-primary shadow-sm">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'ítem' : 'ítems'}
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="mx-2 text-center py-20 bg-card rounded-xl shadow-sm border border-dashed border-border">
                <p className="text-muted-foreground text-lg italic">
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
          <p className="mt-2 text-[10px] uppercase tracking-widest opacity-50">
            Abasteciendo con variedad y confianza
          </p>
        </div>
      </footer>
    </div>
  );
}