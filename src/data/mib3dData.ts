// src/data/mib3dData.ts
import { DRIVE_ASSETS, DriveTargetKey } from '../constants/assets3d';

export interface Sospechoso3D {
  id: number;
  nombre: string;
  avatarTipo: string;
  driveKey: DriveTargetKey;
  driveUrl: string;
  rol: string;
  texto: string;
  esCulpable: boolean;
}

export interface Nivel3D {
  nombreNivel: string;
  pista: string;
  fondoUrl: string;
  sospechosos: Sospechoso3D[];
}

export function obtenerSvgAvatar3D(tipo: string): string {
  switch (tipo) {
    case 'tiffany':
      return `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="38" r="18" fill="#ffdbac"/><path d="M 30 35 Q 50 10 70 35 L 75 75 L 25 75 Z" fill="#ff69b4"/><circle cx="43" cy="38" r="3.5" fill="#000"/><circle cx="57" cy="38" r="3.5" fill="#000"/><rect x="32" y="65" width="36" height="28" rx="6" fill="#da70d6"/><rect x="42" y="52" width="16" height="14" fill="#fff"/><text x="43" y="62" font-size="7.5" fill="#000" font-weight="bold">E=mc²</text></svg>`;
    case 'mafioso':
      return `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="38" r="18" fill="#1a1a1a"/><polygon points="30,28 70,28 65,48 35,48" fill="#ff0055"/><circle cx="42" cy="38" r="4.5" fill="#00ffcc"/><circle cx="58" cy="38" r="4.5" fill="#00ffcc"/><rect x="28" y="58" width="44" height="35" rx="10" fill="#220022"/><path d="M 40 70 L 60 70 L 50 85 Z" fill="#ff0055"/></svg>`;
    case 'guardia':
      return `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="38" r="18" fill="#e0ac69"/><rect x="30" y="24" width="40" height="12" fill="#1e3f66"/><rect x="30" y="60" width="40" height="35" rx="8" fill="#1e3f66"/><circle cx="50" cy="72" r="4" fill="#ffd700"/></svg>`;
    case 'taxista':
      return `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="38" r="18" fill="#d9b382"/><rect x="35" y="24" width="30" height="10" fill="#ffcc00"/><rect x="30" y="60" width="40" height="35" rx="8" fill="#333"/></svg>`;
    case 'mesero':
      return `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="38" r="18" fill="#e0ac69"/><rect x="30" y="60" width="40" height="35" rx="8" fill="#111"/><polygon points="45,60 55,60 58,80 42,80" fill="#fff"/></svg>`;
    case 'ciclista':
      return `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="38" r="18" fill="#e0ac69"/><rect x="32" y="60" width="36" height="35" rx="8" fill="#ff1493"/></svg>`;
    case 'profe':
      return `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="38" r="18" fill="#333"/><ellipse cx="50" cy="40" rx="12" ry="14" fill="#fff"/><circle cx="45" cy="38" r="2" fill="#000"/><circle cx="55" cy="38" r="2" fill="#000"/><rect x="30" y="60" width="40" height="35" rx="8" fill="#800000"/></svg>`;
    case 'chica':
      return `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="40" r="18" fill="#f5d0b1"/><path d="M 25 30 Q 50 10 75 30 L 70 36 L 30 36 Z" fill="#e6b800"/><rect x="32" y="62" width="36" height="30" rx="8" fill="#cc6600"/><rect x="42" y="70" width="16" height="15" fill="#fff"/></svg>`;
    case 'observador':
      return `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="38" r="18" fill="#d9b382"/><rect x="34" y="44" width="32" height="22" rx="4" fill="#333"/><circle cx="50" cy="55" r="7" fill="#111"/><circle cx="50" cy="55" r="4" fill="#00ffcc"/><rect x="30" y="68" width="40" height="30" rx="8" fill="#222"/></svg>`;
    case 'rachel':
      return `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="38" r="18" fill="#f5d0b1"/><path d="M 32 30 Q 50 15 68 30" fill="#8b4513"/><rect x="30" y="60" width="40" height="35" rx="8" fill="#9932cc"/><rect x="65" y="70" width="12" height="18" fill="#ff69b4"/></svg>`;
    default:
      return `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="38" r="18" fill="#d9b382"/><rect x="30" y="60" width="40" height="35" rx="8" fill="#444"/></svg>`;
  }
}

// --- NIVELES CONFIGURADOS CON TUS DRIVE_ASSETS (EXACTAMENTE 1 CULPABLE POR CASO) ---
export const NIVELES_3D: Nivel3D[] = [
  {
    nombreNivel: 'CASO 1/6',
    pista: 'Galería 1: Callejón Central. Identifica la amenaza infiltrada.',
    fondoUrl: DRIVE_ASSETS.levels.level1,
    sospechosos: [
      { id: 1, nombre: 'Chica', avatarTipo: 'chica', driveKey: 'chica', driveUrl: DRIVE_ASSETS.targets.chica, rol: 'Turista con mapa', texto: 'Estoy buscando la estación de metro más cercana...', esCulpable: false },
      { id: 2, nombre: 'Taxista', avatarTipo: 'taxista', driveKey: 'taxista', driveUrl: DRIVE_ASSETS.targets.taxista, rol: 'Esperando pasaje', texto: '¿Necesita un taxi para salir del callejón, Agente?', esCulpable: false },
      { id: 3, nombre: 'Mesero', avatarTipo: 'mesero', driveKey: 'mesero', driveUrl: DRIVE_ASSETS.targets.mesero, rol: 'Llevando café', texto: 'Tengo turno nocturno en la cafetería.', esCulpable: false },
      { id: 4, nombre: 'Guardia', avatarTipo: 'guardia', driveKey: 'guardia', driveUrl: DRIVE_ASSETS.targets.guardia, rol: 'Seguridad urbana', texto: 'Ronda rutinaria, todo despejado en este sector.', esCulpable: false },
      { id: 5, nombre: 'Observador', avatarTipo: 'observador', driveKey: 'observador', driveUrl: DRIVE_ASSETS.targets.observador, rol: 'Mirando la calle', texto: 'Solo aprecio las luces nocturnas de la ciudad.', esCulpable: false },
      { id: 6, nombre: 'Sujeto Mafioso', avatarTipo: 'mafioso', driveKey: 'mafioso', driveUrl: DRIVE_ASSETS.targets.mafioso, rol: 'Amenaza Hostil', texto: '¡Jajaja! ¡Apártate novato, o no verás el amanecer en este callejón!', esCulpable: true },
    ],
  },
  {
    nombreNivel: 'CASO 2/6',
    pista: 'Galería 2: Parque Nocturno. Un blanco esconde tecnología prohibida.',
    fondoUrl: DRIVE_ASSETS.levels.level2,
    sospechosos: [
      { id: 1, nombre: 'Ciclista', avatarTipo: 'ciclista', driveKey: 'ciclista', driveUrl: DRIVE_ASSETS.targets.ciclista, rol: 'Repartidor veloz', texto: 'Tengo tres minutos para entregar este encargo.', esCulpable: false },
      { id: 2, nombre: 'Profe', avatarTipo: 'profe', driveKey: 'profe', driveUrl: DRIVE_ASSETS.targets.profe, rol: 'Docente nocturno', texto: 'Repasando apuntes antes de volver a casa.', esCulpable: false },
      { id: 3, nombre: 'Rachel', avatarTipo: 'rachel', driveKey: 'rachel', driveUrl: DRIVE_ASSETS.targets.rachel, rol: 'Agente Extraterrestre', texto: '¡Nadie sospecharía de una chica elegante en este parque! ¡Iniciando detonador!', esCulpable: true },
      { id: 4, nombre: 'Observador', avatarTipo: 'observador', driveKey: 'observador', driveUrl: DRIVE_ASSETS.targets.observador, rol: 'En el banco', texto: 'Disfrutando de la tranquilidad de la noche.', esCulpable: false },
      { id: 5, nombre: 'Chica', avatarTipo: 'chica', driveKey: 'chica', driveUrl: DRIVE_ASSETS.targets.chica, rol: 'Esperando amiga', texto: 'Quedé aquí a las 3:00 AM para ir a la terminal.', esCulpable: false },
      { id: 6, nombre: 'Taxista', avatarTipo: 'taxista', driveKey: 'taxista', driveUrl: DRIVE_ASSETS.targets.taxista, rol: 'Detenido en cruce', texto: 'Esperando la luz verde del semáforo.', esCulpable: false },
    ],
  },
  {
    nombreNivel: 'CASO 3/6',
    pista: 'Galería 3: Azotea Industrial. Vigila las transmisiones no autorizadas.',
    fondoUrl: DRIVE_ASSETS.levels.level3,
    sospechosos: [
      { id: 1, nombre: 'Guardia', avatarTipo: 'guardia', driveKey: 'guardia', driveUrl: DRIVE_ASSETS.targets.guardia, rol: 'Vigilante de antena', texto: 'Comprobando los candados del acceso al tejado.', esCulpable: false },
      { id: 2, nombre: 'Mesero', avatarTipo: 'mesero', driveKey: 'mesero', driveUrl: DRIVE_ASSETS.targets.mesero, rol: 'Descanso de personal', texto: 'Tomando el aire en la terraza tras el servicio.', esCulpable: false },
      { id: 3, nombre: 'Profe', avatarTipo: 'profe', driveKey: 'profe', driveUrl: DRIVE_ASSETS.targets.profe, rol: 'Aficionado a estrellas', texto: 'Alineando mi pequeño telescopio con Orión.', esCulpable: false },
      { id: 4, nombre: 'Observador', avatarTipo: 'observador', driveKey: 'observador', driveUrl: DRIVE_ASSETS.targets.observador, rol: 'Espía Galáctico', texto: '¡Transmitiendo coordenadas de la base MIB a la flota invasora!', esCulpable: true },
      { id: 5, nombre: 'Ciclista', avatarTipo: 'ciclista', driveKey: 'ciclista', driveUrl: DRIVE_ASSETS.targets.ciclista, rol: 'Entrenando subidas', texto: 'Esta rampa siempre me deja sin aliento.', esCulpable: false },
      { id: 6, nombre: 'Chica', avatarTipo: 'chica', driveKey: 'chica', driveUrl: DRIVE_ASSETS.targets.chica, rol: 'Fotografiando luna', texto: 'La vista desde aquí arriba es impresionante.', esCulpable: false },
    ],
  },
  {
    nombreNivel: 'CASO 4/6',
    pista: 'Galería 4: Distrito Eléctrico. Se transporta contrabando de plasma.',
    fondoUrl: DRIVE_ASSETS.levels.level4,
    sospechosos: [
      { id: 1, nombre: 'Taxista', avatarTipo: 'taxista', driveKey: 'taxista', driveUrl: DRIVE_ASSETS.targets.taxista, rol: 'Revisando ruedas', texto: 'Creo que tengo un neumático bajo de presión.', esCulpable: false },
      { id: 2, nombre: 'Ciclista', avatarTipo: 'ciclista', driveKey: 'ciclista', driveUrl: DRIVE_ASSETS.targets.ciclista, rol: 'Contrabandista Ilegal', texto: '¡Llevo un núcleo de plasma de antimateria en la mochila! ¡Abran paso!', esCulpable: true },
      { id: 3, nombre: 'Rachel', avatarTipo: 'rachel', driveKey: 'rachel', driveUrl: DRIVE_ASSETS.targets.rachel, rol: 'Paseando al perro', texto: 'Mi mascota no podía dormir y salimos a caminar.', esCulpable: false },
      { id: 4, nombre: 'Guardia', avatarTipo: 'guardia', driveKey: 'guardia', driveUrl: DRIVE_ASSETS.targets.guardia, rol: 'Control de paso', texto: 'Todo en orden por la subestación eléctrica.', esCulpable: false },
      { id: 5, nombre: 'Mesero', avatarTipo: 'mesero', driveKey: 'mesero', driveUrl: DRIVE_ASSETS.targets.mesero, rol: 'Cerrando puertas', texto: 'Guardando los toldos del local.', esCulpable: false },
      { id: 6, nombre: 'Observador', avatarTipo: 'observador', driveKey: 'observador', driveUrl: DRIVE_ASSETS.targets.observador, rol: 'Buscando llaves', texto: 'Se me cayeron las llaves junto a la farola.', esCulpable: false },
    ],
  },
  {
    nombreNivel: 'CASO 5/6',
    pista: 'Galería 5: Estación Subterránea. El cerebro del ataque se oculta aquí.',
    fondoUrl: DRIVE_ASSETS.levels.level5,
    sospechosos: [
      { id: 1, nombre: 'Chica', avatarTipo: 'chica', driveKey: 'chica', driveUrl: DRIVE_ASSETS.targets.chica, rol: 'En el cajero', texto: 'Solo retiraba efectivo para el viaje de mañana.', esCulpable: false },
      { id: 2, nombre: 'Mesero', avatarTipo: 'mesero', driveKey: 'mesero', driveUrl: DRIVE_ASSETS.targets.mesero, rol: 'Esperando el metro', texto: 'El último tren ya debería haber pasado.', esCulpable: false },
      { id: 3, nombre: 'Profe', avatarTipo: 'profe', driveKey: 'profe', driveUrl: DRIVE_ASSETS.targets.profe, rol: 'Cabecilla Hostil', texto: '¡El plan para sabotear el sistema de defensa MIB está listo! ¡Nadie me detendrá!', esCulpable: true },
      { id: 4, nombre: 'Sujeto Mafioso', avatarTipo: 'mafioso', driveKey: 'mafioso', driveUrl: DRIVE_ASSETS.targets.mafioso, rol: 'Ex-esbirro desarmado', texto: '¡Yo ya cumplí mi condena, Agente! No porto armas.', esCulpable: false },
      { id: 5, nombre: 'Taxista', avatarTipo: 'taxista', driveKey: 'taxista', driveUrl: DRIVE_ASSETS.targets.taxista, rol: 'Tomando café', texto: 'Una pausa rápida antes de la última carrera.', esCulpable: false },
      { id: 6, nombre: 'Guardia', avatarTipo: 'guardia', driveKey: 'guardia', driveUrl: DRIVE_ASSETS.targets.guardia, rol: 'Cerrando torniquetes', texto: 'Cierre de estación en diez minutos.', esCulpable: false },
    ],
  },
  {
    nombreNivel: 'CASO 6/6 (EXAMEN FINAL MIB)',
    pista: 'PRUEBA FINAL: Analiza los blancos y toma la decisión legendaria del Agente J.',
    fondoUrl: DRIVE_ASSETS.levels.level6,
    sospechosos: [
      { id: 1, nombre: 'Profe', avatarTipo: 'profe', driveKey: 'profe', driveUrl: DRIVE_ASSETS.targets.profe, rol: 'Ensayando teatro', texto: '¡Grrr! Solo ensayo el papel de monstruo para el festival de teatro.', esCulpable: false },
      { id: 2, nombre: 'Rachel', avatarTipo: 'rachel', driveKey: 'rachel', driveUrl: DRIVE_ASSETS.targets.rachel, rol: 'Mirando escaparate', texto: 'Miraba la ropa en la tienda. ¿Es un delito tener buen gusto?', esCulpable: false },
      { id: 3, nombre: 'Niña Tiffany', avatarTipo: 'tiffany', driveKey: 'tiffany', driveUrl: DRIVE_ASSETS.targets.tiffany, rol: 'Paseando sola', texto: 'Tengo 8 años y camino sola de madrugada en el callejón con un libro de física cuántica (E=mc²)... Nada sospechoso, ¿verdad?', esCulpable: true },
      { id: 4, nombre: 'Ciclista', avatarTipo: 'ciclista', driveKey: 'ciclista', driveUrl: DRIVE_ASSETS.targets.ciclista, rol: 'Calistenia nocturna', texto: '¡Solo hago dominadas en el faro! Es mi rutina diaria.', esCulpable: false },
      { id: 5, nombre: 'Guardia', avatarTipo: 'guardia', driveKey: 'guardia', driveUrl: DRIVE_ASSETS.targets.guardia, rol: 'Patrulla final', texto: 'Área perimetral asegurada para la prueba.', esCulpable: false },
      { id: 6, nombre: 'Chica', avatarTipo: 'chica', driveKey: 'chica', driveUrl: DRIVE_ASSETS.targets.chica, rol: 'Estornudando', texto: '¡Aaa-chís! Lo siento, el polen nocturno me hace estornudar.', esCulpable: false },
    ],
  },
];

// --- MOTOR DE AUDIO SINTÉTICO (WEB AUDIO API) ---
let audioCtx: AudioContext | null = null;
let sonidoSilenciado = false;

export function silenciarAudio(silenciar: boolean) {
  sonidoSilenciado = silenciar;
}

export function estaAudioSilenciado(): boolean {
  return sonidoSilenciado;
}

export function iniciarAudioContext() {
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
}

export function reproducirSonidoSeleccion() {
  if (sonidoSilenciado) return;
  iniciarAudioContext();
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, audioCtx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  } catch {
    // Silencio seguro
  }
}

export function reproducirSonidoDisparo() {
  if (sonidoSilenciado) return;
  iniciarAudioContext();
  if (!audioCtx) return;
  try {
    const bufferSize = Math.floor(audioCtx.sampleRate * 0.18);
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1350;
    filter.Q.value = 3;

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.18);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start();
  } catch {
    // Silencio seguro
  }
}

export function reproducirSonidoError() {
  if (sonidoSilenciado) return;
  iniciarAudioContext();
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(140, audioCtx.currentTime);
    osc.frequency.setValueAtTime(80, audioCtx.currentTime + 0.14);
    gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.28);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.28);
  } catch {
    // Silencio seguro
  }
}

export function reproducirSonidoVictoria() {
  if (sonidoSilenciado) return;
  iniciarAudioContext();
  if (!audioCtx) return;
  try {
    const notas = [523.25, 659.25, 783.99, 1046.5];
    notas.forEach((freq, idx) => {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.12);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + idx * 0.12 + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + idx * 0.12);
      osc.stop(audioCtx.currentTime + idx * 0.12 + 0.25);
    });
  } catch {
    // Silencio seguro
  }
}
