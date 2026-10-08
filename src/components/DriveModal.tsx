// src/components/DriveModal.tsx
import React, { useState } from 'react';
import { MIB_ASSETS } from '../config/assets';
import {
  extractDriveId,
  getDriveCdnUrl,
  getCustomDriveAssets,
  saveCustomDriveAsset,
} from '../utils/driveHelper';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAssetsUpdated: () => void;
}

export const DriveModal: React.FC<Props> = ({ isOpen, onClose, onAssetsUpdated }) => {
  const [tab, setTab] = useState<'individual' | 'masivo'>('individual');
  const [customAssets, setCustomAssets] = useState<Record<string, string>>(() => getCustomDriveAssets());
  const [selectedKey, setSelectedKey] = useState<string>('tiffany');
  const [inputUrl, setInputUrl] = useState<string>('');
  const [bulkText, setBulkText] = useState<string>('');
  const [mensajeGuardado, setMensajeGuardado] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentSource = customAssets[selectedKey] || (MIB_ASSETS as Record<string, string>)[selectedKey] || '';
  const currentId = extractDriveId(currentSource);
  const currentPreviewUrl = currentId ? getDriveCdnUrl(currentId) : '';

  const handleGuardarIndividual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    saveCustomDriveAsset(selectedKey, inputUrl.trim());
    const updated = getCustomDriveAssets();
    setCustomAssets(updated);
    setInputUrl('');
    setMensajeGuardado(`¡Imagen de "${selectedKey}" actualizada correctamente!`);
    onAssetsUpdated();

    setTimeout(() => {
      setMensajeGuardado(null);
    }, 2500);
  };

  const handleGuardarMasivo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkText.trim()) return;

    // Detectar líneas o comas
    const lineas = bulkText.split(/[\n,]+/).map((l) => l.trim()).filter(Boolean);
    const listaClaves = Object.keys(MIB_ASSETS);
    let asignados = 0;

    lineas.forEach((linea, index) => {
      // Formato "clave: enlace" o solo enlace
      let clave = listaClaves[index];
      let url = linea;

      if (linea.includes(':')) {
        const parts = linea.split(':');
        const candidateKey = parts[0].trim().toLowerCase();
        if (listaClaves.includes(candidateKey)) {
          clave = candidateKey;
          url = parts.slice(1).join(':').trim();
        }
      }

      if (clave && url) {
        saveCustomDriveAsset(clave, url);
        asignados++;
      }
    });

    const updated = getCustomDriveAssets();
    setCustomAssets(updated);
    setBulkText('');
    setMensajeGuardado(`¡${asignados} enlaces procesados y guardados con éxito!`);
    onAssetsUpdated();

    setTimeout(() => {
      setMensajeGuardado(null);
    }, 3000);
  };

  const handleRestaurar = (key: string) => {
    saveCustomDriveAsset(key, '');
    const updated = getCustomDriveAssets();
    setCustomAssets(updated);
    onAssetsUpdated();
  };

  const listaClaves = Object.keys(MIB_ASSETS);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col rounded-xl border-2 border-[#00ffcc] bg-[#0c1017] p-4 text-white shadow-2xl shadow-[#00ffcc]/20 overflow-y-auto">
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-[#00ffcc]/30 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📁</span>
            <h3 className="font-mono text-base sm:text-lg font-bold tracking-wide text-[#00ffcc]">
              CONFIGURAR GOOGLE DRIVE
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded px-2 py-1 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Pestañas de modo */}
        <div className="mt-3 flex gap-2 border-b border-gray-800 pb-2">
          <button
            onClick={() => setTab('individual')}
            className={`rounded px-3 py-1.5 text-xs font-bold transition ${
              tab === 'individual'
                ? 'bg-[#00ffcc] text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            🎯 Asignar Imagen por Personaje
          </button>
          <button
            onClick={() => setTab('masivo')}
            className={`rounded px-3 py-1.5 text-xs font-bold transition ${
              tab === 'masivo'
                ? 'bg-[#00ffcc] text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            📋 Pegado Masivo de Enlaces
          </button>
        </div>

        {/* Aviso de carpeta */}
        <div className="my-3 rounded-lg border border-yellow-500/30 bg-yellow-950/20 p-2.5 text-xs text-yellow-200">
          <strong className="text-yellow-400">💡 Nota sobre las carpetas de Google Drive:</strong>
          <p className="mt-1 text-gray-300">
            Una URL de carpeta (ej. <code>/drive/folders/...</code>) agrupa varios archivos. Para mostrarlos en el juego:
          </p>
          <ol className="mt-1 list-decimal pl-4 space-y-0.5 text-gray-300">
            <li>Asegúrate de que la carpeta esté en <strong>«Cualquier persona con el enlace»</strong> (Lector).</li>
            <li>Copia los enlaces de las imágenes de dentro (clic derecho &rarr; <em>Compartir &rarr; Copiar enlace</em>) y pégalos aquí abajo.</li>
          </ol>
        </div>

        {/* Pestaña Individual */}
        {tab === 'individual' && (
          <form onSubmit={handleGuardarIndividual} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Selecciona a qué personaje asignar la imagen:
              </label>
              <select
                value={selectedKey}
                onChange={(e) => {
                  setSelectedKey(e.target.value);
                  setInputUrl('');
                }}
                className="w-full rounded border border-[#00ffcc]/40 bg-[#161c28] p-2 text-xs text-white focus:border-[#00ffcc] focus:outline-none"
              >
                <option value="fondo">🌆 Fondo del Callejón (fondo)</option>
                <option value="tiffany">⭐ JEFE FINAL: Niña Tiffany (tiffany)</option>
                <optgroup label="Sospechosos y Civiles">
                  {listaClaves
                    .filter((k) => k !== 'fondo' && k !== 'tiffany')
                    .map((k) => (
                      <option key={k} value={k}>
                        👤 {k.toUpperCase()}
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Enlace de la imagen en Google Drive o ID del archivo:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://drive.google.com/file/d/1aB2c.../view"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="flex-1 rounded border border-gray-700 bg-[#161c28] p-2 text-xs text-white placeholder-gray-500 focus:border-[#00ffcc] focus:outline-none font-mono"
                />
                <button
                  type="submit"
                  className="rounded bg-[#00ffcc] px-3.5 py-2 text-xs font-bold text-black hover:bg-[#00ffcc]/80 transition"
                >
                  Guardar
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Pestaña Masiva */}
        {tab === 'masivo' && (
          <form onSubmit={handleGuardarMasivo} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Pega tus enlaces de Google Drive (uno por línea):
              </label>
              <textarea
                rows={6}
                placeholder={`fondo: https://drive.google.com/file/d/ID_FONDO/view\ntiffany: https://drive.google.com/file/d/ID_TIFFANY/view\nelectricista: https://drive.google.com/file/d/ID_1/view\nguardia: https://drive.google.com/file/d/ID_2/view\n(o simplemente pega los enlaces uno por línea)`}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                className="w-full rounded border border-gray-700 bg-[#161c28] p-2 text-xs text-white placeholder-gray-500 focus:border-[#00ffcc] focus:outline-none font-mono"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded bg-[#00ffcc] py-2 text-xs font-bold text-black hover:bg-[#00ffcc]/80 transition"
            >
              Guardar Todos los Enlaces
            </button>
          </form>
        )}

        {mensajeGuardado && (
          <div className="mt-3 rounded bg-green-900/40 border border-green-500/50 p-2 text-xs text-green-300 text-center font-semibold">
            {mensajeGuardado}
          </div>
        )}

        {/* Vista previa actual */}
        <div className="mt-3 flex items-center gap-3 rounded-lg border border-gray-800 bg-[#10141d] p-2.5">
          <div className="h-16 w-16 overflow-hidden rounded border border-gray-700 bg-black flex items-center justify-center flex-shrink-0">
            {currentPreviewUrl ? (
              <img
                src={currentPreviewUrl}
                alt={selectedKey}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://via.placeholder.com/150/000000/00ffcc?text=Drive+Img';
                }}
              />
            ) : (
              <span className="text-[10px] text-gray-500">Sin vista previa</span>
            )}
          </div>
          <div className="flex-1 min-w-0 text-xs">
            <div className="font-bold text-white capitalize">{selectedKey}</div>
            <div className="text-[11px] text-gray-400 truncate font-mono">
              ID: {currentId || 'Original del sistema'}
            </div>
            {customAssets[selectedKey] && (
              <button
                onClick={() => handleRestaurar(selectedKey)}
                className="mt-1 text-[11px] text-red-400 underline hover:text-red-300"
              >
                Restaurar enlace por defecto
              </button>
            )}
          </div>
        </div>

        {/* Botón de cierre */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded bg-gray-800 px-4 py-1.5 text-xs font-semibold text-white hover:bg-gray-700"
          >
            Cerrar y Jugar
          </button>
        </div>
      </div>
    </div>
  );
};
