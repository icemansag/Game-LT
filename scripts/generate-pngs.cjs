const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Minimal PNG generator in pure Node.js
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

function generateIconPNG(size, isMaskable = false) {
  const width = size;
  const height = size;
  const rawData = Buffer.alloc(height * (1 + width * 4));

  const cx = width / 2;
  const cy = height / 2;
  const rOuter = (width / 2) * (isMaskable ? 0.65 : 0.85);
  const rInner = rOuter * 0.7;

  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter byte 0 (None)
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background color: dark graphite #0d1117
      let r = 13, g = 17, b = 23, a = 255;

      // Outer neon ring (#00ff66)
      if (Math.abs(dist - rOuter) < (size > 200 ? 5 : 2.5)) {
        r = 0; g = 255; b = 102;
      }
      // Inner cyan ring (#00e5ff)
      else if (Math.abs(dist - rInner) < (size > 200 ? 3 : 1.5)) {
        r = 0; g = 229; b = 255;
      }
      // Crosshairs
      else if ((Math.abs(dx) < (size > 200 ? 3 : 1.5) && dist < rOuter + 10 && dist > 15) ||
               (Math.abs(dy) < (size > 200 ? 3 : 1.5) && dist < rOuter + 10 && dist > 15)) {
        r = 0; g = 255; b = 102;
      }
      // Center red laser dot (#ff0033)
      else if (dist < (size > 200 ? 14 : 7)) {
        r = 255; g = 0; b = 51;
        if (dist < (size > 200 ? 4 : 2)) {
          r = 255; g = 255; b = 255; // Core white highlight
        }
      }
      // Stylized sunglasses shape
      else if (Math.abs(dy) < rInner * 0.4 && Math.abs(dx) < rInner * 0.75) {
        if (dy > -rInner * 0.25 && dy < rInner * 0.25) {
          const eyeDistL = Math.sqrt((dx + rInner * 0.35) ** 2 + (dy) ** 2);
          const eyeDistR = Math.sqrt((dx - rInner * 0.35) ** 2 + (dy) ** 2);
          if (eyeDistL < rInner * 0.28 || eyeDistR < rInner * 0.28) {
            r = 0; g = 255; b = 204;
          }
        }
      }

      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  // PNG header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdr = createChunk('IHDR', ihdrData);

  // IDAT
  const compressed = zlib.deflateSync(rawData);
  const idat = createChunk('IDAT', compressed);

  // IEND
  const iend = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), generateIconPNG(192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), generateIconPNG(512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), generateIconPNG(512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generateIconPNG(180, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), generateIconPNG(64, false));

console.log('Successfully generated all PWA PNG icons in /public!');
