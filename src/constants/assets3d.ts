// src/constants/assets3d.ts

export const DRIVE_ASSETS = {
  // Fondos / Niveles 3D
  levels: {
    level1: "https://lh3.googleusercontent.com/d/1qNJLPZYwQFMTj2mlHqaaDfzhusYjmQdL", // mapa.jpg
    level2: "https://lh3.googleusercontent.com/d/1R0h6MH-NE-69i5Rl9HcPKVdIazE2ArA5", // piscina.jpg
    level3: "https://lh3.googleusercontent.com/d/1SQ5lF-HjkKMtD9045HYpYkleD_zFSStt", // telescopio.jpg
    level4: "https://lh3.googleusercontent.com/d/18inuQIfHPQptjeyU2EqLZ0cjnQomqw_T", // electricista .jpg
    level5: "https://lh3.googleusercontent.com/d/1ntp1G4u1qaUsDGMGhSJGmyC0wzxq_vOP", // cajero.jpg
    level6: "https://lh3.googleusercontent.com/d/1jlm_oRx0SbxnjVRPUBeN-iDXDsBfNjUV", // Tifany.jpg
  },
  // Objetivos / Personajes 3D en la galería de tiro
  targets: {
    tiffany: "https://lh3.googleusercontent.com/d/1jlm_oRx0SbxnjVRPUBeN-iDXDsBfNjUV",
    profe: "https://lh3.googleusercontent.com/d/1p9vUzJ77BeZ0YmzbT-B01afzV81KW6I4",
    rachel: "https://lh3.googleusercontent.com/d/1Cbj9KXv12OHWQReqOGAFScHgtIKUVx14",
    mafioso: "https://lh3.googleusercontent.com/d/1AwjG82TLgcKbeL1MuHbwqQeu9uO7-1FW",
    ciclista: "https://lh3.googleusercontent.com/d/1rlWJ7ideRpCcTYat1r9HGhAR70kje2kG",
    mesero: "https://lh3.googleusercontent.com/d/1M59gCOjehYtXQJVwrS29nsGewMfO4IA_",
    taxista: "https://lh3.googleusercontent.com/d/173AprF60yhOa4690u_sq8lQSrlG3xLJZ",
    chica: "https://lh3.googleusercontent.com/d/1dJ99yuJ4B6L9kitV5-HY_TtBN4zY17QH",
    guardia: "https://lh3.googleusercontent.com/d/1BG6g6ZUZ5kMnL3VQ3dykj93ZhO26vX_J",
    observador: "https://lh3.googleusercontent.com/d/1J7Q55Hg896bpjv9fxvk84McdDNWAxNq_"
  }
};

export type DriveTargetKey = keyof typeof DRIVE_ASSETS.targets;
export type DriveLevelKey = keyof typeof DRIVE_ASSETS.levels;
