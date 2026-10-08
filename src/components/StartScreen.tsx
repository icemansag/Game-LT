// src/components/StartScreen.tsx
import React, { useState, useEffect } from 'react';
import { sounds } from '../soundManager';

export interface ScoreItem {
  name: string;
  score: number;
  difficulty: string;
  date: string;
}

export interface StartScreenProps {
  onStartGame: (playerName: string, difficulty: 'facil' | 'medio' | 'dificil', lang: 'es' | 'en') => void;
  backgroundUrl?: string;
}

// Lista de URLs de tus fondos 3D en Google Drive
const BACKGROUND_IMAGES = [
  "https://lh3.googleusercontent.com/d/1qNJLPZYwQFMTj2mlHqaaDfzhusYjmQdL", // Callejón 3D principal
  "https://lh3.googleusercontent.com/d/1R0h6MH-NE-69i5Rl9HcPKVdIazE2ArA5", 
  "https://lh3.googleusercontent.com/d/1SQ5lF-HjkKMtD9045HYpYkleD_zFSStt", 
  "https://lh3.googleusercontent.com/d/18inuQIfHPQptjeyU2EqLZ0cjnQomqw_T", 
  "https://lh3.googleusercontent.com/d/1ntp1G4u1qaUsDGMGhSJGmyC0wzxq_vOP"  
];

const translations = {
  es: {
    subtitle: "Galería de Tiro Táctica • PWA",
    agentLabel: "Identificación de Agente (Nombre):",
    placeholderName: "Ej. Agente K",
    difficultyLabel: "Nivel de Amenaza (Dificultad):",
    easy: "Fácil",
    medium: "Medio",
    hard: "Difícil",
    startBtn: "Iniciar Misión",
    rankingTitle: "🏆 Ranking de Mejores Agentes",
    noRanking: "Aún no hay registros de misiones completadas."
  },
  en: {
    subtitle: "Tactical Shooting Gallery • PWA",
    agentLabel: "Agent Identification (Name):",
    placeholderName: "E.g. Agent K",
    difficultyLabel: "Threat Level (Difficulty):",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    startBtn: "Start Mission",
    rankingTitle: "🏆 Top Agents Ranking",
    noRanking: "No completed mission records yet."
  }
};

export const StartScreen: React.FC<StartScreenProps> = ({ onStartGame }) => {
  const [playerName, setPlayerName] = useState('');
  const [difficulty, setDifficulty] = useState<'facil' | 'medio' | 'dificil'>('medio');
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [highScores, setHighScores] = useState<ScoreItem[]>([]);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(sounds.isEnabled());

  const t = translations[lang];

  useEffect(() => {
    setCurrentBgIndex(Math.floor(Math.random() * BACKGROUND_IMAGES.length));

    const savedScores = localStorage.getItem('tiffany_ranking') || localStorage.getItem('mib_ranking');
    if (savedScores) {
      try {
        setHighScores(JSON.parse(savedScores));
      } catch (e) {
        console.error("Error al cargar ranking", e);
      }
    }
  }, []);

  const handlePlayClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    sounds.playClick();
    sounds.startTensionMusic(); // Arranca la música de tensión al iniciar
    onStartGame(playerName.trim(), difficulty, lang);
  };

  const nextBackground = () => {
    sounds.playClick();
    setCurrentBgIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
  };

  const toggleAudio = () => {
    const newState = sounds.toggleSound();
    setSoundEnabled(newState);
    if (newState) {
      sounds.playClick();
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center font-mono select-none">
      {/* 1. Fondo 3D ocupando toda la pantalla con brillo sutil */}
      <div 
        className="absolute inset-0 bg-cover bg-center filter brightness-[0.65] contrast-125 transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${BACKGROUND_IMAGES[currentBgIndex]})` }}
      />
      {/* Viñeta ligera para dar profundidad cinematográfica sin tapar el fondo */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />

      {/* Controles flotantes superiores */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex gap-2 sm:gap-3 items-center">
        {/* Botón de Sonido Mute/Unmute */}
        <button
          type="button"
          onClick={toggleAudio}
          className={`px-3 py-1 rounded text-xs font-bold backdrop-blur-md border transition-all cursor-pointer ${
            soundEnabled 
              ? 'bg-black/40 text-cyan-400 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
              : 'bg-red-950/60 text-red-400 border-red-800 hover:border-red-600'
          }`}
          title={soundEnabled ? "Silenciar audio" : "Activar audio"}
        >
          {soundEnabled ? "🔊 AUDIO: ON" : "🔇 AUDIO: OFF"}
        </button>

        <button
          type="button"
          onClick={nextBackground}
          className="px-2.5 sm:px-3 py-1 rounded text-xs font-bold bg-black/40 backdrop-blur-md text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/20 transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)] cursor-pointer"
          title="Cambiar fondo 3D"
        >
          🔄 Fondo
        </button>

        <div className="flex gap-1 border-l border-cyan-500/40 pl-2 sm:pl-3">
          <button
            type="button"
            onClick={() => { sounds.playClick(); setLang('es'); }}
            className={`px-2.5 sm:px-3 py-1 rounded text-xs font-bold border transition-all cursor-pointer ${
              lang === 'es' ? 'bg-cyan-500 text-black border-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'bg-black/40 backdrop-blur-md text-cyan-400 border-cyan-500/50 hover:border-cyan-400'
            }`}
          >
            ES
          </button>
          <button
            type="button"
            onClick={() => { sounds.playClick(); setLang('en'); }}
            className={`px-2.5 sm:px-3 py-1 rounded text-xs font-bold border transition-all cursor-pointer ${
              lang === 'en' ? 'bg-cyan-500 text-black border-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'bg-black/40 backdrop-blur-md text-cyan-400 border-cyan-500/50 hover:border-cyan-400'
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {/* 2. Contenedor principal con efecto cristal (transparente, dejando ver el callejón 3D detrás) */}
      <div className="relative z-10 max-w-xl w-full mx-4 p-6 md:p-8 bg-black/40 border border-cyan-500/50 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.3)] backdrop-blur-xl">
        
        {/* Título Tiffany Protocol */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-200 to-blue-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] uppercase">
            Tiffany Protocol
          </h1>
          <p className="text-cyan-300 text-xs md:text-sm tracking-widest mt-2 uppercase">{t.subtitle}</p>
        </div>

        <form onSubmit={handlePlayClick} className="space-y-5">
          {/* Nombre del Agente */}
          <div>
            <label className="block text-cyan-400 text-xs md:text-sm mb-1.5 uppercase tracking-wider">{t.agentLabel}</label>
            <input 
              type="text"
              required
              maxLength={15}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder={t.placeholderName}
              className="w-full bg-black/40 border border-cyan-500/60 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 text-center tracking-widest text-base backdrop-blur-sm"
            />
          </div>

          {/* Dificultad */}
          <div>
            <label className="block text-cyan-400 text-xs md:text-sm mb-1.5 uppercase tracking-wider">{t.difficultyLabel}</label>
            <div className="grid grid-cols-3 gap-2">
              {(['facil', 'medio', 'dificil'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => { sounds.playClick(); setDifficulty(lvl); }}
                  className={`py-2 rounded-lg border uppercase font-bold text-xs md:text-sm tracking-wider transition-all duration-300 cursor-pointer ${
                    difficulty === lvl 
                      ? 'bg-cyan-500 text-black border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.6)]' 
                      : 'bg-black/30 backdrop-blur-sm text-cyan-400 border-cyan-800/80 hover:border-cyan-500'
                  }`}
                >
                  {lvl === 'facil' ? t.easy : lvl === 'medio' ? t.medium : t.hard}
                </button>
              ))}
            </div>
          </div>

          {/* Botón Iniciar */}
          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black text-lg tracking-widest uppercase rounded-lg shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:from-cyan-400 hover:to-blue-500 hover:scale-[1.01] transition-all duration-300 active:scale-95 cursor-pointer"
          >
            {t.startBtn}
          </button>
        </form>

        {/* Ranking traslúcido */}
        <div className="mt-6 border-t border-cyan-500/30 pt-3">
          <h3 className="text-cyan-400 text-[11px] font-bold uppercase tracking-widest mb-2 text-center">{t.rankingTitle}</h3>
          {highScores.length === 0 ? (
            <p className="text-gray-400 text-[11px] text-center italic">{t.noRanking}</p>
          ) : (
            <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
              {highScores.slice(0, 4).map((item, index) => (
                <div key={index} className="flex justify-between items-center text-xs bg-black/30 border border-cyan-500/20 px-3 py-1 rounded backdrop-blur-sm">
                  <span className="text-cyan-300 font-bold">{index + 1}. {item.name}</span>
                  <span className="text-gray-400 uppercase text-[10px]">[{item.difficulty}]</span>
                  <span className="text-emerald-400 font-mono font-bold">{item.score} pts</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
