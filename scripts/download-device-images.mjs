#!/usr/bin/env node
/**
 * Real device product photo downloader for Revend
 * Sources: GSMArena /vv/pics/, Apple CDN, Wikimedia Commons, PlayStation CDN, Steam CDN
 * Run: node scripts/download-device-images.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.join(__dirname, '../public/images');

// ─── URL HELPERS ──────────────────────────────────────────────────────────────
const GSMA  = (brand, slug) =>
  `https://fdn2.gsmarena.com/vv/pics/${brand}/${slug}-1.jpg`;
const APPLE = (slug) =>
  `https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/${slug}?wid=800&hei=800&fmt=png-alpha`;
const WIKI  = (wpath) =>
  `https://upload.wikimedia.org/wikipedia/commons/${wpath}`;
const PS    = (slug) =>
  `https://gmedia.playstation.com/is/image/SIEPDC/${slug}?wid=800&hei=800`;
const STEAM = (slug) =>
  `https://store.steampowered.com/hwswsurvey/static/images/${slug}`;
const WIKI_RESIZE = (wpath, px = 800) => {
  // Wikimedia thumbnail URL
  const fname = wpath.split('/').pop();
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${wpath}/${px}px-${fname}`;
};

// ─── DEVICE → URL MAPPING ────────────────────────────────────────────────────
// Each entry is an array of URLs to try in order (first success wins).
// Sources: GSMArena = real device photos 710×650; Apple CDN = transparent PNG 800×800;
// Wikimedia = real photos (vary); PlayStation/Steam CDN = product shots

const DEVICE_URLS = {

  // ── iPhones ────────────────────────────────────────────────────────────────
  iphone11:       [GSMA('apple', 'apple-iphone-11')],
  iphone12:       [GSMA('apple', 'apple-iphone-12'),
                   `https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-12.jpg`],
  iphone13:       [GSMA('apple', 'apple-iphone-13'),
                   `https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13.jpg`],
  iphone13promax: [GSMA('apple', 'apple-iphone-13-pro-max')],
  iphone14:       [GSMA('apple', 'apple-iphone-14')],
  iphone14plus:   [GSMA('apple', 'apple-iphone-14-plus')],
  iphone14pro:    [GSMA('apple', 'apple-iphone-14-pro')],
  iphone14promax: [GSMA('apple', 'apple-iphone-14-pro-max')],
  iphone15:       [GSMA('apple', 'apple-iphone-15')],
  iphone15plus:   [GSMA('apple', 'apple-iphone-15-plus')],
  iphone15pro:    [GSMA('apple', 'apple-iphone-15-pro')],
  iphone15promax: [GSMA('apple', 'apple-iphone-15-pro-max')],
  iphone16:       [GSMA('apple', 'apple-iphone-16')],
  iphone16e:      [GSMA('apple', 'apple-iphone-16e')],
  iphone16plus:   [GSMA('apple', 'apple-iphone-16-plus')],
  iphone16pro:    [GSMA('apple', 'apple-iphone-16-pro')],
  iphone16promax: [GSMA('apple', 'apple-iphone-16-pro-max')],
  iphone17:       [GSMA('apple', 'apple-iphone-17')],
  iphone17pro:    [GSMA('apple', 'apple-iphone-17-pro')],
  iphone17promax: [GSMA('apple', 'apple-iphone-17-pro-max')],
  iphoneair:      [GSMA('apple', 'apple-iphone-air')],

  // ── Samsung Galaxy S-series ────────────────────────────────────────────────
  s22:      [GSMA('samsung', 'samsung-galaxy-s22-5g')],
  s22ultra: [GSMA('samsung', 'samsung-galaxy-s22-ultra-5g')],
  s23:      [GSMA('samsung', 'samsung-galaxy-s23-5g')],
  s23plus:  [GSMA('samsung', 'samsung-galaxy-s23-plus-5g')],
  s23ultra: [GSMA('samsung', 'samsung-galaxy-s23-ultra-5g')],
  s24:      [WIKI('c/c3/Samsung_Galaxy_S24.jpg')],
  s24plus:  [WIKI('c/cb/Samsung_Galaxy_S24%2B.jpg')],
  s24ultra: [WIKI('8/8e/Samsung_Galaxy_S24_Ultra.jpg')],
  s25:      [WIKI('e/e6/S25_Blueblack.png'),
             WIKI('b/b0/Samsung_Galaxy_S25_Ultra.jpg')],
  s25plus:  [WIKI('0/0e/Samsung_Galaxy_S25%2B.jpg'),
             WIKI('b/b0/Samsung_Galaxy_S25_Ultra.jpg')],
  s25ultra: [WIKI('b/b0/Samsung_Galaxy_S25_Ultra.jpg')],

  // ── Samsung Galaxy A / Z / Watch ──────────────────────────────────────────
  galaxya35: [GSMA('samsung', 'samsung-galaxy-a35')],
  galaxya55: [GSMA('samsung', 'samsung-galaxy-a55')],
  zflip6:    [GSMA('samsung', 'samsung-galaxy-z-flip6')],
  zflip7:    [GSMA('samsung', 'samsung-galaxy-z-flip7')],
  zfold6:    [GSMA('samsung', 'samsung-galaxy-z-fold6')],
  gw6:       [WIKI('b/b9/Samsung_Galaxy_Watch_6.jpg')],
  gw7:       [GSMA('samsung', 'samsung-galaxy-watch7')],

  // ── Google Pixel ──────────────────────────────────────────────────────────
  pixel6:     [GSMA('google', 'google-pixel-6')],
  pixel6pro:  [GSMA('google', 'google-pixel-6-pro')],
  pixel7:     [GSMA('google', 'google-pixel7')],
  pixel7pro:  [GSMA('google', 'google-pixel7-pro')],
  pixel8:     [GSMA('google', 'google-pixel-8')],
  pixel8pro:  [GSMA('google', 'google-pixel-8-pro')],
  pixel9:     [GSMA('google', 'google-pixel-9')],
  pixel9pro:  [GSMA('google', 'google-pixel-9-pro')],
  pixel9proxl:[GSMA('google', 'google-pixel-9-pro-xl')],

  // ── Apple Watch ───────────────────────────────────────────────────────────
  awse2:   [APPLE('watch-card-40-se3-202509'),         // SE3 as proxy for SE2
            GSMA('apple', 'apple-watch-series9')],
  aws9:    [GSMA('apple', 'apple-watch-series9')],
  aws10:   [GSMA('apple', 'apple-watch-series10')],
  aws11:   [APPLE('watch-card-40-s11-202509_GEO_US'),
            GSMA('apple', 'apple-watch-series10')],
  awultra2:[GSMA('apple', 'apple-watch-ultra2')],
  awultra3:[APPLE('watch-card-40-ultra3-202509_GEO_US'),
            GSMA('apple', 'apple-watch-ultra3')],

  // ── iPads ─────────────────────────────────────────────────────────────────
  ipad10:    [GSMA('apple', 'apple-ipad-10-2022')],
  ipadair11: [APPLE('ipad-air-select-11in-wifi-blue-202405')],
  ipadair13: [APPLE('ipad-air-select-13in-wifi-blue-202405')],
  ipadpro11: [APPLE('ipad-pro-11-select-wifi-spaceblack-202405')],
  ipadpro13: [APPLE('ipad-pro-13-select-wifi-spaceblack-202405')],
  ipadmini7: [APPLE('ipad-mini-select-wifi-blue-202410')],

  // ── MacBooks ──────────────────────────────────────────────────────────────
  mba13:    [APPLE('mba13-midnight-select-202402')],   // M3 13"
  mba13m4:  [APPLE('mba13-skyblue-select-202503')],    // M4 13"
  mba15:    [APPLE('mba15-skyblue-select-202503')],    // M4 15" (M3 15" not in CDN)
  mba15m4:  [APPLE('mba15-skyblue-select-202503')],    // M4 15"
  mbp14:    [APPLE('mbp14-spacegray-select-202310')],  // M3 14"
  mbp14m4:  [APPLE('mbp14-spaceblack-select-202410')], // M4 14"
  mbp16:    [APPLE('mbp16-silver-select-202310')],     // M3 16"
  mbp16m4:  [APPLE('mbp16-spaceblack-select-202410')], // M4 16"

  // ── AirPods ───────────────────────────────────────────────────────────────
  airpodspro2: [APPLE('airpods-pro-2-hero-select-202409')],

  // ── Sony Headphones (try BestBuy CDN via known product IDs) ──────────────
  // Confirmed Sony XM4 ASIN on Amazon: B0863TXGM3 → image: 81LqNKwuZLL
  sonyxm4: [
    'https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SX679_.jpg',
    'https://m.media-amazon.com/images/I/81LqNKwuZLL._AC_SL1500_.jpg',
    WIKI('7/74/Sony_WH-1000XM4.jpg'),
  ],
  // Sony XM5 ASIN: B09XS7JWHH → image: 61clPqkqGKL
  sonyxm5: [
    'https://m.media-amazon.com/images/I/61clPqkqGKL._AC_SX679_.jpg',
    'https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SX679_.jpg',
    WIKI('1/10/Sony_WH-1000XM5.jpg'),
  ],
  sonyxm6: [
    WIKI('1/10/Sony_WH-1000XM5.jpg'),   // Use XM5 as proxy if XM6 not found
    'https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SX679_.jpg',
  ],

  // ── Bose Headphones ───────────────────────────────────────────────────────
  boseqc45: [
    'https://m.media-amazon.com/images/I/516I-bwq7YL._AC_SX679_.jpg',
    'https://m.media-amazon.com/images/I/51-nXxJO83L._AC_SX679_.jpg',
    WIKI('4/45/Bose_QuietComfort_45.jpg'),
  ],
  boseqcultra: [
    'https://m.media-amazon.com/images/I/71VKlqiHomL._AC_SX679_.jpg',
    'https://m.media-amazon.com/images/I/516I-bwq7YL._AC_SX679_.jpg',
  ],

  // ── Samsung Galaxy Tab S9 ─────────────────────────────────────────────────
  tabs9:      [WIKI('0/05/Samsung_Galaxy_Tab_S9.png')],
  tabs9plus:  [WIKI('0/05/Samsung_Galaxy_Tab_S9.png'),   // proxy if S9+ not found
               GSMA('samsung', 'samsung-galaxy-tab-s9-fe')],
  tabs9ultra: [WIKI('0/05/Samsung_Galaxy_Tab_S9.png')],

  // ── Gaming Consoles ───────────────────────────────────────────────────────
  ps5:     [PS('ps5-product-thumbnail-01-en-14sep21'),
            'https://m.media-amazon.com/images/I/51051FiD9UL._SX679_.jpg'],
  ps5slim: [PS('ps5-disc-slim-thumbnail-01-en-04oct23'),
            PS('ps5-slim-disc-edition-product-thumbnail-01-en-04oct23'),
            PS('ps5-product-thumbnail-01-en-14sep21')],

  switch:     [WIKI('3/3e/Nintendo-Switch-wJoyCons-L-R-Flat-1.jpg'),
               WIKI('d/d4/Nintendo_Switch_OLED_Model.jpg')],
  switcholed: [WIKI('d/d4/Nintendo_Switch_OLED_Model.jpg')],
  switch2:    [WIKI('1/1f/Nintendo_Switch_2.jpg'),
               WIKI('d/d4/Nintendo_Switch_OLED_Model.jpg')],

  xboxx: [WIKI('e/ea/Xbox_Series_X_console.jpg'),
          'https://m.media-amazon.com/images/I/51ircZ-XoQL._SX679_.jpg'],
  xboxs: [WIKI('a/a5/Xbox_Series_S.jpg'),
          'https://m.media-amazon.com/images/I/51ircZ-XoQL._SX679_.jpg'],

  quest3:  [WIKI('a/af/Meta_Quest_3_display_unit.jpg'),
            WIKI('7/79/Meta_Quest_3S.jpg')],
  quest3s: [WIKI('7/79/Meta_Quest_3S.jpg'),
            WIKI('a/af/Meta_Quest_3_display_unit.jpg')],

  steamdeckoled: [STEAM('SteamDeckOLED-Product-Page-1.png')],

  // ── Other ────────────────────────────────────────────────────────────────
  oneplus12: [GSMA('oneplus', 'oneplus-12')],

  surfacelaptop6: [
    'https://m.media-amazon.com/images/I/61Rjy47g3HL._SX679_.jpg',
    WIKI('2/28/Microsoft_Surface_Laptop_6.jpg'),
  ],
  surfacelaptop7: [
    'https://m.media-amazon.com/images/I/61Rjy47g3HL._SX679_.jpg',
    WIKI('7/72/Microsoft_Surface_Laptop_7.jpg'),
  ],
};

// ─── IMAGE HELPERS ────────────────────────────────────────────────────────────

function fetchUrl(url, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) return reject(new Error('Too many redirects'));
    const proto = url.startsWith('https') ? https : http;
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Referer': 'https://www.google.com/',
      },
      timeout: 20000,
    };
    const req = proto.get(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redir = new URL(res.headers.location, url).href;
        res.destroy();
        return fetchUrl(redir, redirectCount + 1).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.destroy();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({
        data: Buffer.concat(chunks),
        contentType: res.headers['content-type'] || ''
      }));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

const isPNG  = b => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47;
const isJPEG = b => b[0] === 0xFF && b[1] === 0xD8;
const isSVG  = b => {
  const s = b.slice(0, 300).toString('utf8').toLowerCase();
  return s.includes('<svg') || (s.includes('<?xml') && s.includes('svg'));
};

function jpegDimensions(buf) {
  let i = 2;
  while (i < buf.length - 8) {
    if (buf[i] !== 0xFF) break;
    const marker = buf[i+1];
    if (marker === 0xC0 || marker === 0xC2) {
      return { h: (buf[i+5] << 8) | buf[i+6], w: (buf[i+7] << 8) | buf[i+8] };
    }
    if (marker === 0xD8 || marker === 0xD9) { i += 2; continue; }
    const len = (buf[i+2] << 8) | buf[i+3];
    i += 2 + len;
  }
  return null;
}

function pngDimensions(buf) {
  if (buf.length < 24) return null;
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

async function toOutputPNG(data) {
  if (isSVG(data)) throw new Error('SVG, skip');

  let sharpMod;
  try {
    const sharpPath = path.join(__dirname, '../node_modules/sharp');
    const mod = await import(sharpPath);
    sharpMod = mod.default || mod;
  } catch { /* sharp not available */ }

  if (sharpMod) {
    try {
      // Resize large images (Wikipedia can be 5-14MB) down to 800x800
      const output = await sharpMod(data)
        .resize(800, 800, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 },
          withoutEnlargement: true,
        })
        .png({ compressionLevel: 8 })
        .toBuffer();
      return output;
    } catch (e) {
      throw new Error(`sharp failed: ${e.message}`);
    }
  }

  // No sharp: just return data as-is (JPEG stored as .png — works in browsers)
  return data;
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ─── PER-DEVICE DOWNLOAD ──────────────────────────────────────────────────────

async function downloadDevice(name, urls, idx) {
  // Stagger requests slightly to avoid rate limits
  await sleep(idx * 150);

  for (const url of urls) {
    try {
      const { data } = await fetchUrl(url);

      if (data.length < 4000) {
        continue; // Too small — likely error page
      }
      if (isSVG(data)) continue;

      let dims = null;
      if (isPNG(data))      dims = pngDimensions(data);
      else if (isJPEG(data)) dims = jpegDimensions(data);
      else continue; // Unknown format

      if (dims && (dims.w < 120 || dims.h < 120)) {
        continue; // Too small
      }

      const finalBuf = await toOutputPNG(data);
      const outPath  = path.join(IMAGES_DIR, `${name}.png`);
      fs.writeFileSync(outPath, finalBuf);

      const dimsStr  = dims ? ` ${dims.w}×${dims.h}` : '';
      const sizeStr  = finalBuf.length > 1024 ? `${Math.round(finalBuf.length / 1024)}KB` : `${finalBuf.length}B`;
      const srcLabel = url.replace(/^https?:\/\/[^/]+\//, '').slice(0, 60);
      console.log(`  ✓  ${name}: ${sizeStr}${dimsStr} ← ${srcLabel}`);
      return true;

    } catch (e) {
      // Try next URL silently
    }
  }

  console.log(`  ✗  ${name}: all URLs failed`);
  return false;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🖼  Revend Device Image Downloader');
  console.log(`📁  Output: ${IMAGES_DIR}\n`);

  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }

  const entries = Object.entries(DEVICE_URLS);
  let success = 0, fail = 0;
  const failed = [];

  // Run in small parallel batches to respect CDN rate limits
  const BATCH = 5;
  for (let i = 0; i < entries.length; i += BATCH) {
    const batch = entries.slice(i, i + BATCH);
    const results = await Promise.all(
      batch.map(([name, urls], j) => downloadDevice(name, urls, j))
    );
    results.forEach((ok, j) => {
      if (ok) success++;
      else { fail++; failed.push(batch[j][0]); }
    });
    if (i + BATCH < entries.length) await sleep(800); // pause between batches
  }

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`✅  Success: ${success} / ${success + fail}`);
  if (failed.length) {
    console.log(`❌  Failed:  ${failed.join(', ')}`);
  }
  console.log('');
}

main().catch(console.error);
