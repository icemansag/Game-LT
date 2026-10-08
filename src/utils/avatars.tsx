import React from 'react';

export const SVGAvatars: Record<string, () => React.JSX.Element> = {
  peaton: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="38" r="18" fill="#d9b382" />
      <path d="M 32 35 Q 50 15 68 35 Z" fill="#332211" />
      <rect x="30" y="60" width="40" height="35" rx="10" fill="#2b4c7e" />
      <circle cx="50" cy="75" r="3" fill="#fff" />
    </svg>
  ),
  musico: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="38" r="18" fill="#e0ac69" />
      <path d="M 25 38 Q 50 10 75 38 Q 70 50 50 45 Q 30 50 25 38" fill="#222" />
      <rect x="30" y="60" width="40" height="35" rx="10" fill="#8b0000" />
      <line x1="45" y1="65" x2="45" y2="90" stroke="#fff" strokeWidth="2" />
    </svg>
  ),
  fotografo: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="38" r="18" fill="#d9b382" />
      <rect x="35" y="45" width="30" height="20" rx="4" fill="#444" />
      <circle cx="50" cy="55" r="7" fill="#111" />
      <rect x="30" y="68" width="40" height="30" rx="8" fill="#333" />
    </svg>
  ),
  turista: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="40" r="18" fill="#f5d0b1" />
      <path d="M 25 30 Q 50 10 75 30 L 70 36 L 30 36 Z" fill="#e6b800" />
      <rect x="32" y="62" width="36" height="30" rx="8" fill="#cc6600" />
      <rect x="42" y="70" width="16" height="15" fill="#fff" />
    </svg>
  ),
  vendedor: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="38" r="18" fill="#c68642" />
      <ellipse cx="50" cy="22" rx="20" ry="6" fill="#fff" />
      <rect x="30" y="60" width="40" height="35" rx="10" fill="#006644" />
      <circle cx="50" cy="72" r="4" fill="#ffcc00" />
    </svg>
  ),
  enmascarado: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="38" r="18" fill="#1a1a1a" />
      <polygon points="32,30 68,30 65,48 35,48" fill="#ff0055" />
      <circle cx="43" cy="38" r="4" fill="#00ffcc" />
      <circle cx="57" cy="38" r="4" fill="#00ffcc" />
      <rect x="28" y="58" width="44" height="35" rx="10" fill="#330033" />
    </svg>
  ),
  corredor: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="38" r="18" fill="#e0ac69" />
      <path d="M 32 30 Q 50 15 68 30" fill="#111" />
      <rect x="32" y="60" width="36" height="35" rx="8" fill="#ff4500" />
      <path d="M 45 60 L 55 60 L 55 85 L 45 85 Z" fill="#fff" />
    </svg>
  ),
  barrendero: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="38" r="18" fill="#d9b382" />
      <ellipse cx="50" cy="24" rx="18" ry="5" fill="#666" />
      <rect x="30" y="60" width="40" height="35" rx="8" fill="#555" />
      <line x1="30" y1="50" x2="70" y2="90" stroke="#b8860b" strokeWidth="4" />
    </svg>
  ),
  pintor: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="38" r="18" fill="#f5d0b1" />
      <path d="M 28 35 Q 50 10 72 35" fill="#a0522d" />
      <rect x="30" y="60" width="40" height="35" rx="8" fill="#fff" />
      <circle cx="45" cy="75" r="4" fill="#ff0000" />
      <circle cx="55" cy="72" r="3" fill="#0000ff" />
    </svg>
  ),
  lector: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="38" r="18" fill="#e0ac69" />
      <circle cx="43" cy="38" r="5" fill="none" stroke="#fff" strokeWidth="1.5" />
      <circle cx="57" cy="38" r="5" fill="none" stroke="#fff" strokeWidth="1.5" />
      <rect x="30" y="60" width="40" height="35" rx="8" fill="#4682b4" />
    </svg>
  ),
  enano: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="42" r="16" fill="#88cc44" />
      <polygon points="35,28 50,5 65,28" fill="#66aa22" />
      <rect x="32" y="65" width="36" height="30" rx="8" fill="#225522" />
      <circle cx="50" cy="78" r="5" fill="#ff0000" />
    </svg>
  ),
  jardinero: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="38" r="18" fill="#d9b382" />
      <ellipse cx="50" cy="24" rx="22" ry="6" fill="#deb887" />
      <rect x="30" y="60" width="40" height="35" rx="8" fill="#2e8b57" />
      <path d="M 60 70 Q 75 70 70 85" stroke="#4682b4" strokeWidth="4" fill="none" />
    </svg>
  ),
  guardia: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="38" r="18" fill="#e0ac69" />
      <rect x="30" y="24" width="40" height="12" fill="#1e3f66" />
      <rect x="30" y="60" width="40" height="35" rx="8" fill="#1e3f66" />
      <circle cx="50" cy="72" r="4" fill="#ffd700" />
    </svg>
  ),
  comprador: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="38" r="18" fill="#f5d0b1" />
      <path d="M 32 30 Q 50 15 68 30" fill="#8b4513" />
      <rect x="30" y="60" width="40" height="35" rx="8" fill="#9932cc" />
      <rect x="65" y="70" width="12" height="18" fill="#ff69b4" />
    </svg>
  ),
  taxista: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="38" r="18" fill="#d9b382" />
      <rect x="35" y="24" width="30" height="10" fill="#ffcc00" />
      <rect x="30" y="60" width="40" height="35" rx="8" fill="#333" />
    </svg>
  ),
  ventosa: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="40" r="18" fill="#44aa88" />
      <ellipse cx="50" cy="22" rx="10" ry="8" fill="#227755" />
      <circle cx="44" cy="38" r="3" fill="#ffff00" />
      <circle cx="56" cy="38" r="3" fill="#ffff00" />
      <rect x="30" y="62" width="40" height="30" rx="8" fill="#114433" />
    </svg>
  ),
  mesero: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="38" r="18" fill="#e0ac69" />
      <rect x="30" y="60" width="40" height="35" rx="8" fill="#111" />
      <polygon points="45,60 55,60 58,80 42,80" fill="#fff" />
    </svg>
  ),
  repartidor: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="38" r="18" fill="#d9b382" />
      <circle cx="50" cy="26" r="12" fill="#ff3300" />
      <rect x="30" y="60" width="40" height="35" rx="8" fill="#ff6600" />
    </svg>
  ),
  alien1: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <ellipse cx="50" cy="38" rx="20" ry="16" fill="#9933ff" />
      <ellipse cx="42" cy="36" rx="6" ry="9" fill="#00ffcc" />
      <ellipse cx="58" cy="36" rx="6" ry="9" fill="#00ffcc" />
      <rect x="30" y="62" width="40" height="30" rx="8" fill="#4b0082" />
    </svg>
  ),
  tecnico: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="38" r="18" fill="#e0ac69" />
      <rect x="32" y="26" width="36" height="10" fill="#ffcc00" />
      <rect x="30" y="60" width="40" height="35" rx="8" fill="#4682b4" />
    </svg>
  ),
  electricista: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="38" r="18" fill="#d9b382" />
      <circle cx="50" cy="24" rx="14" ry="10" fill="#ff4500" />
      <rect x="30" y="60" width="40" height="35" rx="8" fill="#2f4f4f" />
    </svg>
  ),
  limpiador: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="38" r="18" fill="#f5d0b1" />
      <path d="M 32 32 Q 50 15 68 32" fill="#8b4513" />
      <rect x="30" y="60" width="40" height="35" rx="8" fill="#008b8b" />
    </svg>
  ),
  supervisor: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="38" r="18" fill="#e0ac69" />
      <rect x="30" y="60" width="40" height="35" rx="8" fill="#2c2c2c" />
      <rect x="40" y="68" width="20" height="15" fill="#fff" />
    </svg>
  ),
  vigilante: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="38" r="18" fill="#d9b382" />
      <rect x="32" y="28" width="36" height="8" fill="#222" />
      <rect x="30" y="60" width="40" height="35" rx="8" fill="#3b3b3b" />
    </svg>
  ),
  chofer: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="38" r="18" fill="#e0ac69" />
      <circle cx="50" cy="26" rx="14" ry="8" fill="#111" />
      <rect x="30" y="60" width="40" height="35" rx="8" fill="#222" />
      <polygon points="45,60 55,60 58,75 42,75" fill="#fff" />
    </svg>
  ),
  bestia: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="40" r="20" fill="#a0522d" />
      <polygon points="35,25 42,12 48,26" fill="#8b4513" />
      <polygon points="65,25 58,12 52,26" fill="#8b4513" />
      <circle cx="42" cy="38" r="4" fill="#ff0000" />
      <circle cx="58" cy="38" r="4" fill="#ff0000" />
      <rect x="28" y="62" width="44" height="30" rx="8" fill="#5c2c16" />
    </svg>
  ),
  botones: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="38" r="18" fill="#d9b382" />
      <rect x="35" y="25" width="30" height="8" fill="#8b0000" />
      <rect x="30" y="60" width="40" height="35" rx="8" fill="#8b0000" />
    </svg>
  ),
  cajero: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="38" r="18" fill="#f5d0b1" />
      <rect x="30" y="60" width="40" height="35" rx="8" fill="#1e90ff" />
    </svg>
  ),
  conserje: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="38" r="18" fill="#e0ac69" />
      <rect x="30" y="60" width="40" height="35" rx="8" fill="#708090" />
    </svg>
  ),
  informador: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="38" r="18" fill="#d9b382" />
      <rect x="30" y="60" width="40" height="35" rx="8" fill="#556b2f" />
      <rect x="36" y="70" width="28" height="20" fill="#fff" />
    </svg>
  ),
  gimnasta: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="38" r="18" fill="#e0ac69" />
      <rect x="32" y="60" width="36" height="35" rx="8" fill="#ff1493" />
    </svg>
  ),
  alergia: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="38" r="18" fill="#ffb6c1" />
      <rect x="30" y="60" width="40" height="35" rx="8" fill="#4169e1" />
      <circle cx="50" cy="42" r="6" fill="#ff0000" />
    </svg>
  ),
  tiffany: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="38" r="18" fill="#ffdbac" />
      <path d="M 30 35 Q 50 10 70 35 L 75 75 L 25 75 Z" fill="#ff69b4" />
      <circle cx="43" cy="38" r="3.5" fill="#000" />
      <circle cx="57" cy="38" r="3.5" fill="#000" />
      <rect x="32" y="65" width="36" height="28" rx="6" fill="#da70d6" />
      <rect x="42" y="52" width="16" height="14" fill="#fff" />
      <text x="44" y="62" fontSize="7" fill="#000" fontWeight="bold">E=mc²</text>
    </svg>
  ),
  maniqui: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="38" r="18" fill="#cccccc" />
      <rect x="30" y="60" width="40" height="35" rx="8" fill="#aaaaaa" />
    </svg>
  ),
  nadador: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="38" r="18" fill="#e0ac69" />
      <rect x="30" y="60" width="40" height="35" rx="8" fill="#00ced1" />
      <circle cx="50" cy="50" r="12" fill="none" stroke="#ff4500" strokeWidth="4" />
    </svg>
  ),
  actor: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="38" r="18" fill="#333" />
      <ellipse cx="50" cy="40" rx="12" ry="14" fill="#fff" />
      <circle cx="45" cy="38" r="2" fill="#000" />
      <circle cx="55" cy="38" r="2" fill="#000" />
      <ellipse cx="50" cy="48" rx="4" ry="6" fill="#000" />
      <rect x="30" y="60" width="40" height="35" rx="8" fill="#800000" />
    </svg>
  ),
};

export const AvatarRenderer: React.FC<{ tipo?: string }> = ({ tipo }) => {
  if (!tipo || !SVGAvatars[tipo]) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="38" r="18" fill="#d9b382" />
        <rect x="30" y="60" width="40" height="35" rx="8" fill="#444" />
      </svg>
    );
  }

  const Component = SVGAvatars[tipo];
  return <Component />;
};
