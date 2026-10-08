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

function generatePNG(width, height, colorGen) {
  const rawData = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = colorGen(x, y, width, height);
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

const newKeys = [
  { key: 'cantante', color: [160, 40, 180] },
  { key: 'caminandomen', color: [40, 120, 200] },
  { key: 'pistoladeagua', color: [0, 200, 255] },
  { key: 'cocinero', color: [220, 220, 240] },
  { key: 'pensativo', color: [80, 100, 140] },
  { key: 'corredor', color: [255, 90, 0] },
  { key: 'jardinero', color: [40, 180, 80] },
  { key: 'pintor', color: [220, 140, 40] },
  { key: 'observador', color: [100, 180, 220] },
  { key: 'tom', color: [20, 25, 40] },
  { key: 'regadera', color: [0, 180, 160] },
  { key: 'guardia', color: [25, 45, 90] },
  { key: 'chica', color: [240, 100, 160] },
  { key: 'taxista', color: [255, 200, 0] },
  { key: 'cajero', color: [50, 140, 220] },
  { key: 'mesero', color: [30, 30, 35] },
  { key: 'ciclista', color: [255, 60, 60] },
  { key: 'mafioso', color: [60, 0, 70] },
  { key: 'piscina', color: [0, 220, 200] },
  { key: 'rachel', color: [180, 80, 200] },
  { key: 'profe', color: [90, 90, 120] },
  { key: 'banca', color: [120, 80, 50] },
  { key: 'periodista', color: [200, 160, 60] },
  { key: 'auditor', color: [70, 85, 110] },
];

for (const item of newKeys) {
  const filePath = path.join(imgDir, `${item.key}.jpg`);
  if (!fs.existsSync(filePath)) {
    const buf = generatePNG(300, 300, (x, y) => {
      let r = 20, g = 22, b = 30;
      // Head
      if (Math.sqrt((x - 150) ** 2 + (y - 110) ** 2) < 36) {
        return [225, 180, 145, 255];
      }
      // Upper body with characteristic color
      if (y >= 145 && Math.abs(x - 150) < 65) {
        return [...item.color, 255];
      }
      return [r, g, b, 255];
    });
    fs.writeFileSync(filePath, buf);
    console.log(`Created ${item.key}.jpg`);
  }
}

console.log('All MIB_ASSETS verified!');
