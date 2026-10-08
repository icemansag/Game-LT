import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-2 left-2 z-50 flex items-center gap-1.5 rounded-md bg-amber-500/90 border border-amber-300 px-2.5 py-1 text-[11px] font-bold text-black shadow-lg backdrop-blur-sm animate-pulse">
      <WifiOff className="h-3.5 w-3.5" />
      <span>Modo Sin Conexión — Cache PWA Activa</span>
    </div>
  );
};
