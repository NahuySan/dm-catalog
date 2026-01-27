// Header.tsx
import { useState, useEffect } from 'react';
import { Download, Loader2 } from 'lucide-react';

interface HeaderProps {
  onExportPDF: () => void;
  isGenerating: boolean;
  progress: number;
}

export function Header({ onExportPDF, isGenerating, progress }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
          : "py-4 bg-[#14943b] shadow-md" // Usé el verde Mauri directamente
        }`}
    >
      <div className="max-w-full mx-auto relative"> 
        <div className="flex items-center justify-between gap-3">
          
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-2 sm:gap-4 hover:opacity-80 transition-opacity focus:outline-none cursor-pointer flex-1"
            aria-label="Volver al inicio"
          >
            <img 
              src="/assets/logo.png" 
              alt="Logo Mauri" 
              className="w-14 h-10 sm:w-16 sm:h-16 object-contain flex-shrink-0"
            />
            
            <div className="text-left text-white">
              <h1 className={`text-sm xs:text-base sm:text-2xl font-black leading-tight tracking-tighter ${isScrolled ? "text-gray-900 dark:text-white" : "text-white"}`}>
                Distribuidora Mauri
              </h1>
              <p className={`text-[10px] sm:text-sm hidden xs:block font-medium ${isScrolled ? "text-gray-500" : "text-white/80"}`}>
                Jardín América, Misiones
              </p>
            </div>
          </button>

          <button
            onClick={onExportPDF}
            disabled={isGenerating}
            className={`flex items-center gap-2 px-3 sm:px-5 py-2 rounded-xl font-bold transition-all duration-300 shadow-sm active:scale-95 flex-shrink-0
              ${isGenerating ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg"}
              ${isScrolled 
                ? "bg-[#14943b] text-white hover:bg-[#117a31]" 
                : "bg-white text-[#14943b] hover:bg-gray-100"
              }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-[10px] font-black">{progress > 0 ? `${progress}%` : 'PROCESANDO...'}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                {/* Texto más descriptivo para la fusión de archivos */}
                <span className="hidden md:inline uppercase text-[10px] tracking-widest">Descargar Catálogo Completo</span>
                <span className="md:hidden text-[10px] font-black">FULL PDF</span>
              </>
            )}
          </button>
          
        </div>
      </div>

      {/* Barra de progreso visual */}
      {isGenerating && (
        <div 
          className="absolute bottom-0 left-0 h-1 bg-yellow-400 transition-all duration-300 ease-out" 
          style={{ width: `${progress > 0 ? progress : 10}%` }} 
        />
      )}
    </header>
  );
}