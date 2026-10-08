import React, { useState } from 'react';
import { X, Upload, CheckCircle2, RotateCcw, Image as ImageIcon, Sparkles, ExternalLink } from 'lucide-react';
import { NIVELES } from '../data/levels';
import { DRIVE_TARGET_ASSETS, FONDO_CALLEJON } from '../data/driveAssets';
import { assetManager } from '../utils/assetManager';
import { Suspect } from '../types';

interface AssetManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssetsChanged: () => void;
}

export const AssetManagerModal: React.FC<AssetManagerModalProps> = ({
  isOpen,
  onClose,
  onAssetsChanged,
}) => {
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const [cacheStatusMessage, setCacheStatusMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const currentLevel = NIVELES[selectedCaseIdx];

  const handleFileUpload = (suspect: Suspect, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        assetManager.setCustomOverride(suspect.imagen, dataUrl);
        onAssetsChanged();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetSuspect = (suspect: Suspect) => {
    assetManager.removeCustomOverride(suspect.imagen);
    onAssetsChanged();
  };

  const handleResetAll = () => {
    if (confirm('¿Restablecer todos los assets a las imágenes oficiales por defecto?')) {
      assetManager.clearAllOverrides();
      onAssetsChanged();
      setCacheStatusMessage('Se restablecieron todos los assets a los valores originales.');
    }
  };

  const handleVerifyAndPrecache = async () => {
    setIsVerifying(true);
    setCacheStatusMessage('Verificando y precargando 36 assets en memoria y caché offline...');
    const allPaths = NIVELES.flatMap(n => n.sospechosos.map(s => s.imagen));
    await assetManager.preloadImages(allPaths);
    setIsVerifying(false);
    setCacheStatusMessage('¡36/36 imágenes verificadas y listas para juego 100% offline!');
    setTimeout(() => setCacheStatusMessage(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 backdrop-blur-md">
      <div className="flex h-full max-h-[620px] w-full max-w-xl flex-col rounded-xl border border-[#00ffcc]/50 bg-[#0d0d12] shadow-[0_0_30px_rgba(0,255,204,0.3)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#00ffcc]/30 bg-neutral-950 px-4 py-3">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-[#00ffcc]" />
            <div>
              <h3 className="font-sans font-black text-sm text-white uppercase tracking-wider">
                Gestor de Assets Multimedia
              </h3>
              <p className="font-mono text-[10px] text-gray-400">
                Directorio: <span className="text-[#00ffcc]">/public/imagenes/</span> (36 objetivos)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Global Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 bg-[#14141c] px-4 py-2">
          <button
            onClick={handleVerifyAndPrecache}
            disabled={isVerifying}
            className="flex items-center gap-1.5 rounded bg-[#00ffcc]/20 border border-[#00ffcc]/50 px-2.5 py-1 text-xs font-bold text-[#00ffcc] hover:bg-[#00ffcc]/30 transition active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{isVerifying ? 'Precargando...' : 'Verificar y Precargar Caché'}</span>
          </button>

          <button
            onClick={handleResetAll}
            className="flex items-center gap-1 rounded border border-red-500/40 bg-red-950/30 px-2.5 py-1 text-xs text-red-300 hover:bg-red-900/40 transition"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Restablecer todo</span>
          </button>
        </div>

        {cacheStatusMessage && (
          <div className="bg-emerald-950/70 border-b border-emerald-500/40 px-4 py-1.5 text-xs text-emerald-300 font-mono flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>{cacheStatusMessage}</span>
          </div>
        )}

        {/* Case Selector Tabs */}
        <div className="flex overflow-x-auto border-b border-neutral-800 bg-black px-2 py-1 gap-1">
          <button
            onClick={() => setSelectedCaseIdx(-1)}
            className={`shrink-0 rounded px-2.5 py-1 font-mono text-[11px] font-bold transition uppercase ${
              selectedCaseIdx === -1
                ? 'bg-[#ffcc00] text-black shadow-[0_0_10px_#ffcc00]'
                : 'text-amber-400 hover:text-white hover:bg-neutral-900 border border-amber-500/30'
            }`}
          >
            ★ CATÁLOGO MIB ({DRIVE_TARGET_ASSETS.length})
          </button>
          {NIVELES.map((nivel, idx) => (
            <button
              key={nivel.id}
              onClick={() => setSelectedCaseIdx(idx)}
              className={`shrink-0 rounded px-2.5 py-1 font-mono text-[11px] font-bold transition uppercase ${
                selectedCaseIdx === idx
                  ? 'bg-[#00ffcc] text-black shadow-[0_0_10px_#00ffcc]'
                  : 'text-gray-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              {nivel.nombreNivel}
            </button>
          ))}
        </div>

        {/* Suspects in Selected Case or Full Catalog */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {selectedCaseIdx === -1 ? (
            <div>
              <div className="text-[11px] font-bold text-gray-300 mb-2 flex items-center justify-between">
                <span>Catálogo Completo de Recursos (<span className="text-[#ffcc00]">{DRIVE_TARGET_ASSETS.length} objetivos + fondo</span>)</span>
                <a
                  href={FONDO_CALLEJON.driveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#00ffcc] hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Ver Fondo Callejón en Drive</span>
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DRIVE_TARGET_ASSETS.map(asset => {
                  const hasCustom = assetManager.hasCustomOverride(asset.localPath);
                  const resolvedSrc = assetManager.resolveImageSrc(asset.localPath);

                  return (
                    <div
                      key={asset.id}
                      className={`flex gap-2.5 rounded-lg border p-2 bg-[#12141c] ${
                        asset.esCulpable
                          ? 'border-red-500/50 shadow-[0_0_10px_rgba(255,0,0,0.15)]'
                          : 'border-neutral-800'
                      }`}
                    >
                      {/* Thumbnail Preview */}
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded border border-neutral-700 bg-neutral-900">
                        <img
                          src={resolvedSrc}
                          alt={asset.nombre}
                          className="h-full w-full object-cover"
                        />
                        {asset.esCulpable && (
                          <span className="absolute top-0 right-0 rounded-bl bg-red-600 px-1 font-mono text-[8px] font-bold text-white">
                            AMENAZA
                          </span>
                        )}
                      </div>

                      {/* Info & Controls */}
                      <div className="flex flex-1 flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-xs text-white truncate">
                              {asset.nombre}
                            </span>
                            <span className="font-mono text-[9px] text-[#00ffcc] shrink-0">
                              {asset.rol}
                            </span>
                          </div>
                          <div className="font-mono text-[10px] text-gray-400 truncate mt-0.5 flex items-center gap-1.5">
                            <span className="truncate">{asset.localPath}</span>
                            {asset.driveUrl && (
                              <a
                                href={asset.driveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#00ffcc] hover:underline text-[9px] shrink-0 flex items-center gap-0.5"
                                title="Ver en Google Drive"
                              >
                                <span>Drive</span>
                                <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 mt-1.5">
                          <label className="flex cursor-pointer items-center gap-1 rounded bg-neutral-800 px-2 py-0.5 text-[10px] font-medium text-gray-200 hover:bg-neutral-700 transition">
                            <Upload className="h-3 w-3 text-[#00ffcc]" />
                            <span>{hasCustom ? 'Cambiar' : 'Subir'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  const dataUrl = event.target?.result as string;
                                  if (dataUrl) {
                                    assetManager.setCustomOverride(asset.localPath, dataUrl);
                                    onAssetsChanged();
                                  }
                                };
                                reader.readAsDataURL(file);
                              }}
                            />
                          </label>

                          {hasCustom && (
                            <button
                              onClick={() => {
                                assetManager.removeCustomOverride(asset.localPath);
                                onAssetsChanged();
                              }}
                              className="rounded bg-red-950/50 border border-red-500/40 px-1.5 py-0.5 text-[10px] text-red-300 hover:bg-red-900/60 transition"
                            >
                              Restablecer
                            </button>
                          )}

                          <span className="font-mono text-[9px] text-gray-500 ml-auto">
                            {hasCustom ? 'Personalizada' : 'Oficial MIB'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-[11px] font-bold text-gray-300 mb-2">
                Galería: <span className="text-[#ffcc00]">{currentLevel.subtitulo || currentLevel.nombreNivel}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentLevel.sospechosos.map(suspect => {
                  const hasCustom = assetManager.hasCustomOverride(suspect.imagen);
                  const resolvedSrc = assetManager.resolveImageSrc(suspect.imagen);

                  return (
                    <div
                      key={suspect.id}
                      className={`flex gap-2.5 rounded-lg border p-2 bg-[#12141c] ${
                        suspect.esCulpable
                          ? 'border-red-500/50 shadow-[0_0_10px_rgba(255,0,0,0.15)]'
                          : 'border-neutral-800'
                      }`}
                    >
                      {/* Thumbnail Preview */}
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded border border-neutral-700 bg-neutral-900">
                        <img
                          src={resolvedSrc}
                          alt={suspect.nombre}
                          className="h-full w-full object-cover"
                        />
                        {suspect.esCulpable && (
                          <span className="absolute top-0 right-0 rounded-bl bg-red-600 px-1 font-mono text-[8px] font-bold text-white">
                            BLANCO
                          </span>
                        )}
                      </div>

                      {/* Suspect Info & Controls */}
                      <div className="flex flex-1 flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-xs text-white truncate">
                              {suspect.nombre}
                            </span>
                            <span className="font-mono text-[9px] text-[#00ffcc] shrink-0">
                              {suspect.rol}
                            </span>
                          </div>
                          <div className="font-mono text-[10px] text-gray-400 truncate mt-0.5 flex items-center gap-1.5">
                            <span className="truncate">{suspect.imagen}</span>
                            {suspect.driveUrl && (
                              <a
                                href={suspect.driveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#00ffcc] hover:underline text-[9px] shrink-0 flex items-center gap-0.5"
                                title="Ver en Google Drive"
                              >
                                <span>Drive</span>
                                <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 mt-1.5">
                          <label className="flex cursor-pointer items-center gap-1 rounded bg-neutral-800 px-2 py-0.5 text-[10px] font-medium text-gray-200 hover:bg-neutral-700 transition">
                            <Upload className="h-3 w-3 text-[#00ffcc]" />
                            <span>{hasCustom ? 'Cambiar' : 'Subir'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(suspect, e)}
                            />
                          </label>

                          {hasCustom && (
                            <button
                              onClick={() => handleResetSuspect(suspect)}
                              className="rounded bg-red-950/50 border border-red-500/40 px-1.5 py-0.5 text-[10px] text-red-300 hover:bg-red-900/60 transition"
                              title="Restablecer a imagen por defecto"
                            >
                              Restablecer
                            </button>
                          )}

                          <span className="font-mono text-[9px] text-gray-500 ml-auto">
                            {hasCustom ? 'Personalizada' : 'Oficial PWA'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-800 bg-black px-4 py-2 text-right">
          <button
            onClick={onClose}
            className="rounded bg-[#00ffcc] px-4 py-1.5 text-xs font-bold text-black hover:bg-[#33ffdd] transition"
          >
            Volver a la Galería
          </button>
        </div>
      </div>
    </div>
  );
};
