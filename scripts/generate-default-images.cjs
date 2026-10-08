const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[i] = c >>> 0;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

function generateTargetPNG(name, role, isCulprit, themeColor) {
  const width = 240;
  const height = 280;
  const rawData = Buffer.alloc(height * (1 + width * 4));

  const [cr, cg, cb] = themeColor; // primary color
  const cx = width / 2;
  const cy = 110; // head/torso center

  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0;
    for (let x = 0; x < width; x++) {
      // Base dark card background #12161f
      let r = 16, g = 20, b = 28, a = 255;

      // Card border
      if (x < 3 || x >= width - 3 || y < 3 || y >= height - 3) {
        r = isCulprit ? 255 : cr;
        g = isCulprit ? 40 : cg;
        b = isCulprit ? 60 : cb;
      }

      // Cyber grid lines
      if (y % 28 === 0 || x % 24 === 0) {
        r = Math.min(255, r + 10);
        g = Math.min(255, g + 12);
        b = Math.min(255, b + 18);
      }

      // Scanline effect
      if (y % 4 === 0) {
        r = Math.max(0, r - 8);
        g = Math.max(0, g - 8);
        b = Math.max(0, b - 8);
      }

      // Target cardboard silhouette shape
      const dx = x - cx;
      const headDist = Math.sqrt(dx * dx + (y - 75) * (y - 75));
      const isHead = headDist < 35;
      const isShoulders = y >= 110 && y < 190 && Math.abs(dx) < (40 + (y - 110) * 0.7);

      if (isHead || isShoulders) {
        if (isCulprit) {
          // Alien / Menace red-amber heat silhouette
          r = 180 + Math.sin((x + y) * 0.1) * 40;
          g = 30 + Math.cos(y * 0.1) * 20;
          b = 40;

          // Alien eyes
          if (isHead && Math.abs(y - 70) < 6 && (Math.abs(dx - 12) < 6 || Math.abs(dx + 12) < 6)) {
            r = 0; g = 255; b = 255; // Glowing cyan alien eyes
          }
        } else {
          // Normal civilian cyber silhouette
          r = 30;
          g = 45;
          b = 65;

          // Civilian eye line / visor
          if (isHead && Math.abs(y - 72) < 4 && Math.abs(dx) < 18) {
            r = cr; g = cg; b = cb;
          }
        }
      }

      // Target reticle circles
      const reticleDist = Math.sqrt(dx * dx + (y - 120) * (y - 120));
      if (Math.abs(reticleDist - 70) < 1.5 || Math.abs(reticleDist - 40) < 1.2) {
        r = isCulprit ? 255 : 0;
        g = isCulprit ? 50 : 255;
        b = isCulprit ? 80 : 180;
      }

      // Threat banner at top
      if (y > 8 && y < 22 && x > 8 && x < width - 8) {
        if (isCulprit) {
          r = 220; g = 20; b = 40;
        } else {
          r = 20; g = 30; b = 45;
        }
      }

      rawData[offset++] = Math.min(255, Math.max(0, Math.floor(r)));
      rawData[offset++] = Math.min(255, Math.max(0, Math.floor(g)));
      rawData[offset++] = Math.min(255, Math.max(0, Math.floor(b)));
      rawData[offset++] = a;
    }
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdr = createChunk('IHDR', ihdrData);
  const compressed = zlib.deflateSync(rawData);
  const idat = createChunk('IDAT', compressed);
  const iend = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

const targets = [
  // Nivel 1
  { file: 'n1_1.jpeg', name: 'Peatón A', role: 'Paseando', culprit: false, color: [0, 200, 255] },
  { file: 'n1_2.jpeg', name: 'Músico', role: 'Tocando guitarra', culprit: false, color: [255, 180, 0] },
  { file: 'n1_3.jpeg', name: 'Fotógrafo', role: 'Tomando fotos', culprit: false, color: [0, 255, 180] },
  { file: 'n1_4.jpeg', name: 'Turista', role: 'Con mapa', culprit: false, color: [100, 200, 255] },
  { file: 'n1_5.jpeg', name: 'Vendedor', role: 'Puesto ambulante', culprit: false, color: [255, 140, 50] },
  { file: 'enmascarado.jpeg', name: 'Sujeto Enmascarado', role: 'Esbirro 1', culprit: true, color: [255, 0, 80] },

  // Nivel 2
  { file: 'n2_1.jpeg', name: 'Corredor', role: 'Haciendo ejercicio', culprit: false, color: [0, 230, 150] },
  { file: 'n2_2.jpeg', name: 'Barrendero', role: 'Limpiando', culprit: false, color: [180, 180, 180] },
  { file: 'n2_3.jpeg', name: 'Pintor', role: 'Con caballete', culprit: false, color: [255, 100, 200] },
  { file: 'n2_4.jpeg', name: 'Lector', role: 'En un banco', culprit: false, color: [120, 150, 255] },
  { file: 'enano.jpeg', name: 'Alienígena Enano', role: 'Esbirro 2', culprit: true, color: [255, 50, 50] },
  { file: 'n2_6.jpeg', name: 'Jardinero', role: 'Regando flores', culprit: false, color: [50, 255, 100] },

  // Nivel 3
  { file: 'n3_1.jpeg', name: 'Guardia', role: 'Patrullando', culprit: false, color: [60, 120, 255] },
  { file: 'n3_2.jpeg', name: 'Comprador', role: 'Con bolsas', culprit: false, color: [255, 160, 0] },
  { file: 'n3_3.jpeg', name: 'Taxista', role: 'Esperando cliente', culprit: false, color: [255, 220, 0] },
  { file: 'ventosa.jpeg', name: 'Ser Con Ventosa', role: 'Esbirro 3', culprit: true, color: [255, 0, 100] },
  { file: 'n3_5.jpeg', name: 'Mesero', role: 'Con bandeja', culprit: false, color: [200, 200, 255] },
  { file: 'n3_6.jpeg', name: 'Repartidor', role: 'En bicicleta', culprit: false, color: [0, 255, 200] },

  // Nivel 4
  { file: 'alien1.jpeg', name: 'Extraterrestre Alto', role: 'Esbirro 4', culprit: true, color: [255, 30, 80] },
  { file: 'n4_2.jpeg', name: 'Técnico', role: 'En la antena', culprit: false, color: [255, 180, 50] },
  { file: 'n4_3.jpeg', name: 'Electricista', role: 'Caja de fusibles', culprit: false, color: [255, 230, 0] },
  { file: 'n4_4.jpeg', name: 'Desollador', role: 'Limpiacristales', culprit: false, color: [100, 200, 255] },
  { file: 'n4_5.jpeg', name: 'Supervisor', role: 'Con plano', culprit: false, color: [180, 120, 255] },
  { file: 'n4_6.jpeg', name: 'Vigilante', role: 'Con linterna', culprit: false, color: [80, 150, 255] },

  // Nivel 5
  { file: 'n5_1.jpeg', name: 'Chofer', role: 'En el auto', culprit: false, color: [150, 150, 180] },
  { file: 'bestia.jpeg', name: 'Bestia Enorme', role: 'Esbirro 5', culprit: true, color: [255, 20, 60] },
  { file: 'n5_3.jpeg', name: 'Botones', role: 'Con equipaje', culprit: false, color: [255, 120, 120] },
  { file: 'n5_4.jpeg', name: 'Cajero', role: 'En la ventanilla', culprit: false, color: [0, 255, 180] },
  { file: 'n5_5.jpeg', name: 'Conserje', role: 'Con llaves', culprit: false, color: [200, 180, 120] },
  { file: 'n5_6.jpeg', name: 'Informador', role: 'Leyendo periódico', culprit: false, color: [120, 200, 255] },

  // Nivel 6
  { file: 'n6_1.jpeg', name: 'Gimnasta Urbano', role: 'Colgado del faro', culprit: false, color: [0, 255, 200] },
  { file: 'n6_2.jpeg', name: 'Hombre Con Alergia', role: 'Estornudando', culprit: false, color: [255, 200, 100] },
  { file: 'tiffany.jpeg', name: 'Niña Tiffany', role: 'Paseando sola', culprit: true, color: [255, 0, 90] },
  { file: 'n6_4.jpeg', name: 'Maniquí / Comprador', role: 'En el escaparate', culprit: false, color: [220, 150, 255] },
  { file: 'n6_5.jpeg', name: 'Nadador Nocturno', role: 'Con flotador', culprit: false, color: [0, 200, 255] },
  { file: 'n6_6.jpeg', name: 'Actor de Teatro', role: 'Gritando con máscara', culprit: false, color: [255, 100, 100] },
];

const imgDir = path.join(__dirname, '..', 'public', 'imagenes');
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

targets.forEach(t => {
  const buf = generateTargetPNG(t.name, t.role, t.culprit, t.color);
  fs.writeFileSync(path.join(imgDir, t.file), buf);
});

console.log(`Generated ${targets.length} target images in public/imagenes/`);
