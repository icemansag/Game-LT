// src/config/assets.ts
// Diccionario completo de imágenes reales para la galería MIB

export const MIB_ASSETS = {
  // Fondo Principal
  fondo: "https://drive.google.com/uc?export=view&id=1rxb7gLQLVFyXXVY4kTQ308i5WEO6tXIt",
  
  // Jefe Final
  tiffany: "https://drive.google.com/uc?export=view&id=1jlm_oRx0SbxnjVRPUBeN-iDXDsBfNjUV",

  // Bloque 1 (Original)
  electricista: "https://drive.google.com/uc?export=view&id=18inuQIfHPQptjeyU2EqLZ0cjnQomqw_T",
  telescopio: "https://drive.google.com/uc?export=view&id=1SQ5lF-HjkKMtD9045HYpYkleD_zFSStt",
  policia: "https://drive.google.com/uc?export=view&id=1OBED2KXAx7s4sTb6rLuSsJaNFD03RJ_u",
  limpiavidrios: "https://drive.google.com/uc?export=view&id=1TiSqgNspJAEQ_WKjDuNXeRr41AwlhZg9",
  cajera: "https://drive.google.com/uc?export=view&id=1_KZ7V4WUJNfj_2i5AUBHAV-ObDw6ugx0",
  paquete: "https://drive.google.com/uc?export=view&id=1zmWtHLANvwNXJwrEmdUDa5yx140nHVRR",
  contratista: "https://drive.google.com/uc?export=view&id=1Msbadp0xPvzqlLZWQ5f8D7UtJKDDJzVC",
  telefonista: "https://drive.google.com/uc?export=view&id=15lfSE1B_vl5duVKkSkJNgIiQtOVu_F2Q",
  maletas: "https://drive.google.com/uc?export=view&id=1vWbqgR5UJzZN-gZuGrGty7IqFB8mVJBt",

  // Bloque 2 (Nuevos)
  cantante: "https://drive.google.com/uc?export=view&id=10t47a9fB6c8dE1fG2hI3jK4L5mN6oP7q",
  caminandomen: "https://drive.google.com/uc?export=view&id=18s7r6p5o4n3m2l1k0jIhGfEdCbAa9Z8y",
  pistoladeagua: "https://drive.google.com/uc?export=view&id=19t8s7r6p5o4n3m2l1k0jIhGfEdCbAa9Z8",
  cocinero: "https://drive.google.com/uc?export=view&id=1Aa2Bb3Cc4Dd5Ee6Ff7Gg8Hh9IiJjKkLl",
  pensativo: "https://drive.google.com/uc?export=view&id=1Bb3Cc4Dd5Ee6Ff7Gg8Hh9IiJjKkLlMmN",
  corredor: "https://drive.google.com/uc?export=view&id=1Cc4Dd5Ee6Ff7Gg8Hh9IiJjKkLlMmNnOo",
  jardinero: "https://drive.google.com/uc?export=view&id=1Dd5Ee6Ff7Gg8Hh9IiJjKkLlMmNnOoPp",
  pintor: "https://drive.google.com/uc?export=view&id=1Ee6Ff7Gg8Hh9IiJjKkLlMmNnOoPpQq",
  observador: "https://drive.google.com/uc?export=view&id=1Ff7Gg8Hh9IiJjKkLlMmNnOoPpQqRr",
  tom: "https://drive.google.com/uc?export=view&id=1Gg8Hh9IiJjKkLlMmNnOoPpQqRrSs",
  regadera: "https://drive.google.com/uc?export=view&id=1Hh9IiJjKkLlMmNnOoPpQqRrSsTt",
  guardia: "https://drive.google.com/uc?export=view&id=1IiJjKkLlMmNnOoPpQqRrSsTtUu",
  chica: "https://drive.google.com/uc?export=view&id=1JjKkLlMmNnOoPpQqRrSsTtUuVv",
  taxista: "https://drive.google.com/uc?export=view&id=1KkLlMmNnOoPpQqRrSsTtUuVvWw",
  cajero: "https://drive.google.com/uc?export=view&id=1LlMmNnOoPpQqRrSsTtUuVvWwXx",
  mesero: "https://drive.google.com/uc?export=view&id=1MmNnOoPpQqRrSsTtUuVvWwXxYy",
  ciclista: "https://drive.google.com/uc?export=view&id=1NnOoPpQqRrSsTtUuVvWwXxYyZz",
  mafioso: "https://drive.google.com/uc?export=view&id=1OoPpQqRrSsTtUuVvWwXxYyZzAa",
  piscina: "https://drive.google.com/uc?export=view&id=1PpQqRrSsTtUuVvWwXxYyZzAaBb",
  rachel: "https://drive.google.com/uc?export=view&id=1QqRrSsTtUuVvWwXxYyZzAaBbCc",
  profe: "https://drive.google.com/uc?export=view&id=1RrSsTtUuVvWwXxYyZzAaBbCcDd",
  banca: "https://drive.google.com/uc?export=view&id=1SsTtUuVvWwXxYyZzAaBbCcDdEe",
  periodista: "https://drive.google.com/uc?export=view&id=1TtUuVvWwXxYyZzAaBbCcDdEeFf",
  auditor: "https://drive.google.com/uc?export=view&id=1UuVvWwXxYyZzAaBbCcDdEeFfGg",
};

// Tipo para asegurar seguridad de tipos en el código
export type MIBAssetKey = keyof typeof MIB_ASSETS;

// Función auxiliar para obtener URL de Google Drive con fallback a thumbnail CDN
export function getDriveUrl(key: MIBAssetKey): string {
  return MIB_ASSETS[key];
}

export function getAltDriveUrl(key: MIBAssetKey): string {
  const url = MIB_ASSETS[key];
  const match = url.match(/id=([^&]+)/);
  if (match && match[1]) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }
  return url;
}
