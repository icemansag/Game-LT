export interface Suspect {
  id: number;
  nombre: string;
  avatarTipo?: string;
  imagen: string;
  driveUrl?: string;
  altDriveUrl?: string;
  rol: string;
  texto: string;
  esCulpable: boolean;
  threatLevel?: 'CIVIL' | 'SOSPECHOSO' | 'EXTRATERRESTRE' | 'AMENAZA CRÍTICA';
  codename?: string;
}

export interface Level {
  id: number;
  nombreNivel: string;
  subtitulo?: string;
  pista: string;
  culpableId: number;
  tiempoLimite: number;
  fondo: string;
  fondoCss?: string;
  sospechosos: Suspect[];
}

export type GameStatus = 'playing' | 'level_cleared' | 'game_over' | 'victory';

export interface CustomAssetOverride {
  [imagePath: string]: string; // imagePath -> dataURL / objectURL
}
