// src/App.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './MIBGallery3D.css';
import { StartScreen } from './components/StartScreen';
import { DRIVE_ASSETS } from './constants/assets3d';
import { sounds } from './soundManager';
import {
  NIVELES_3D,
  Sospechoso3D,
  obtenerSvgAvatar3D,
} from './data/mib3dData';
import { extractDriveId } from './utils/driveHelper';

type Dificultad = 'facil' | 'medio' | 'dificil';
type Idioma = 'es' | 'en';

const inGameI18n = {
  es: {
    analizarPista: 'Analiza los 6 objetivos de Drive. Solo uno es la amenaza...',
    rotando: 'Rotando objetivos en la galería de tiro...',
    objetivosFijados: 'Objetivos fijados. Localiza al único culpable.',
    tiempoAgotado: '¡Se agotó el tiempo de evaluación táctica!',
    seleccionaPrimero: '¡Selecciona primero a un objetivo antes de disparar!',
    inocenteAbatido: '¡Inocente abatido! {nombre} no era la amenaza.',
    error: '¡ERROR!',
    vidasRestantes: 'Vidas restantes:',
    amenazaNeutralizada: '¡AMENAZA NEUTRALIZADA!',
    paseConcedido: '¡Correcto! Neutralizaste la amenaza ({nombre}). Pase concedido (+{pts} pts).',
    totalAcumulado: 'Total acumulado:',
    siguienteGaleria: 'Siguiente Galería [Espacio]',
    suspendido: '¡SUSPENDIDO!',
    falladoPrueba: 'has fallado la prueba de tiro MIB.',
    puntuacionGuardada: 'Puntuación guardada:',
    repetirExamen: 'Repetir Examen [Espacio]',
    menuPrincipal: 'Menú Principal',
    examenAprobado: '¡EXAMEN MIB APROBADO!',
    tiffanyGrito: '¡¡NO ES POSIBLE... CÓMO ME VISTE!!',
    tiffanyVoz: '(La voz de Tiffany cambia a rugido alienígena)',
    jQuote: '“Niña blanca de 8 años en medio del callejón con un libro de física cuántica... ¡Esa iba a armarla!” Excelente deducción, {nombre}.',
    calificacion: 'Calificación: AGENTE ESPECIAL CLASE A ({puntuacion} PTS)',
    nuevoExamen: 'Nuevo Examen [Espacio]',
    rotarManual: '🔄 Siguiente Ronda (Manual)',
    disparar: '¡Disparar Neuralizador!',
    soloUnoAmenaza: '¡SOLO 1 ES LA AMENAZA!',
    bienvenido: 'Bienvenido {nombre}. Localiza al único culpable en la galería.',
  },
  en: {
    analizarPista: 'Analyze the 6 Drive targets. Only one is the threat...',
    rotando: 'Rotating targets in the shooting gallery...',
    objetivosFijados: 'Targets locked. Identify the only guilty suspect.',
    tiempoAgotado: 'Tactical evaluation time expired!',
    seleccionaPrimero: 'Select a target first before firing!',
    inocenteAbatido: 'Civilian hit! {nombre} was not the threat.',
    error: 'ERROR!',
    vidasRestantes: 'Remaining lives:',
    amenazaNeutralizada: 'THREAT NEUTRALIZED!',
    paseConcedido: 'Correct! You neutralized the threat ({nombre}). Access granted (+{pts} pts).',
    totalAcumulado: 'Total score:',
    siguienteGaleria: 'Next Gallery [Space]',
    suspendido: 'MISSION FAILED!',
    falladoPrueba: 'you failed the MIB shooting evaluation.',
    puntuacionGuardada: 'Saved score:',
    repetirExamen: 'Retry Exam [Space]',
    menuPrincipal: 'Main Menu',
    examenAprobado: 'MIB EXAM PASSED!',
    tiffanyGrito: 'IMPOSSIBLE... HOW DID YOU SPOT ME?!',
    tiffanyVoz: '(Tiffany’s voice shifts into an alien roar)',
    jQuote: '“8-year-old white girl in the middle of the ghetto at night with quantum physics books? She about to start some shit!” Outstanding deduction, {nombre}.',
    calificacion: 'Rating: SPECIAL AGENT CLASS A ({puntuacion} PTS)',
    nuevoExamen: 'New Exam [Space]',
    rotarManual: '🔄 Next Round (Manual)',
    disparar: 'Shoot Neuralyzer!',
    soloUnoAmenaza: 'ONLY 1 IS THE THREAT!',
    bienvenido: 'Welcome {nombre}. Identify the single culprit in the gallery.',
  },
};

export default function App() {
  const [gameState, setGameState] = useState<'start' | 'playing'>('start');
  const [lang, setLang] = useState<Idioma>('es');
  const [playerInfo, setPlayerInfo] = useState<{ name: string; difficulty: Dificultad }>({
    name: '',
    difficulty: 'medio',
  });

  const [nivelActual, setNivelActual] = useState(0);
  const [vidas, setVidas] = useState(3);
  const [tiempo, setTiempo] = useState(45);
  const [puntuacion, setPuntuacion] = useState(0);
  const [sospechosoSeleccionado, setSospechosoSeleccionado] = useState<Sospechoso3D | null>(null);
  const [slotSeleccionadoIndex, setSlotSeleccionadoIndex] = useState<number | null>(null);
  const [estaOculto, setEstaOculto] = useState(false);
  const [dialogoTexto, setDialogoTexto] = useState('');
  const [dialogoError, setDialogoError] = useState(false);
  const [flashVisible, setFlashVisible] = useState(false);
  const [disparandoLaser, setDisparandoLaser] = useState(false);
  const [silenciado, setSilenciado] = useState(() => !sounds.isEnabled());

  // Overlays de estado del juego
  const [gameOverVisible, setGameOverVisible] = useState(false);
  const [pasoNivelVisible, setPasoNivelVisible] = useState(false);
  const [pasoTexto, setPasoTexto] = useState('');
  const [victoriaVisible, setVictoriaVisible] = useState(false);

  // Mira Láser
  const [miraPos, setMiraPos] = useState({ x: -100, y: -100 });
  const [miraVisible, setMiraVisible] = useState(false);
  const pantallaRef = useRef<HTMLDivElement>(null);

  const datosNivel = NIVELES_3D[nivelActual] || NIVELES_3D[0];
  const t = inGameI18n[lang];

  // Configuración según dificultad
  const obtenerConfigDificultad = useCallback((dif: Dificultad) => {
    switch (dif) {
      case 'facil':
        return { tiempoMax: 60, vidasMax: 4 };
      case 'dificil':
        return { tiempoMax: 30, vidasMax: 2 };
      case 'medio':
      default:
        return { tiempoMax: 45, vidasMax: 3 };
    }
  }, []);

  // Guardar puntuación en ranking local
  const guardarPuntuacionRanking = useCallback((puntosFinales: number) => {
    try {
      const saved = localStorage.getItem('tiffany_ranking') || localStorage.getItem('mib_ranking');
      const scores = saved ? JSON.parse(saved) : [];
      scores.push({
        name: playerInfo.name || 'Agente Anónimo',
        score: puntosFinales,
        difficulty: playerInfo.difficulty,
        date: new Date().toLocaleDateString(),
      });
      scores.sort((a: { score: number }, b: { score: number }) => b.score - a.score);
      localStorage.setItem('tiffany_ranking', JSON.stringify(scores));
    } catch (e) {
      console.error('Error al guardar ranking', e);
    }
  }, [playerInfo]);

  // Iniciar juego desde StartScreen con idioma
  const handleStartGame = (playerName: string, difficulty: Dificultad, selectedLang: Idioma = 'es') => {
    sounds.playClick();
    setLang(selectedLang);
    setPlayerInfo({ name: playerName, difficulty });
    const config = obtenerConfigDificultad(difficulty);
    setVidas(config.vidasMax);
    setTiempo(config.tiempoMax);
    setPuntuacion(0);
    setNivelActual(0);
    setSospechosoSeleccionado(null);
    setSlotSeleccionadoIndex(null);
    setGameOverVisible(false);
    setPasoNivelVisible(false);
    setVictoriaVisible(false);
    setDialogoError(false);
    setDialogoTexto(
      inGameI18n[selectedLang].bienvenido.replace('{nombre}', playerName)
    );
    setGameState('playing');
    sounds.ensureContext();
  };

  // Volver a la pantalla de inicio
  const volverAlInicio = () => {
    sounds.playClick();
    sounds.stopTensionMusic();
    setGameOverVisible(false);
    setPasoNivelVisible(false);
    setVictoriaVisible(false);
    setGameState('start');
  };

  // Alternar idioma
  const toggleIdioma = () => {
    sounds.playClick();
    setLang((prev) => (prev === 'es' ? 'en' : 'es'));
  };

  // Control de silencio
  const toggleSilencio = useCallback(() => {
    const enabled = sounds.toggleSound();
    setSilenciado(!enabled);
  }, []);

  // Control de la mira táctil / ratón
  const moverMira = useCallback((clientX: number, clientY: number, esTactil = false) => {
    sounds.ensureContext();
    if (!pantallaRef.current) return;
    const rect = pantallaRef.current.getBoundingClientRect();
    const offsetY = esTactil ? 55 : 0;

    setMiraPos({
      x: clientX - rect.left,
      y: clientY - rect.top - offsetY,
    });
    setMiraVisible(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    moverMira(e.clientX, e.clientY, false);
  };

  const handleMouseLeave = () => {
    setMiraVisible(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      moverMira(e.touches[0].clientX, e.touches[0].clientY, true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      moverMira(e.touches[0].clientX, e.touches[0].clientY, true);
    }
  };

  const handleTouchEnd = () => {
    setTimeout(() => {
      setMiraVisible(false);
    }, 450);
  };

  // Restar vida al disparar a un inocente o agotar el tiempo
  const perderVida = useCallback((motivo: string) => {
    sounds.playError();
    setVidas(prev => {
      const nuevaVida = prev - 1;
      if (nuevaVida <= 0) {
        setGameOverVisible(true);
        guardarPuntuacionRanking(puntuacion);
        return 0;
      }
      setDialogoError(true);
      setDialogoTexto(`${t.error} ${motivo} ${t.vidasRestantes} ${nuevaVida}.`);
      return nuevaVida;
    });
    setPuntuacion(p => Math.max(0, p - 250));
  }, [puntuacion, guardarPuntuacionRanking, t]);

  // Avance manual de ronda con animación mecánica (NO automática)
  const cambiarRondaManual = useCallback(() => {
    if (gameOverVisible || pasoNivelVisible || victoriaVisible || estaOculto) return;
    sounds.playClick();

    setEstaOculto(true);
    setSospechosoSeleccionado(null);
    setSlotSeleccionadoIndex(null);
    setDialogoError(false);
    setDialogoTexto(t.rotando);

    setTimeout(() => {
      setEstaOculto(false);
      setDialogoTexto(t.objetivosFijados);
      sounds.playClick();
    }, 350);
  }, [gameOverVisible, pasoNivelVisible, victoriaVisible, estaOculto, t]);

  // Reloj regresivo táctico
  useEffect(() => {
    if (gameState !== 'playing') return;
    if (gameOverVisible || pasoNivelVisible || victoriaVisible) return;

    const config = obtenerConfigDificultad(playerInfo.difficulty);
    const intervaloReloj = setInterval(() => {
      setTiempo(prev => {
        if (prev <= 1) {
          perderVida(t.tiempoAgotado);
          return config.tiempoMax;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervaloReloj);
  }, [gameState, gameOverVisible, pasoNivelVisible, victoriaVisible, playerInfo.difficulty, perderVida, obtenerConfigDificultad, t]);

  // Cargar nivel
  const cargarNivel = useCallback((nivelIndex: number) => {
    const config = obtenerConfigDificultad(playerInfo.difficulty);
    setNivelActual(nivelIndex);
    setSospechosoSeleccionado(null);
    setSlotSeleccionadoIndex(null);
    setTiempo(config.tiempoMax);
    setDialogoError(false);
    setDialogoTexto(t.analizarPista);
    setPasoNivelVisible(false);
    setEstaOculto(false);
  }, [playerInfo.difficulty, obtenerConfigDificultad, t]);

  const siguienteNivel = () => {
    sounds.playClick();
    if (nivelActual < NIVELES_3D.length - 1) {
      cargarNivel(nivelActual + 1);
    }
  };

  const reiniciarJuego = () => {
    sounds.playClick();
    const config = obtenerConfigDificultad(playerInfo.difficulty);
    setVidas(config.vidasMax);
    setPuntuacion(0);
    setGameOverVisible(false);
    setVictoriaVisible(false);
    cargarNivel(0);
  };

  // Seleccionar blanco al tocar o hacer clic
  const seleccionar = useCallback((s: Sospechoso3D, index: number) => {
    if (estaOculto) return;

    sounds.playClick();
    setSospechosoSeleccionado(s);
    setSlotSeleccionadoIndex(index);
    setDialogoError(false);
    setDialogoTexto(`${s.nombre}: "${s.texto}"`);
  }, [estaOculto]);

  // Seleccionar por tecla numérica (1-6)
  const seleccionarPorIndice = useCallback((index: number) => {
    const s = datosNivel.sospechosos[index];
    if (s && !estaOculto) {
      seleccionar(s, index);
    }
  }, [datosNivel, estaOculto, seleccionar]);

  // Disparar Neuralizador: SOLO la imagen culpable es el pase a la siguiente ronda
  const acusarSospechoso = useCallback(() => {
    if (gameOverVisible || pasoNivelVisible || victoriaVisible || estaOculto) return;

    if (!sospechosoSeleccionado) {
      setDialogoError(true);
      setDialogoTexto(t.seleccionaPrimero);
      sounds.playError();
      return;
    }

    sounds.playLaserShot();
    setFlashVisible(true);
    setDisparandoLaser(true);

    setTimeout(() => {
      setFlashVisible(false);
      setDisparandoLaser(false);
    }, 180);

    // ¿Es el único culpable / pase de ronda?
    if (sospechosoSeleccionado.esCulpable) {
      const bonusTiempo = tiempo * 50;
      const ptsGanados = 1000 + bonusTiempo;
      const nuevaPuntuacion = puntuacion + ptsGanados;
      setPuntuacion(nuevaPuntuacion);

      setTimeout(() => {
        sounds.playHitAlien();
        if (nivelActual === NIVELES_3D.length - 1) {
          setVictoriaVisible(true);
          guardarPuntuacionRanking(nuevaPuntuacion);
        } else {
          setPasoTexto(
            t.paseConcedido.replace('{nombre}', sospechosoSeleccionado.nombre).replace('{pts}', ptsGanados.toString())
          );
          setPasoNivelVisible(true);
        }
      }, 250);
    } else {
      sounds.playError();
      perderVida(t.inocenteAbatido.replace('{nombre}', sospechosoSeleccionado.nombre));
    }
  }, [
    gameOverVisible,
    pasoNivelVisible,
    victoriaVisible,
    estaOculto,
    sospechosoSeleccionado,
    tiempo,
    nivelActual,
    puntuacion,
    perderVida,
    guardarPuntuacionRanking,
    t,
  ]);

  // Manejador integral de atajos de teclado
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Teclas 1 al 6 para apuntar al slot correspondiente
      if (['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        const slotIdx = parseInt(e.key, 10) - 1;
        seleccionarPorIndice(slotIdx);
        return;
      }

      // 'R' para rotar/asomar sospechosos manualmente
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        cambiarRondaManual();
        return;
      }

      // 'M' para silenciar/activar audio
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleSilencio();
        return;
      }

      // Espacio o Enter para disparar el Neuralizador o avanzar en overlays
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (gameOverVisible) {
          reiniciarJuego();
        } else if (pasoNivelVisible) {
          siguienteNivel();
        } else if (victoriaVisible) {
          reiniciarJuego();
        } else {
          acusarSospechoso();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    gameState,
    gameOverVisible,
    pasoNivelVisible,
    victoriaVisible,
    acusarSospechoso,
    cambiarRondaManual,
    toggleSilencio,
    seleccionarPorIndice,
  ]);

  // Si estamos en la pantalla de inicio, renderizar StartScreen
  if (gameState === 'start') {
    return (
      <StartScreen 
        onStartGame={handleStartGame} 
        backgroundUrl={DRIVE_ASSETS.levels.level1} 
      />
    );
  }

  const config = obtenerConfigDificultad(playerInfo.difficulty);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#050508] p-1 sm:p-3 overflow-hidden select-none">
      <div
        id="pantalla-juego"
        ref={pantallaRef}
        className="pantalla-juego"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* ENTORNO 3D CALLEJÓN MIB (MANTENIDO TAL CUAL CON ATMÓSFERA PROCEDURAL) */}
        <div id="callejon-fondo" className="callejon-fondo">
          {datosNivel.fondoUrl && (
            <img
              src={datosNivel.fondoUrl}
              alt="Fondo Nivel Drive"
              className="absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-screen pointer-events-none transition-opacity duration-500"
              onError={(e) => {
                const target = e.currentTarget;
                const backup = `https://drive.google.com/uc?export=view&id=${extractDriveId(datosNivel.fondoUrl)}`;
                if (target.src !== backup) {
                  target.src = backup;
                } else {
                  target.style.display = 'none';
                }
              }}
            />
          )}
          <div className="luz-neon-1" />
          <div className="luz-neon-2" />
          <div className="tuberia izq" />
          <div className="tuberia der" />
        </div>

        {/* MIRA LÁSER 3D */}
        <div
          id="mira-telescopica"
          className="mira-telescopica"
          style={{
            left: `${miraPos.x}px`,
            top: `${miraPos.y}px`,
            display: miraVisible ? 'block' : 'none',
          }}
        >
          <div className="puntero-laser" />
        </div>

        {/* RAYO LÁSER DEL NEURALIZADOR */}
        {disparandoLaser && (
          <div
            className="laser-beam"
            style={{
              height: '340px',
              left:
                slotSeleccionadoIndex !== null
                  ? `${(slotSeleccionadoIndex % 2) * 50 + 25}%`
                  : '50%',
            }}
          />
        )}

        {/* DESTELLO DEL NEURALIZADOR */}
        <div
          id="flash"
          className="flash-overlay"
          style={{ opacity: flashVisible ? 1 : 0 }}
        />

        {/* HUD SUPERIOR ESTILO MIB */}
        <div className="hud-mib">
          <div className="hud-vidas" id="hud-vidas">
            {'❤'.repeat(vidas) + '🖤'.repeat(Math.max(0, config.vidasMax - vidas))}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="hud-nivel-tag" id="hud-nivel">
              {datosNivel.nombreNivel}
            </div>
            <div className="hud-score">
              {puntuacion} PTS
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5">
            <div className="hud-tiempo" id="hud-tiempo">
              {tiempo}s
            </div>

            {/* Indicador de Agente */}
            <div className="hidden sm:block text-[10px] text-cyan-300 font-mono font-bold bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800">
              {playerInfo.name} [{playerInfo.difficulty.substring(0, 3).toUpperCase()}]
            </div>

            {/* Selector de Idioma Rápido */}
            <button
              onClick={toggleIdioma}
              className="btn-hud-icon font-bold text-[10px]"
              title="Cambiar idioma (ES/EN)"
            >
              {lang.toUpperCase()}
            </button>

            {/* Botón Salir al Menú */}
            <button
              onClick={volverAlInicio}
              className="btn-hud-icon"
              title="Volver a la pantalla de inicio"
            >
              🏠
            </button>

            {/* Botón Silencio */}
            <button
              onClick={toggleSilencio}
              className="btn-hud-icon"
              title="Silenciar / Activar sonido (M)"
            >
              {silenciado ? '🔇' : '🔊'}
            </button>
          </div>
        </div>

        {/* BANNER DE PISTA */}
        <div className="pista-box" id="pista-texto">
          {datosNivel.pista} &bull; <span className="text-red-950 font-bold">{t.soloUnoAmenaza}</span>
        </div>

        {/* REJILLA DE GALERÍA DE TIRO (6 CASILLAS CON TUS IMÁGENES DE DRIVE) */}
        <div className="escena-grid-3d" id="escena-grid">
          {datosNivel.sospechosos.map((s, index) => {
            const seleccionado = slotSeleccionadoIndex === index;

            return (
              <div key={s.id} className="casilla-3d">
                <span className="slot-badge">{index + 1}</span>
                <div
                  className={`sospechoso-3d ${!estaOculto ? 'visible' : ''} ${
                    seleccionado ? 'seleccionado' : ''
                  }`}
                  onClick={() => seleccionar(s, index)}
                >
                  <div className="avatar-container-3d">
                    <img
                      src={s.driveUrl}
                      alt={s.nombre}
                      className="avatar-imagen-drive"
                      draggable={false}
                      onError={(e) => {
                        const target = e.currentTarget;
                        const backup = `https://drive.google.com/uc?export=view&id=${extractDriveId(s.driveUrl)}`;
                        if (target.src !== backup) {
                          target.src = backup;
                        } else {
                          // Si falla Drive, respaldo automático en SVG
                          target.style.display = 'none';
                          const nextEl = target.nextElementSibling;
                          if (nextEl) {
                            (nextEl as HTMLElement).style.display = 'flex';
                          }
                        }
                      }}
                    />
                    <div
                      className="h-full w-full hidden"
                      dangerouslySetInnerHTML={{
                        __html: obtenerSvgAvatar3D(s.avatarTipo),
                      }}
                    />
                  </div>
                  <div className="info-box-3d">
                    <div className="nombre-tag-3d">{s.nombre}</div>
                    <div className="rol-tag-3d">{s.rol}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* PANEL DE DIÁLOGO INFERIOR Y ACCIONES */}
        <div className="dialogo-box-3d">
          <div
            id="texto-dialogo"
            className="texto-dialogo-3d"
            style={{ color: dialogoError ? '#ff4d4d' : '#e2e8f0' }}
          >
            {dialogoTexto}
          </div>

          <div className="controles-acciones">
            <button
              className="boton-rotar-3d"
              onClick={cambiarRondaManual}
              disabled={estaOculto}
              title="Girar dianas mecánicamente [R]"
            >
              {t.rotarManual}
            </button>
            <button
              className="boton-acusar-3d"
              onClick={acusarSospechoso}
              disabled={estaOculto}
              title="Disparar Neuralizador [Espacio / Enter]"
            >
              {t.disparar}
            </button>
          </div>
        </div>

        {/* PANTALLA GAME OVER */}
        {gameOverVisible && (
          <div className="overlay-modal" id="pantalla-gameover">
            <h2 style={{ color: '#ff4d4d' }}>{t.suspendido}</h2>
            <p style={{ fontSize: '3rem', marginBottom: '8px' }}>❌</p>
            <p style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>
              Agente <strong className="text-cyan-400">{playerInfo.name}</strong>, {t.falladoPrueba}
            </p>
            <p style={{ fontSize: '0.82rem', color: '#ffcc00', marginTop: '6px' }}>
              {t.puntuacionGuardada} {puntuacion} PTS [{playerInfo.difficulty.toUpperCase()}]
            </p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={reiniciarJuego}
                style={{ background: '#ff3333' }}
              >
                {t.repetirExamen}
              </button>
              <button
                onClick={volverAlInicio}
                style={{ background: '#334155' }}
              >
                {t.menuPrincipal}
              </button>
            </div>
          </div>
        )}

        {/* PANTALLA PASO DE NIVEL */}
        {pasoNivelVisible && (
          <div className="overlay-modal" id="pantalla-paso">
            <h2 style={{ color: '#00ffcc' }}>{t.amenazaNeutralizada}</h2>
            <p style={{ fontSize: '0.9rem', marginTop: '10px', color: '#e2e8f0' }}>
              {pasoTexto}
            </p>
            <p style={{ fontSize: '0.82rem', color: '#38bdf8', marginTop: '6px' }}>
              {t.totalAcumulado} {puntuacion} PTS
            </p>
            <button onClick={siguienteNivel}>
              {t.siguienteGaleria}
            </button>
          </div>
        )}

        {/* PANTALLA VICTORIA FINAL */}
        {victoriaVisible && (
          <div className="overlay-modal" id="pantalla-victoria">
            <h2 style={{ color: '#00ffcc' }}>{t.examenAprobado}</h2>
            <p style={{ fontSize: '1.05rem', color: '#ffcc00', marginBottom: '8px' }}>
              <strong>{t.tiffanyGrito}</strong>
            </p>
            <p style={{ fontSize: '0.78rem', color: '#aaa' }}>
              <small>{t.tiffanyVoz}</small>
            </p>
            <br />
            <p style={{ fontSize: '0.85rem', lineHeight: '1.4', color: '#e2e8f0' }}>
              {t.jQuote.replace('{nombre}', playerInfo.name)}
            </p>
            <p style={{ fontSize: '1rem', color: '#00ffcc', marginTop: '10px', fontWeight: 'bold' }}>
              {t.calificacion.replace('{puntuacion}', puntuacion.toString())}
            </p>
            <div className="flex gap-2 mt-4">
              <button onClick={reiniciarJuego}>
                {t.nuevoExamen}
              </button>
              <button 
                onClick={volverAlInicio}
                style={{ background: '#334155' }}
              >
                {t.menuPrincipal}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
