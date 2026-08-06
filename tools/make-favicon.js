/* Writes a 32x32 favicon.ico (BMP/DIB payload, no dependencies).
   Draws the brand mark at icon scale: navy rounded ground, gold star block,
   white hand curve. Regenerate with: node tools/make-favicon.js
   Replace with a proper cut from the logo vector when it arrives. */
"use strict";
const fs = require("fs");
const S = 32;
const NAVY = [0x11, 0x36, 0x62];
const GOLD = [0xf7, 0xb3, 0x22];
const WHITE = [0xff, 0xff, 0xff];

function px(x, y) {
  const cx = x + 0.5, cy = y + 0.5;
  // rounded-square mask
  const r = 6, m = 0;
  const dx = Math.max(m + r - cx, 0, cx - (S - m - r));
  const dy = Math.max(m + r - cy, 0, cy - (S - m - r));
  if (Math.hypot(dx, dy) > r) return null; // transparent
  // hand curve: a white arc across the lower third
  const arc = 20 + 6 * Math.cos(((cx - 16) / 16) * 1.2);
  if (cy > arc && cy < arc + 3.2 && cx > 6 && cx < 26) return WHITE;
  // five-point star, centred upper-middle
  const sx = cx - 16, sy = cy - 13;
  const ang = Math.atan2(sy, sx) + Math.PI / 2;
  const rad = Math.hypot(sx, sy);
  const k = Math.cos(Math.PI / 5) / Math.cos(((ang % (2 * Math.PI / 5)) + 2 * Math.PI) % (2 * Math.PI / 5) - Math.PI / 5);
  if (rad < 9 * k) return GOLD;
  return NAVY;
}

const rowSize = S * 4;
const pixels = Buffer.alloc(rowSize * S);
const maskRow = ((S + 31) >> 5) * 4;
const mask = Buffer.alloc(maskRow * S);

for (let y = 0; y < S; y++) {
  for (let x = 0; x < S; x++) {
    const c = px(x, y);
    const o = (S - 1 - y) * rowSize + x * 4; // DIB is bottom-up
    if (c) {
      pixels[o] = c[2]; pixels[o + 1] = c[1]; pixels[o + 2] = c[0]; pixels[o + 3] = 0xff;
    } else {
      const mo = (S - 1 - y) * maskRow + (x >> 3);
      mask[mo] |= 0x80 >> (x & 7); // AND-mask bit set = transparent
    }
  }
}

const dibHeader = Buffer.alloc(40);
dibHeader.writeUInt32LE(40, 0);
dibHeader.writeInt32LE(S, 4);
dibHeader.writeInt32LE(S * 2, 8); // height doubled: XOR + AND
dibHeader.writeUInt16LE(1, 12);
dibHeader.writeUInt16LE(32, 14);
dibHeader.writeUInt32LE(pixels.length + mask.length, 20);

const image = Buffer.concat([dibHeader, pixels, mask]);

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);

const entry = Buffer.alloc(16);
entry[0] = S; entry[1] = S; entry[2] = 0; entry[3] = 0;
entry.writeUInt16LE(1, 4);
entry.writeUInt16LE(32, 6);
entry.writeUInt32LE(image.length, 8);
entry.writeUInt32LE(6 + 16, 12);

fs.writeFileSync("favicon.ico", Buffer.concat([header, entry, image]));
console.log("favicon.ico written:", 6 + 16 + image.length, "bytes");
