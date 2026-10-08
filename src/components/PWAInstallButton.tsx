import React, { useState } from 'react';
import { Download, Share } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed in standalone mode, hide
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded bg-[#00ffcc]/20 border border-[#00ffcc]/60 px-2 py-0.5 text-[11px] font-bold text-[#00ffcc] hover:bg-[#00ffcc]/30 transition shadow-[0_0_8px_rgba(0,255,204,0.4)] animate-pulse"
        title="Instalar Examen MIB como App PWA"
      >
        <Download className="h-3 w-3" />
        <span>Instalar App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded border border-gray-600 bg-neutral-900 px-2 py-0.5 text-[11px] font-medium text-gray-200 hover:bg-neutral-800 transition"
          title="Instalar en iPhone / iPad"
        >
          <Share className="h-3 w-3 text-[#00ffcc]" />
          <span>Instalar</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-xl border border-[#00ffcc]/40 bg-neutral-900 p-5 shadow-2xl text-left">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="text-[#00ffcc]">📱</span> Instalar Examen MIB en iOS
              </h3>
              <p className="mt-2.5 text-xs text-gray-300 leading-relaxed">
                Para jugar sin conexión a pantalla completa como una app nativa:
              </p>
              <ol className="mt-3 list-decimal list-inside space-y-1.5 text-xs text-gray-200 bg-black/50 p-3 rounded-lg border border-neutral-800">
                <li>
                  Toca el botón <strong className="text-white">Compartir</strong> (<Share className="inline h-3.5 w-3.5 text-[#00ffcc]" />) en la barra de Safari.
                </li>
                <li>
                  Baja y selecciona <strong className="text-[#00ffcc]">"Añadir a la pantalla de inicio"</strong>.
                </li>
                <li>
                  Pulsa <strong className="text-white">Añadir</strong> en la esquina superior derecha.
                </li>
              </ol>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-lg bg-[#00ffcc] py-2 text-xs font-bold text-black hover:bg-[#33ffdd] transition"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
