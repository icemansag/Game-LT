// src/components/TargetGrid.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './TargetGrid.css';
import { MIB_ASSETS, MIBAssetKey, getAltDriveUrl } from '../config/assets';
import { assetManager } from '../utils/assetManager';
import { mibAudio } from '../utils/audio';

export interface EscenaSospechoso {
  id: number;
  assetKey: MIBAssetKey;
  esCulpable: boolean;
}

export interface Props {
  vidas?: number;
  nivelActual: number;
  perderVida: (motivo: string) => void;
  acertarBlanco: (esTiffany: boolean) => void;
  onSelectBlanco?: (blanco: EscenaSospechoso | null) => void;
  shootTriggerRef?: React.MutableRefObject<(() => void) | null>;
  // Props de compatibilidad
  suspects?: any[];
  visibleIndices?: Set<number>;
  selectedSuspect?: any;
  onSelectSuspect?: (suspect: any) => void;
}

export const TargetGrid: React.FC<Props> = ({
  vidas = 3,
  nivelActual,
  perderVida,
  acertarBlanco,
  onSelectBlanco,
  shootTriggerRef,
}) => {
  const [blancosEnEscena, setBlancosEnEscena] = useState<EscenaSospechoso[]>([]);
  const [idSeleccionado, setIdSeleccionado] = useState<number | null>(null);
  const [estaOculto, setEstaOculto] = useState<boolean>(false);

  const blancosEnEscenaRef = useRef<EscenaSospechoso[]>([]);
  const idSeleccionadoRef = useRef<number | null>(null);
  const estaOcultoRef = useRef<boolean>(false);

  blancosEnEscenaRef.current = blancosEnEscena;
  idSeleccionadoRef.current = idSeleccionado;
  estaOcultoRef.current = estaOculto;

  // Extraer claves de MIB_ASSETS (excluyendo 'fondo')
  const clavesDisponibles = useRef(
    Object.keys(MIB_ASSETS).filter(key => key !== 'fondo') as MIBAssetKey[]
  ).current;

  // Fallback escalonado en caso de restricciones de red con Google Drive
  const handleImageFallback = (e: React.SyntheticEvent<HTMLImageElement, Event>, key: MIBAssetKey) => {
    const imgEl = e.currentTarget;
    const altUrl = getAltDriveUrl(key);
    const localUrl = assetManager.resolveImageSrc(`imagenes/${key}.jpg`);

    if (imgEl.src !== altUrl) {
      imgEl.src = altUrl;
    } else if (imgEl.src !== localUrl) {
      imgEl.src = localUrl;
    }
  };

  // Función para generar exactamente 6 elementos únicos sin repetir
  const generarRondaUnica = useCallback(() => {
    const mezcladas = [...clavesDisponibles].sort(() => Math.random() - 0.5);
    const seleccionados = mezcladas.slice(0, 6); // Tomamos 6 únicos de la baraja

    return seleccionados.map((assetKey, idx) => ({
      id: idx,
      assetKey,
      esCulpable: assetKey === 'tiffany',
    }));
  }, [clavesDisponibles]);

  // Rotación manual controlada con efecto mecánico
  const cambiarRondaManual = () => {
    if (estaOculto) return;
    setEstaOculto(true);
    setIdSeleccionado(null);
    if (onSelectBlanco) onSelectBlanco(null);

    setTimeout(() => {
      setBlancosEnEscena(generarRondaUnica());
      setEstaOculto(false);
    }, 400);
  };

  // Inicializar la primera ronda al montar
  useEffect(() => {
    setBlancosEnEscena(generarRondaUnica());
  }, [nivelActual, generarRondaUnica]);

  const seleccionarBlanco = (blanco: EscenaSospechoso) => {
    if (estaOculto) return;

    mibAudio.playTargetSelect();
    setIdSeleccionado(blanco.id);
    if (onSelectBlanco) {
      onSelectBlanco(blanco);
    }

    if (blanco.esCulpable) {
      acertarBlanco(true);
    }
  };

  // Disparo del Neuralizador (activable por botón de mira en HUD o atajos)
  const dispararNeuralizador = useCallback(() => {
    if (estaOcultoRef.current) return;

    const selectedId = idSeleccionadoRef.current;
    if (selectedId === null) {
      perderVida('¡Selecciona un objetivo antes de disparar!');
      return;
    }

    const blanco = blancosEnEscenaRef.current.find(b => b.id === selectedId);
    if (!blanco) return;

    if (blanco.esCulpable) {
      acertarBlanco(true);
      setIdSeleccionado(null);
    } else {
      acertarBlanco(false);
      perderVida(`¡Error! Disparaste a ${blanco.assetKey}. No era la amenaza.`);
    }
  }, [acertarBlanco, perderVida]);

  useEffect(() => {
    if (shootTriggerRef) {
      shootTriggerRef.current = dispararNeuralizador;
    }
  }, [shootTriggerRef, dispararNeuralizador]);

  return (
    <div className="target-grid-container">
      {/* Cuadrícula estricta de 6 casillas */}
      <div className="escena-grid" id="escena-grid">
        {[0, 1, 2, 3, 4, 5].map(i => {
          const blanco = blancosEnEscena.find(b => b.id === i);
          const seleccionado = idSeleccionado === i;

          return (
            <div key={`casilla-${i}`} className="casilla">
              {blanco ? (
                <div
                  className={`sospechoso ${!estaOculto ? 'visible' : ''} ${seleccionado ? 'seleccionado' : ''}`}
                  onClick={() => seleccionarBlanco(blanco)}
                >
                  <div className="avatar-container">
                    <img
                      src={MIB_ASSETS[blanco.assetKey]}
                      alt={blanco.assetKey}
                      className="avatar-imagen"
                      draggable={false}
                      onError={(e) => handleImageFallback(e, blanco.assetKey)}
                    />
                  </div>
                  <div className="info-box">
                    <span className="asset-key-tag">{blanco.assetKey}</span>
                  </div>
                </div>
              ) : (
                <div className="ranura-vacia" />
              )}
            </div>
          );
        })}
      </div>

      {/* Botón de avance manual */}
      <div style={{ textAlign: 'center', marginTop: '16px', marginBottom: '4px', zIndex: 10 }}>
        <button
          onClick={cambiarRondaManual}
          disabled={estaOculto}
          style={{
            padding: '10px 20px',
            backgroundColor: estaOculto ? '#2a3b3d' : '#00ffcc',
            color: '#000',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '5px',
            cursor: estaOculto ? 'not-allowed' : 'pointer',
            boxShadow: estaOculto ? 'none' : '0 0 12px rgba(0, 255, 204, 0.4)',
            transition: 'all 0.2s ease',
          }}
        >
          🔄 Siguiente Ronda (Manual)
        </button>
      </div>
    </div>
  );
};
