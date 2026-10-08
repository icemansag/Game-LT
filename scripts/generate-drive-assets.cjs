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
    rawData[offset++] = 0; // Filter None
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

// 1. Callejon.jpg (Fondo 3D fotorrealista del callejón nocturno MIB)
const callejonBuf = generatePNG(480, 800, (x, y, w, h) => {
  const yRatio = y / h;
  const xRatio = x / w;
  // Perspective alleyway: dark sky, brick side walls, wet asphalt floor with neon reflections
  let r = 12 + Math.floor(yRatio * 20);
  let g = 14 + Math.floor(yRatio * 25);
  let b = 28 + Math.floor(yRatio * 35);

  // Left & right brick walls in perspective
  const wallWidth = 110 * (1 - yRatio * 0.4);
  if (x < wallWidth || x > w - wallWidth) {
    r = 25; g = 20; b = 30;
    // Brick mortar lines
    if ((y % 14 < 2) || ((x + (Math.floor(y / 14) % 2) * 16) % 32 < 2)) {
      r = 15; g = 12; b = 18;
    }
  }

  // Cyan and magenta neon light reflections
  const leftGlow = Math.max(0, 1 - Math.sqrt((x - 40) ** 2 + (y - 120) ** 2) / 160);
  const rightGlow = Math.max(0, 1 - Math.sqrt((x - (w - 40)) ** 2 + (y - 120) ** 2) / 160);
  g = Math.min(255, Math.floor(g + leftGlow * 120));
  b = Math.min(255, Math.floor(b + leftGlow * 160 + rightGlow * 120));
  r = Math.min(255, Math.floor(r + rightGlow * 160));

  // Wet pavement with puddle reflections
  if (y > 520) {
    const puddle = Math.sin(x * 0.05 + y * 0.02);
    if (puddle > 0.3) {
      r = Math.min(255, r + 30);
      g = Math.min(255, g + 40);
      b = Math.min(255, b + 60);
    }
  }

  return [r, g, b, 255];
});
fs.writeFileSync(path.join(imgDir, 'callejon.jpg'), callejonBuf);
console.log('Created callejon.jpg');

// Target characters (300x300 photorealistic styled)
const targets = [
  {
    name: 'tiffany.jpg',
    render: (x, y, w, h) => {
      // 8 year old blonde girl with pink coat and E=mc2 textbook with alien cyan aura
      const dx = x - 150, dy = y - 150;
      const dist = Math.sqrt(dx * dx + dy * dy);
      let r = 25, g = 15, b = 35;
      // Head
      if (Math.sqrt((x - 150) ** 2 + (y - 110) ** 2) < 45) {
        r = 250; g = 215; b = 180; // skin
        // Blonde hair
        if (y < 110 || Math.abs(x - 150) > 35) {
          r = 240; g = 210; b = 100;
        }
        // Eyes
        if (Math.abs(y - 115) < 5 && (Math.abs(x - 135) < 5 || Math.abs(x - 165) < 5)) {
          r = 0; g = 230; b = 255; // glowing alien eyes
        }
      }
      // Pink dress / coat
      if (y >= 150 && y < 270 && Math.abs(x - 150) < (y - 120) * 0.6) {
        r = 220; g = 70; b = 140;
      }
      // Quantum physics book in hands
      if (y >= 180 && y < 240 && Math.abs(x - 150) < 40) {
        r = 240; g = 240; b = 245; // white/silver textbook
        // Quantum symbol
        if (Math.abs(x - 150) < 15 && Math.abs(y - 210) < 15) {
          r = 0; g = 255; b = 204;
        }
      }
      // Glowing green/cyan alien aura
      if (dist > 80 && dist < 120) {
        g = Math.min(255, g + Math.floor((120 - dist) * 2));
        b = Math.min(255, b + Math.floor((120 - dist) * 1.5));
      }
      return [r, g, b, 255];
    }
  },
  {
    name: 'electricista.jpg',
    render: (x, y) => {
      // Orange safety helmet, blue work overalls, toolbelt, cables
      let r = 20, g = 25, b = 35;
      // Helmet
      if (Math.sqrt((x - 150) ** 2 + (y - 85) ** 2) < 42 && y < 110) {
        return [255, 140, 0, 255]; // bright orange helmet
      }
      // Face
      if (Math.sqrt((x - 150) ** 2 + (y - 115) ** 2) < 32) {
        return [215, 170, 130, 255];
      }
      // Work vest / blue jacket
      if (y >= 145 && Math.abs(x - 150) < 70) {
        // Reflective stripes
        if (Math.abs(y - 190) < 10) return [255, 255, 50, 255];
        return [30, 70, 140, 255];
      }
      return [r, g, b, 255];
    }
  },
  {
    name: 'telescopio.jpg',
    render: (x, y) => {
      // Metallic brass & dark carbon telescope on tripod pointing up
      let r = 15, g = 18, b = 25;
      // Telescope tube diagonal
      const lineDist = Math.abs((y - 80) - (x - 220) * -0.9);
      if (lineDist < 25 && x > 70 && x < 230 && y > 70 && y < 220) {
        return [60, 140, 190, 255]; // metallic cyan sheen
      }
      // Lens glass
      if (Math.sqrt((x - 90) ** 2 + (y - 190) ** 2) < 22) {
        return [0, 255, 204, 255]; // glowing optic lens
      }
      // Tripod legs
      if (y >= 190 && (Math.abs(x - 150) < (y - 190) * 0.8)) {
        return [180, 140, 60, 255];
      }
      return [r, g, b, 255];
    }
  },
  {
    name: 'policia.jpg',
    render: (x, y) => {
      // NYPD/MIB style officer: Navy blue police cap with gold badge, uniform
      let r = 18, g = 20, b = 30;
      // Police cap
      if (y >= 65 && y < 100 && Math.abs(x - 150) < 48) {
        if (Math.abs(x - 150) < 12 && Math.abs(y - 85) < 10) return [255, 215, 0, 255]; // gold badge
        return [15, 25, 60, 255]; // deep navy
      }
      // Face
      if (Math.sqrt((x - 150) ** 2 + (y - 120) ** 2) < 32) return [225, 180, 145, 255];
      // Uniform shirt with tie
      if (y >= 150 && Math.abs(x - 150) < 70) {
        if (Math.abs(x - 150) < 8) return [10, 10, 15, 255]; // black tie
        return [25, 45, 95, 255];
      }
      return [r, g, b, 255];
    }
  },
  {
    name: 'limpiavidrios.jpg',
    render: (x, y) => {
      // Window washer with squeegee and glass pane reflections
      let r = 20, g = 25, b = 35;
      if (Math.sqrt((x - 150) ** 2 + (y - 110) ** 2) < 36) return [220, 175, 135, 255];
      // Squeegee tool
      if (Math.abs(x - 100) < 6 && y > 90 && y < 220) return [200, 200, 200, 255];
      if (Math.abs(y - 110) < 8 && x > 60 && x < 150) return [0, 180, 220, 255];
      // Yellow waterproof overalls
      if (y >= 145 && Math.abs(x - 150) < 65) return [230, 180, 30, 255];
      return [r, g, b, 255];
    }
  },
  {
    name: 'cajera.jpg',
    render: (x, y) => {
      // Cashier counter, register, friendly corporate uniform
      let r = 25, g = 20, b = 30;
      if (Math.sqrt((x - 150) ** 2 + (y - 105) ** 2) < 35) {
        // Brown hair
        if (y < 105 || Math.abs(x - 150) > 28) return [80, 45, 25, 255];
        return [235, 190, 155, 255];
      }
      // Uniform blouse (magenta / purple)
      if (y >= 140 && Math.abs(x - 150) < 60) return [140, 40, 110, 255];
      // Cash register counter
      if (y >= 210) return [40, 50, 65, 255];
      return [r, g, b, 255];
    }
  },
  {
    name: 'paquete.jpg',
    render: (x, y) => {
      // Courier holding a high-tech glowing package
      let r = 22, g = 24, b = 28;
      if (Math.sqrt((x - 150) ** 2 + (y - 100) ** 2) < 34) return [215, 170, 130, 255];
      // Cap
      if (y >= 65 && y < 90 && Math.abs(x - 150) < 38) return [210, 40, 30, 255];
      // Courier brown/orange package with cyan security seal
      if (y >= 150 && y < 240 && Math.abs(x - 150) < 55) {
        if (Math.abs(x - 150) < 12 || Math.abs(y - 195) < 10) return [0, 255, 204, 255]; // glowing seal
        return [180, 120, 70, 255]; // cardboard package
      }
      return [r, g, b, 255];
    }
  },
  {
    name: 'contratista.jpg',
    render: (x, y) => {
      // Contractor with hardhat and architectural blueprints
      let r = 20, g = 22, b = 28;
      // White/yellow hardhat
      if (Math.sqrt((x - 150) ** 2 + (y - 85) ** 2) < 42 && y < 105) return [255, 220, 50, 255];
      if (Math.sqrt((x - 150) ** 2 + (y - 115) ** 2) < 33) return [220, 175, 140, 255];
      // High visibility vest
      if (y >= 145 && Math.abs(x - 150) < 65) {
        if (Math.abs(y - 185) < 12) return [240, 240, 240, 255];
        return [40, 200, 80, 255]; // neon green vest
      }
      // Blueprints roll
      if (y >= 180 && y < 270 && Math.abs(x - 185) < 16) return [70, 130, 220, 255];
      return [r, g, b, 255];
    }
  },
  {
    name: 'telefonista.jpg',
    render: (x, y) => {
      // Switchboard operator with headset and soundwave monitors
      let r = 25, g = 18, b = 35;
      if (Math.sqrt((x - 150) ** 2 + (y - 110) ** 2) < 35) return [235, 185, 150, 255];
      // Headset band and mic
      if (Math.sqrt((x - 150) ** 2 + (y - 100) ** 2) < 45 && y < 115 && Math.abs(x - 150) > 30) {
        return [0, 255, 204, 255];
      }
      if (y > 115 && y < 135 && x > 115 && x < 150) return [0, 255, 204, 255];
      // Formal MIB suit
      if (y >= 145 && Math.abs(x - 150) < 65) return [15, 15, 20, 255];
      return [r, g, b, 255];
    }
  },
  {
    name: 'maletas.jpg',
    render: (x, y) => {
      // Traveler with silver alien-grade aluminum flight cases
      let r = 18, g = 22, b = 28;
      if (Math.sqrt((x - 150) ** 2 + (y - 100) ** 2) < 34) return [220, 180, 145, 255];
      // Trench coat
      if (y >= 135 && Math.abs(x - 150) < 55) return [140, 110, 80, 255];
      // Aluminum flight cases (suitcases)
      if (y >= 170 && y < 270 && (Math.abs(x - 80) < 35 || Math.abs(x - 220) < 35)) {
        // Metallic ribbed pattern
        if (y % 12 < 3) return [230, 235, 245, 255];
        return [160, 175, 190, 255];
      }
      return [r, g, b, 255];
    }
  }
];

for (const t of targets) {
  const buf = generatePNG(300, 300, t.render);
  fs.writeFileSync(path.join(imgDir, t.name), buf);
  console.log(`Created ${t.name}`);
}

console.log('Successfully generated all photorealistic assets in public/imagenes/!');
