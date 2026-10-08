import React from 'react';
import { ShieldCheck, Skull, Trophy, RotateCcw, ArrowRight } from 'lucide-react';

interface OverlaysProps {
  flashOpacity: number;
  gameStatus: 'playing' | 'level_cleared' | 'game_over' | 'victory';
  debriefText: string;
  onNextLevel: () => void;
  onRestart: () => void;
}

export const Overlays: React.FC<OverlaysProps> = ({
  flashOpacity,
  gameStatus,
  debriefText,
  onNextLevel,
  onRestart,
}) => {
  return (
    <>
      {/* Neuralizer Flash Screen */}
      <div
        className="pointer-events-none fixed inset-0 z-50 bg-white transition-opacity duration-150"
        style={{ opacity: flashOpacity }}
      />

      {/* GAME OVER (SUSPENDIDO) */}
      {gameStatus === 'game_over' && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/95 p-6 text-center backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-red-950/80 border-2 border-red-500 shadow-[0_0_25px_rgba(255,0,0,0.6)]">
            <Skull className="h-10 w-10 text-red-500 animate-pulse" />
          </div>

          <h2 className="font-sans font-black text-2xl text-[#ff4d4d] tracking-wide mb-1">
            ¡SUSPENDIDO!
          </h2>
          <p className="text-gray-300 text-sm max-w-[280px] mb-2 leading-relaxed">
            Has fallado la prueba de tiro y evaluación de amenazas de los Hombres de Negro.
          </p>
          <p className="font-mono text-xs text-red-400/80 mb-5">
            [PROTOCOLO MIB: MEMORIA BORRADA]
          </p>

          <button
            onClick={onRestart}
            className="flex items-center gap-2 rounded-lg bg-[#ff3333] hover:bg-[#ff1f1f] text-white px-6 py-2.5 font-sans font-bold text-sm uppercase tracking-wider shadow-[0_0_15px_rgba(255,51,51,0.6)] transition active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Repetir Examen</span>
          </button>
        </div>
      )}

      {/* NIVEL SUPERADO */}
      {gameStatus === 'level_cleared' && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/95 p-6 text-center backdrop-blur-sm animate-in zoom-in-95 duration-200">
          <div className="relative mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-950/80 border-2 border-[#00ffcc] shadow-[0_0_25px_rgba(0,255,204,0.6)]">
            <ShieldCheck className="h-10 w-10 text-[#00ffcc]" />
          </div>

          <h2 className="font-sans font-black text-xl text-[#00ffcc] tracking-wide mb-2">
            ¡AMENAZA NEUTRALIZADA!
          </h2>
          <p className="text-gray-200 text-sm max-w-[270px] mb-5 leading-snug">
            {debriefText || 'Excelente tiro e identificación táctica, Agente.'}
          </p>

          <button
            onClick={onNextLevel}
            className="flex items-center gap-2 rounded-lg bg-[#00cc66] hover:bg-[#00e673] text-black font-sans font-black px-6 py-2.5 text-sm uppercase tracking-wider shadow-[0_0_15px_rgba(0,204,102,0.6)] transition active:scale-95"
          >
            <span>Siguiente Galería</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* VICTORIA FINAL */}
      {gameStatus === 'victory' && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/95 p-5 text-center backdrop-blur-sm overflow-y-auto animate-in zoom-in-90 duration-300">
          <div className="relative mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-950/80 border-2 border-[#ffcc00] shadow-[0_0_30px_rgba(255,204,0,0.7)]">
            <Trophy className="h-8 w-8 text-[#ffcc00]" />
          </div>

          <h2 className="font-sans font-black text-xl text-[#00ffcc] tracking-wide mb-1">
            ¡EXAMEN MIB APROBADO!
          </h2>

          <div className="my-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-left max-w-[290px]">
            <p className="font-mono text-xs font-bold text-[#ffcc00] mb-1">
              "¡¡NO ES POSIBLE... CÓMO ME VISTE!!"
            </p>
            <p className="font-mono text-[10px] text-gray-400 italic">
              (La voz angelical de Tiffany cambia a un gutural rugido alienígena mientras cae su libro de física cuántica)
            </p>
          </div>

          <p className="text-gray-200 text-xs max-w-[280px] my-2 leading-relaxed">
            "Niña blanca de 8 años en medio del callejón con un libro de física cuántica... ¡Esa iba a armarla!" Excelente deducción y puntería, Agente J. ¡Bienvenido a los Hombres de Negro!
          </p>

          <div className="mt-1 mb-4 flex items-center justify-center gap-2 font-mono text-[11px] text-[#00ffcc] bg-neutral-900 border border-neutral-700 px-3 py-1 rounded-full">
            <span>RANGO: AGENTE OFICIAL MIB</span>
            <span>⭐ ⭐ ⭐</span>
          </div>

          <button
            onClick={onRestart}
            className="flex items-center gap-2 rounded-lg bg-[#00ffcc] hover:bg-[#33ffdd] text-black font-sans font-black px-6 py-2.5 text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(0,255,204,0.7)] transition active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Nuevo Examen Completo</span>
          </button>
        </div>
      )}
    </>
  );
};
