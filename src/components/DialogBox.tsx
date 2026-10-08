import React from 'react';
import { Suspect } from '../types';
import { Zap } from 'lucide-react';

interface DialogBoxProps {
  selectedSuspect: Suspect | null;
  errorMessage: string | null;
  onShoot: () => void;
  isFiring: boolean;
}

export const DialogBox: React.FC<DialogBoxProps> = ({
  selectedSuspect,
  errorMessage,
  onShoot,
  isFiring,
}) => {
  return (
    <footer className="relative z-20 flex flex-col justify-between gap-1.5 border-t-2 border-[#00ffcc] bg-black p-2.5 shrink-0 min-h-[96px]">
      {/* Speech / Evaluation text */}
      <div className="font-sans text-[12px] text-white leading-tight min-h-[34px] flex items-center overflow-hidden">
        {errorMessage ? (
          <span className="text-[#ff4d4d] font-bold animate-pulse">
            {errorMessage}
          </span>
        ) : selectedSuspect ? (
          <div className="line-clamp-2">
            <strong className="text-[#00ffcc]">{selectedSuspect.nombre}:</strong>{' '}
            <span className="text-gray-200">"{selectedSuspect.texto}"</span>
          </div>
        ) : (
          <span className="text-gray-400 italic">
            Toca a un objetivo emergente para apuntar y seleccionarlo...
          </span>
        )}
      </div>

      {/* Action Button: Disparar Neuralizador */}
      <button
        onClick={onShoot}
        disabled={isFiring}
        className={`relative flex items-center justify-center gap-2 w-full rounded-md py-2 px-3 font-sans font-black uppercase tracking-wider text-[13px] shadow-lg transition-all duration-100 ${
          isFiring
            ? 'bg-white text-black scale-95 shadow-[0_0_30px_#ffffff]'
            : 'bg-[#ff3333] hover:bg-[#ff1a1a] active:scale-[0.98] text-white shadow-[0_0_15px_rgba(255,51,51,0.5)]'
        }`}
      >
        <Zap className={`h-4 w-4 ${isFiring ? 'text-amber-500 fill-amber-500' : 'text-yellow-300'}`} />
        <span>¡Disparar Neuralizador!</span>
      </button>
    </footer>
  );
};
