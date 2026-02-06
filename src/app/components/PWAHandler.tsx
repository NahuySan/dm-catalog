import { useState, useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Download, RefreshCw, X } from 'lucide-react';

export const PWAHandler = () => {
  // --- LÓGICA DE ACTUALIZACIÓN ---
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registrado: ', r);
    },
    onRegisterError(error) {
      console.error('Error en SW:', error);
    },
  });

  // --- LÓGICA DE INSTALACIÓN ---
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallBtn(false);
    }
  };

  return (
    <>
      {/* 1. Alerta de Nueva Versión (Precios nuevos) */}
      {needRefresh && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md animate-in fade-in zoom-in duration-300">
          <div className="bg-secondary text-white p-4 rounded-2xl shadow-2xl border-2 border-white/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <RefreshCw size={20} className="animate-spin-slow" />
              </div>
              <div>
                <p className="font-black text-xs uppercase tracking-tight">¡Catálogo Actualizado!</p>
                <p className="text-[10px] opacity-90">Hay nuevos precios disponibles.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => updateServiceWorker(true)}
                className="bg-white text-secondary px-4 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-gray-100 transition-colors"
              >
                Actualizar
              </button>
              <button 
                onClick={() => setNeedRefresh(false)}
                className="p-2 hover:bg-white/10 rounded-full"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Botón de Instalar (Solo aparece si no está instalada) */}
      {showInstallBtn && (
<div className="fixed top-22 right-5 md:top-26 md:right-7 z-[45] animate-in slide-in-from-right duration-500">
  <button
    onClick={handleInstallClick}
    className="
      bg-white border-2 border-secondary text-secondary 
      px-4 py-2 rounded-full shadow-lg font-black text-[10px] 
      uppercase flex items-center gap-2 hover:bg-secondary 
      hover:text-white transition-all group
    "
  >
    <Download size={14} className="group-hover:bounce" />
    Instalar App
  </button>
</div>
      )}
    </>
  );
};