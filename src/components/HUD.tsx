import React from 'react';
import { Volume2, VolumeX, FolderCog } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HUDProps {
  vidas: number;
  maxVidas?: number;
  nivelActual: number;
  totalNiveles: number;
  tiempo: number;
  nombreNivel: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenAssetManager: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  vidas,
  maxVidas = 3,
  nivelActual,
  totalNiveles,
  tiempo,
  nombreNivel,
  isMuted,
  onToggleMute,
  onOpenAssetManager,
}) => {
  const isUrgent = tiempo <= 8;

  return (
    <header className="relative z-20 flex flex-col border-b-2 border-[#00ffcc] bg-black px-2.5 py-1.5 shadow-md">
      <div className="flex items-center justify-between gap-1 text-xs">
        {/* Vidas */}
        <div className="flex items-center gap-1">
          <div className="flex tracking-wider text-base select-none" title={`Vidas: ${vidas}/${maxVidas}`}>
            {Array.from({ length: maxVidas }).map((_, i) => (
              <span
                key={i}
                className={`transition-transform duration-200 ${
                  i < vidas ? 'text-[#ff3333] scale-100' : 'text-gray-600 opacity-40 scale-90'
                }`}
              >
                {i < vidas ? '❤️' : '🖤'}
              </span>
            ))}
          </div>
        </div>

        {/* Nivel / Caso */}
        <div className="flex items-center gap-2">
          <div className="rounded bg-[#00ffcc]/10 border border-[#00ffcc]/40 px-2 py-0.5 font-mono text-[0.8rem] font-bold text-[#00ffcc] tracking-wider uppercase">
            {nombreNivel || `CASO ${nivelActual + 1}/${totalNiveles}`}
          </div>
        </div>

        {/* Temporizador y Controles */}
        <div className="flex items-center gap-2">
          <div
            className={`font-mono text-base font-black px-1.5 py-0.5 rounded transition-colors ${
              isUrgent
                ? 'animate-pulse text-[#ff3333] bg-[#ff3333]/20 border border-[#ff3333]/60'
                : 'text-[#ffcc00]'
            }`}
          >
            {tiempo}s
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
            className="rounded p-1 text-gray-400 hover:text-white hover:bg-neutral-800 transition"
            title={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-red-400" /> : <Volume2 className="h-4 w-4 text-[#00ff66]" />}
          </button>

          {/* Asset Manager Modal Toggle */}
          <button
            onClick={onOpenAssetManager}
            aria-label="Gestor de multimedia y assets"
            className="rounded p-1 text-gray-400 hover:text-[#00ffcc] hover:bg-neutral-800 transition"
            title="Gestión de Assets / Diagnóstico de Imágenes"
          >
            <FolderCog className="h-4 w-4" />
          </button>

          {/* In-App PWA Install */}
          <PWAInstallButton />
        </div>
      </div>
    </header>
  );
};
