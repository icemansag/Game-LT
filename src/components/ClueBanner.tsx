import React from 'react';

interface ClueBannerProps {
  clue: string;
}

export const ClueBanner: React.FC<ClueBannerProps> = ({ clue }) => {
  return (
    <div className="relative z-10 border-b-2 border-black bg-[#ffcc00] px-2 py-1 text-center font-sans text-[11px] font-black uppercase tracking-wide text-black shadow-sm select-none leading-tight">
      <span className="inline-block animate-pulse mr-1">⚠️</span>
      <span>{clue}</span>
    </div>
  );
};
