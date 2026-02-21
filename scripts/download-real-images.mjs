// Download real product photos from GSMArena + Apple CDN
import sharp from '/home/openclaw/.openclaw/workspace/revend/node_modules/sharp/lib/index.js';
import { createWriteStream, existsSync } from 'fs';
import { resolve } from 'path';
import https from 'https';
import http from 'http';

const OUT_DIR = '/home/openclaw/.openclaw/workspace/revend/public/images';

// GSMArena bigpic pattern: https://fdn2.gsmarena.com/vv/bigpic/[slug].jpg
const G = (slug) => `https://fdn2.gsmarena.com/vv/bigpic/${slug}.jpg`;

// device filename → ordered list of URLs to try
const devices = [
  // ── iPhones ────────────────────────────────────────────────
  ['iphone17promax', [G('apple-iphone-17-pro-max'), G('apple-iphone-17-pro-max-')]],
  ['iphone17pro',    [G('apple-iphone-17-pro')]],
  ['iphone17',       [G('apple-iphone-17')]],
  ['iphoneair',      [G('apple-iphone-17-air'), G('apple-iphone-air')]],
  ['iphone16promax', [G('apple-iphone-16-pro-max')]],
  ['iphone16pro',    [G('apple-iphone-16-pro')]],
  ['iphone16plus',   [G('apple-iphone-16-plus')]],
  ['iphone16',       [G('apple-iphone-16')]],
  ['iphone16e',      [G('apple-iphone-16e'), G('apple-iphone-16e-')]],
  ['iphone15promax', [G('apple-iphone-15-pro-max')]],
  ['iphone15pro',    [G('apple-iphone-15-pro')]],
  ['iphone15plus',   [G('apple-iphone-15-plus')]],
  ['iphone15',       [G('apple-iphone-15')]],
  ['iphone14promax', [G('apple-iphone-14-pro-max')]],
  ['iphone14pro',    [G('apple-iphone-14-pro')]],
  ['iphone14plus',   [G('apple-iphone-14-plus')]],
  ['iphone14',       [G('apple-iphone-14')]],
  ['iphone13promax', [G('apple-iphone-13-pro-max')]],
  ['iphone13pro',    [G('apple-iphone-13-pro')]],
  ['iphone13',       [G('apple-iphone-13')]],
  ['iphone12promax', [G('apple-iphone-12-pro-max')]],
  ['iphone12pro',    [G('apple-iphone-12-pro')]],
  ['iphone12',       [G('apple-iphone-12')]],
  ['iphone11promax', [G('apple-iphone-11-pro-max')]],
  ['iphone11pro',    [G('apple-iphone-11-pro')]],
  ['iphone11',       [G('apple-iphone-11')]],

  // ── Samsung Galaxy S ───────────────────────────────────────
  ['s25ultra',   [G('samsung-galaxy-s25-ultra-5g'), G('samsung-galaxy-s25-ultra')]],
  ['s25plus',    [G('samsung-galaxy-s25-5g'), G('samsung-galaxy-s25-plus')]],
  ['s25',        [G('samsung-galaxy-s25-5g'), G('samsung-galaxy-s25')]],
  ['s24ultra',   [G('samsung-galaxy-s24-ultra')]],
  ['s24plus',    [G('samsung-galaxy-s24-5g'), G('samsung-galaxy-s24-plus')]],
  ['s24',        [G('samsung-galaxy-s24')]],
  ['s23ultra',   [G('samsung-galaxy-s23-ultra')]],
  ['s23plus',    [G('samsung-galaxy-s23-5g'), G('samsung-galaxy-s23-plus')]],
  ['s23',        [G('samsung-galaxy-s23')]],
  ['s22ultra',   [G('samsung-galaxy-s22-ultra-5g'), G('samsung-galaxy-s22-ultra')]],
  ['s22',        [G('samsung-galaxy-s22-5g'), G('samsung-galaxy-s22')]],
  ['galaxya55',  [G('samsung-galaxy-a55')]],
  ['galaxya35',  [G('samsung-galaxy-a35')]],

  // ── Samsung Z series ───────────────────────────────────────
  ['zfold6',  [G('samsung-galaxy-z-fold6'), G('samsung-galaxy-z-fold-6')]],
  ['zflip7',  [G('samsung-galaxy-z-flip7'), G('samsung-galaxy-z-flip-7')]],
  ['zflip6',  [G('samsung-galaxy-z-flip6'), G('samsung-galaxy-z-flip-6')]],

  // ── Google Pixel ───────────────────────────────────────────
  ['pixel9proxl', [G('google-pixel-9-pro-xl')]],
  ['pixel9pro',   [G('google-pixel-9-pro')]],
  ['pixel9',      [G('google-pixel-9')]],
  ['pixel8pro',   [G('google-pixel-8-pro')]],
  ['pixel8',      [G('google-pixel-8')]],
  ['pixel7pro',   [G('google-pixel-7-pro')]],
  ['pixel7',      [G('google-pixel-7')]],
  ['pixel6pro',   [G('google-pixel-6-pro')]],
  ['pixel6',      [G('google-pixel-6')]],

  // ── OnePlus ────────────────────────────────────────────────
  ['oneplus12', [G('oneplus-12'), G('oneplus-12-5g')]],

  // ── Apple Watch ────────────────────────────────────────────
  ['awultra3', [G('apple-watch-ultra-3'), G('apple-watch-ultra3')]],
  ['awultra2', [G('apple-watch-ultra-2'), G('apple-watch-ultra2')]],
  ['aws11',    [G('apple-watch-series-11'), G('apple-watch-s11')]],
  ['aws10',    [G('apple-watch-series-10'), G('apple-watch-s10')]],
  ['aws9',     [G('apple-watch-series-9'), G('apple-watch-s9')]],
  ['awse2',    [G('apple-watch-se-2022'), G('apple-watch-se-2')]],

  // ── Samsung Galaxy Watch ───────────────────────────────────
  ['gw7', [G('samsung-galaxy-watch7'), G('samsung-galaxy-watch-7')]],
  ['gw6', [G('samsung-galaxy-watch6'), G('samsung-galaxy-watch-6')]],

  // ── iPads ──────────────────────────────────────────────────
  ['ipadpro13',  [G('apple-ipad-pro-13-2024'), G('apple-ipad-pro-129-2024'), G('apple-ipad-pro-13-m4')]],
  ['ipadpro11',  [G('apple-ipad-pro-11-2024'), G('apple-ipad-pro-11-m4')]],
  ['ipadair13',  [G('apple-ipad-air-13-2024'), G('apple-ipad-air-m2-13')]],
  ['ipadair11',  [G('apple-ipad-air-11-2024'), G('apple-ipad-air-m2-11')]],
  ['ipadmini7',  [G('apple-ipad-mini-2024'), G('apple-ipad-mini-7')]],
  ['ipad10',     [G('apple-ipad-2022'), G('apple-ipad-10')]],

  // ── MacBooks ───────────────────────────────────────────────
  ['mba13m4', [G('apple-macbook-air-13-2025'), G('apple-macbook-air-13-m4')]],
  ['mba13',   [G('apple-macbook-air-13-2024'), G('apple-macbook-air-13-m3')]],
  ['mba15',   [G('apple-macbook-air-15-2024'), G('apple-macbook-air-15-m3')]],
  ['mbp14m4', [G('apple-macbook-pro-14-2024'), G('apple-macbook-pro-14-m4')]],
  ['mbp14',   [G('apple-macbook-pro-14-2023'), G('apple-macbook-pro-14-m3')]],
  ['mbp16m4', [G('apple-macbook-pro-16-2024'), G('apple-macbook-pro-16-m4')]],
  ['mbp16',   [G('apple-macbook-pro-16-2023'), G('apple-macbook-pro-16-m3')]],

  // ── Surface ────────────────────────────────────────────────
  ['surfacelaptop7', [G('microsoft-surface-laptop-7'), G('microsoft-surface-laptop7')]],
  ['surfacelaptop6', [G('microsoft-surface-laptop-6'), G('microsoft-surface-laptop6')]],

  // ── Consoles ───────────────────────────────────────────────
  ['ps5',          [G('sony-playstation-5'), G('sony-ps5')]],
  ['ps5slim',      [G('sony-playstation-5-slim'), G('sony-ps5-slim')]],
  ['switch2',      [G('nintendo-switch-2'), G('nintendo-switch2')]],
  ['switcholed',   [G('nintendo-switch-oled'), G('nintendo-switch-oled-model')]],
  ['switch',       [G('nintendo-switch'), G('nintendo-switch-2017')]],
  ['xboxx',        [G('microsoft-xbox-series-x')]],
  ['xboxs',        [G('microsoft-xbox-series-s')]],
  ['quest3',       [G('meta-quest-3')]],
  ['quest3s',      [G('meta-quest-3s')]],
  ['steamdeckoled',[G('valve-steam-deck-oled'), G('valve-steam-deck')]],

  // ── Headphones ─────────────────────────────────────────────
  ['airpodspro2',  [G('apple-airpods-pro-2nd-generation-2022'), G('apple-airpods-pro-2022')]],
  ['sonyxm6',      [G('sony-wh-1000xm6'), G('sony-wh1000xm6')]],
  ['sonyxm5',      [G('sony-wh-1000xm5'), G('sony-wh1000xm5')]],
  ['sonyxm4',      [G('sony-wh-1000xm4'), G('sony-wh1000xm4')]],
  ['boseqcultra',  [G('bose-quietcomfort-ultra-headphones'), G('bose-quietcomfort-ultra')]],
  ['boseqc45',     [G('bose-quietcomfort-45'), G('bose-quietcomfort45')]],

  // ── Galaxy Tab ─────────────────────────────────────────────
  ['tabs9ultra', [G('samsung-galaxy-tab-s9-ultra')]],
  ['tabs9plus',  [G('samsung-galaxy-tab-s9-5g'), G('samsung-galaxy-tab-s9-plus')]],
  ['tabs9',      [G('samsung-galaxy-tab-s9')]],
];

function download(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible)' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

async function main() {
  let ok = 0, fail = 0;
  const failed = [];

  for (const [filename, urls] of devices) {
    const outPath = resolve(OUT_DIR, `${filename}.png`);
    let success = false;

    for (const url of urls) {
      try {
        const buf = await download(url);
        // Validate it's a real image (>5KB)
        if (buf.length < 5000) { continue; }
        // Convert to PNG, resize to max 800px wide
        await sharp(buf)
          .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
          .png({ compressionLevel: 6 })
          .toFile(outPath);
        console.log(`✅ ${filename}.png (${Math.round(buf.length/1024)}KB from ${url.split('/').pop()})`);
        ok++;
        success = true;
        break;
      } catch (e) {
        // try next URL
      }
    }

    if (!success) {
      console.log(`❌ ${filename} — no source found`);
      failed.push(filename);
      fail++;
    }
  }

  console.log(`\n✅ ${ok} downloaded | ❌ ${fail} failed`);
  if (failed.length) console.log('Failed:', failed.join(', '));
}

main();
