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

function generateBackgroundPNG(levelNum) {
  const width = 480;
  const height = 800;
  const rawData = Buffer.alloc(height * (1 + width * 4));

  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0;
    const yRatio = y / height;

    for (let x = 0; x < width; x++) {
      const xRatio = x / width;
      let r = 10, g = 12, b = 20, a = 255;

      if (levelNum === 1) {
        // Nivel 1: Callejón Nocturno Urbano con ladrillos y neones
        // Gradiente vertical oscuro con luz de farola y neón rojizo/ámbar
        r = 15 + Math.floor(yRatio * 20);
        g = 12 + Math.floor(yRatio * 15);
        b = 24 + Math.floor(yRatio * 20);

        // Paredes del callejón (perspectiva)
        if (x < 100 || x > 380) {
          // Ladrillos y sombras
          r = Math.floor(r * 1.4);
          if ((y % 16 < 2) || ((x + (Math.floor(y / 16) % 2) * 16) % 32 < 2)) {
            r = Math.max(0, r - 10);
            g = Math.max(0, g - 8);
          }
        }
        // Letrero neón en el fondo
        if (y > 180 && y < 240 && x > 180 && x < 300) {
          r = Math.min(255, r + 40);
          g = Math.min(255, g + 8);
          b = Math.min(255, b + 30);
        }
        // Pavimento mojado con reflejos
        if (y > 550) {
          r = Math.min(255, r + 15);
          g = Math.min(255, g + 25);
          b = Math.min(255, b + 35);
        }
      } else if (levelNum === 2) {
        // Nivel 2: Parque Central Nocturno con siluetas de copas de árboles y cielo estrellado
        // Cielo nocturno azul oscuro a esmeralda profundo
        r = 8 + Math.floor(yRatio * 15);
        g = 16 + Math.floor(yRatio * 35);
        b = 28 + Math.floor(yRatio * 30);

        // Estrellas en el cielo
        if (y < 350 && ((x * 47 + y * 89) % 359 < 3)) {
          r = 200; g = 255; b = 220;
        }
        // Siluetas de árboles y hojas
        const treeNoise = Math.sin(x * 0.05) * 30 + Math.cos(x * 0.12) * 20;
        if (y > 380 + treeNoise && y < 580) {
          r = 10; g = 28; b = 18;
        }
        // Suelo y césped nocturno
        if (y >= 580) {
          r = 8; g = 22; b = 14;
        }
      } else if (levelNum === 3) {
        // Nivel 3: Distrito Comercial con neones cian/magenta y escaparates
        r = 12 + Math.floor((1 - yRatio) * 30);
        g = 14 + Math.floor(yRatio * 20);
        b = 32 + Math.floor(yRatio * 40);

        // Columnas arquitectónicas y escaparates
        if ((x % 80 < 12) || (y > 220 && y < 450 && (x > 60 && x < 200 || x > 280 && x < 420))) {
          r = Math.min(255, r + 25);
          g = Math.min(255, g + 35);
          b = Math.min(255, b + 60);
        }
        // Letrero cian comercial
        if (y > 120 && y < 160 && x > 140 && x < 340) {
          g = Math.min(255, g + 50);
          b = Math.min(255, b + 70);
        }
      } else if (levelNum === 4) {
        // Nivel 4: Azotea del Rascacielos con vista a rascacielos y antenas
        // Cielo violeta cósmico / crepúsculo cibernético
        r = 25 + Math.floor((1 - yRatio) * 45);
        g = 12 + Math.floor((1 - yRatio) * 20);
        b = 40 + Math.floor(yRatio * 30);

        // Siluetas de rascacielos en el horizonte
        const buildingIdx = Math.floor(x / 50);
        const bHeight = 280 + ((buildingIdx * 73) % 180);
        if (y > bHeight && y < 620) {
          r = 14; g = 16; b = 28;
          // Ventanas iluminadas
          if ((x % 14 > 4) && ((y - bHeight) % 20 > 6) && ((x * 13 + y * 7) % 7 < 3)) {
            r = 255; g = 220; b = 120;
          }
        }
        // Barandilla de la azotea
        if (y >= 620 && y <= 630) {
          r = 50; g = 60; b = 90;
        }
        // Suelo de hormigón de la azotea
        if (y > 630) {
          r = 20; g = 22; b = 30;
        }
      } else if (levelNum === 5) {
        // Nivel 5: Vestíbulo de Lujo con lámparas ámbar y suelo de mármol
        r = 28 + Math.floor(yRatio * 20);
        g = 22 + Math.floor(yRatio * 15);
        b = 18 + Math.floor(yRatio * 10);

        // Columnas clásicas de mármol
        if (Math.abs(x - 90) < 25 || Math.abs(x - 390) < 25) {
          r = Math.min(255, r + 30);
          g = Math.min(255, g + 26);
          b = Math.min(255, b + 20);
        }
        // Lámpara central y destellos dorados
        const lampDist = Math.sqrt((x - 240) ** 2 + (y - 120) ** 2);
        if (lampDist < 80) {
          r = Math.min(255, r + Math.floor((80 - lampDist) * 0.8));
          g = Math.min(255, g + Math.floor((80 - lampDist) * 0.6));
          b = Math.min(255, b + Math.floor((80 - lampDist) * 0.2));
        }
        // Baldosas de mármol con reflejos
        if (y > 500) {
          if ((x + y) % 40 < 2 || (x - y) % 40 < 2) {
            r = Math.min(255, r + 20);
            g = Math.min(255, g + 18);
          }
        }
      } else {
        // Nivel 6: Campo de Tiro Oficial Men In Black (Subterráneo secreto)
        // Muros de titanio oscuro, líneas láser de calibración cian y hexágonos
        r = 10;
        g = 20 + Math.floor(yRatio * 15);
        b = 28 + Math.floor(yRatio * 25);

        // Guías láser horizontales de la galería de tiro
        if (Math.abs(y - 180) < 2 || Math.abs(y - 360) < 2 || Math.abs(y - 540) < 2) {
          r = 0; g = 255; b = 204;
        }
        // Paneles acústicos hexagonales
        if ((x % 60 < 2) || (y % 52 < 2)) {
          r = Math.min(255, r + 15);
          g = Math.min(255, g + 22);
          b = Math.min(255, b + 35);
        }
        // MIB Insignia watermark at the center
        const badgeDist = Math.sqrt((x - 240) ** 2 + (y - 350) ** 2);
        if (Math.abs(badgeDist - 120) < 3 || Math.abs(badgeDist - 80) < 2) {
          g = Math.min(255, g + 35);
          b = Math.min(255, b + 45);
        }
      }

      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
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

const imgDir = path.join(__dirname, '..', 'public', 'imagenes');
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

for (let lvl = 1; lvl <= 6; lvl++) {
  const buf = generateBackgroundPNG(lvl);
  const filename = `fondo_n${lvl}.jpeg`;
  fs.writeFileSync(path.join(imgDir, filename), buf);
  console.log(`Created ${filename} (${buf.length} bytes)`);
}

console.log('Successfully generated all 6 level backgrounds in public/imagenes/!');
