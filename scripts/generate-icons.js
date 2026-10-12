import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Function to generate a raw uncompressed PNG buffer using standard PNG specification
function createSolidColorPng(width, height, r, g, b, a = 255) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // bit depth
  ihdrData.writeUInt8(6, 9); // color type (RGBA)
  ihdrData.writeUInt8(0, 10); // compression
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace

  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Raw image data with filter byte 0 at start of each scanline
  const scanlineLength = width * 4 + 1;
  const rawData = Buffer.alloc(scanlineLength * height);

  for (let y = 0; y < height; y++) {
    const offset = y * scanlineLength;
    rawData[offset] = 0; // Filter: None
    
    // Gradient calculations for a vibrant camping teal theme
    const factorY = y / height;
    
    for (let x = 0; x < width; x++) {
      const pxOffset = offset + 1 + x * 4;
      const factorX = x / width;

      // Outer border radius simulation for maskable or standard
      const cx = (x - width / 2) / (width / 2);
      const cy = (y - height / 2) / (height / 2);
      const dist = Math.sqrt(cx * cx + cy * cy);

      // Deep teal to forest green gradient
      let red = Math.round(15 + factorY * 20);
      let green = Math.round(118 - factorY * 40);
      let blue = Math.round(110 - factorY * 30);

      // Simple tent silhouette in the middle
      const tentTopY = height * 0.35;
      const tentBaseY = height * 0.75;
      const tentCenterX = width * 0.5;
      const tentHalfW = width * 0.28;

      if (y >= tentTopY && y <= tentBaseY) {
        const progressY = (y - tentTopY) / (tentBaseY - tentTopY);
        const curHalfW = progressY * tentHalfW;
        if (Math.abs(x - tentCenterX) <= curHalfW) {
          // Inside tent - warm amber/gold
          red = 245;
          green = 158;
          blue = 11;

          // Inner opening shadow
          const innerHalfW = curHalfW * 0.45;
          if (progressY > 0.4 && Math.abs(x - tentCenterX) <= innerHalfW) {
            red = 120;
            green = 53;
            blue = 15;
          }
        }
      }

      // Moon in top right
      const moonDist = Math.hypot(x - width * 0.72, y - height * 0.25);
      if (moonDist < width * 0.08) {
        red = 254;
        green = 240;
        blue = 138;
      }

      rawData[pxOffset] = red;
      rawData[pxOffset + 1] = green;
      rawData[pxOffset + 2] = blue;
      rawData[pxOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', deflated);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const crcBuf = Buffer.alloc(4);
  const crc = crc32(Buffer.concat([typeBuf, data]));
  crcBuf.writeUInt32BE(crc, 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

// Simple CRC32 implementation
function crc32(buf) {
  let crc = 0 ^ -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

const table = (() => {
  const c = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let code = n;
    for (let k = 0; k < 8; k++) {
      code = code & 1 ? 0xedb88320 ^ (code >>> 1) : code >>> 1;
    }
    c[n] = code;
  }
  return c;
})();

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Generating PNG icon files and screenshots for PWABuilder...');
fs.writeFileSync(path.join(publicDir, 'pwa-96x96.png'), createSolidColorPng(96, 96, 15, 118, 110));
fs.writeFileSync(path.join(publicDir, 'pwa-128x128.png'), createSolidColorPng(128, 128, 15, 118, 110));
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createSolidColorPng(192, 192, 15, 118, 110));
fs.writeFileSync(path.join(publicDir, 'pwa-256x256.png'), createSolidColorPng(256, 256, 15, 118, 110));
fs.writeFileSync(path.join(publicDir, 'pwa-384x384.png'), createSolidColorPng(384, 384, 15, 118, 110));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createSolidColorPng(512, 512, 15, 118, 110));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createSolidColorPng(512, 512, 17, 94, 89));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createSolidColorPng(180, 180, 15, 118, 110));

// Screenshots for PWABuilder app store requirements
fs.writeFileSync(path.join(publicDir, 'screenshot-wide.png'), createSolidColorPng(1280, 720, 15, 118, 110));
fs.writeFileSync(path.join(publicDir, 'screenshot-mobile.png'), createSolidColorPng(720, 1280, 15, 118, 110));

console.log('Generated all PWA icons and screenshots successfully!');
