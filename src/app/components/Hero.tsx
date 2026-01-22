import { ChevronDown, Home, Sparkles } from 'lucide-react';

interface HeroProps {
  onScrollToCatalog: () => void;
}

export function Hero({ onScrollToCatalog }: HeroProps) {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-gradient-to-br from-primary/10 via-accent to-secondary/10">
      
      {/* --- LOGO DE FONDO CORREGIDO --- */}
      {/* Quitamos overflow-hidden de acá y ajustamos el posicionamiento */}
      <div className="absolute inset-0 flex items-start md:items-center justify-center pointer-events-none z-0 pt-24 md:pt-0">
        <img 
          src="/assets/logoBig.png" 
          alt="Distribuidora Mauri Fondo" 
          // Usamos w-[90%] para que nunca se corte en los costados del celu
          className="w-[90%] md:w-[650px] lg:w-[850px] h-auto object-contain opacity-[0.08]"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center">
          {/* Título: Mantenemos el estilo que ya tenías */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl mb-6 tracking-tighter drop-shadow-lg">
            <span className="text-primary font-light">Distribuidora</span>
            <br />
            <span className="text-secondary font-black">Mauri</span>
          </h1>

          <p className="text-lg md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto font-medium drop-shadow-sm">
            Abasteciendo con <span className="text-primary">Variedad</span>, <span className="text-secondary">Confianza</span> y el mejor precio de la región
          </p>

          <button
            onClick={onScrollToCatalog}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-5 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-1 transition-all inline-flex items-center gap-4 group mb-12"
          >
            Explorar Catálogo
            <ChevronDown className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
          </button>

          {/* Info Bar de Horarios */}
          <div className="max-w-3xl mx-auto mb-12 bg-white/30 backdrop-blur-md py-3 px-6 rounded-2xl border border-white/50 shadow-sm">
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.15em] text-muted-foreground font-bold mb-1">
              Horarios de Atención
            </p>
            <p className="text-sm sm:text-base text-secondary font-bold">
              Lun a Vie: <span className="text-foreground font-medium">8:00 - 12:00 | 16:00 - 20:00</span> 
              <span className="mx-3 text-muted-foreground">|</span> 
              Sáb: <span className="text-foreground font-medium">8:00 - 12:00</span>
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[
            { label: "Productos", val: "+500", color: "text-primary" },
            { label: "Categorías", val: "6", color: "text-secondary" },
            { label: "Calidad", val: "100%", color: "text-primary" },
          ].map((stat, i) => (
            <div key={i} className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white shadow-sm text-center hover:bg-white transition-colors group">
              <div className={`text-3xl font-black ${stat.color} mb-1 group-hover:scale-110 transition-transform`}>{stat.val}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Onda inferior */}
      <div className="absolute bottom-0 left-0 right-0 leading-[0]">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H0V0Z" fill="currentColor" className="text-accent" />
        </svg>
      </div>
    </section>
  );
}