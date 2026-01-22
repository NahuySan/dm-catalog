import { useState, useEffect } from 'react';
import { Download, Loader2 } from 'lucide-react'; // Importamos Loader2 para el spinner

interface HeaderProps {
  onExportPDF: () => void;
  isGenerating: boolean; // Nueva prop necesaria
  progress: number;      // Nueva prop necesaria
}

export function Header({ onExportPDF, isGenerating, progress }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-4 sm:px-8
        ${isScrolled 
          ? "py-2 bg-white/80 dark:bg-black/60 backdrop-blur-lg shadow-sm border-b border-border/50" 
          : "py-4 bg-primary shadow-md"
        }`}
    >
      <div className="max-w-full mx-auto relative"> 
        <div className="flex items-center justify-between">
          
          {/* Logo y Nombre */}
          <div className="flex items-center gap-2 sm:gap-4">
            <img 
              src="/assets/logo.png" 
              alt="Distribuidora Mauri" 
              className="w-14 h-14 sm:w-45 sm:h-20 object-contain flex-shrink-0"
            />
            
            <div className="transition-all duration-500">
              <h1 className={`text-xl sm:text-3xl font-black leading-none tracking-tighter ${isScrolled ? "text-foreground" : "text-primary-foreground"}`}>
                Distribuidora Mauri
              </h1>
              <p className={`text-xs sm:text-sm hidden xs:block font-medium mt-1 ${isScrolled ? "text-muted-foreground" : "text-primary-foreground/80"}`}>
                Jardín América, Misiones
              </p>
            </div>
          </div>

          {/* Botón Exportar con Lógica de Carga */}
          <button
            onClick={onExportPDF}
            disabled={isGenerating} // Bloqueado mientras descarga
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-300 shadow-sm active:scale-95
              ${isGenerating ? "opacity-70 cursor-not-allowed" : "hover:shadow-md"}
              ${isScrolled 
                ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
              }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="hidden sm:inline uppercase text-xs tracking-widest">
                  {progress}%
                </span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span className="hidden md:inline uppercase text-xs tracking-widest">Descargar Catálogo</span>
                <span className="md:hidden text-xs">PDF</span>
              </>
            )}
          </button>
          
        </div>
      </div>

      {/* Barra de progreso visual al fondo del header */}
      {isGenerating && (
        <div 
          className="absolute bottom-0 left-0 h-1 bg-secondary transition-all duration-300 ease-out" 
          style={{ width: `${progress}%` }} 
        />
      )}
    </header>
  );
}