// Fix failed downloads with corrected slugs + alternative sources
import sharp from '/home/openclaw/.openclaw/workspace/revend/node_modules/sharp/lib/index.js';
import { resolve } from 'path';
import https from 'https';
import http from 'http';

const OUT_DIR = '/home/openclaw/.openclaw/workspace/revend/public/images';
const G = (slug) => `https://fdn2.gsmarena.com/vv/bigpic/${slug}.jpg`;

const devices = [
  // Samsung S24/S25 — try multiple slug variants
  ['s25ultra',   [G('samsung-galaxy-s25-ultra5g'), G('samsung-galaxy-s25ultra'), G('samsung-galaxy-s25-ultra-5g')]],
  ['s25plus',    [G('samsung-galaxy-s25plus5g'), G('samsung-galaxy-s25-plus5g'), G('samsung-galaxy-s25-5g')]],
  ['s25',        [G('samsung-galaxy-s255g'), G('samsung-galaxy-s25-5g'), G('samsung-galaxy-s25')]],
  ['s24ultra',   [G('samsung-galaxy-s24-ultra5g'), G('samsung-galaxy-s24ultra'), G('samsung-galaxy-s24-ultra-5g')]],
  ['s24plus',    [G('samsung-galaxy-s24plus'), G('samsung-galaxy-s24-plus5g'), G('samsung-galaxy-s24-plus')]],
  ['s24',        [G('samsung-galaxy-s24-5g'), G('samsung-galaxy-s245g'), G('samsung-galaxy-s24')]],
  ['s23ultra',   [G('samsung-galaxy-s23-ultra'), G('samsung-galaxy-s23-ultra5g')]],
  ['s23',        [G('samsung-galaxy-s23'), G('samsung-galaxy-s23-5g')]],

  // Google Pixel 7/9
  ['pixel9proxl', [G('google-pixel-9-pro-xl'), G('google-pixel9-pro-xl')]],
  ['pixel9pro',   [G('google-pixel-9-pro'), G('google-pixel9-pro')]],
  ['pixel9',      [G('google-pixel-9'), G('google-pixel9')]],
  ['pixel7pro',   [G('google-pixel-7-pro'), G('google-pixel7-pro')]],
  ['pixel7',      [G('google-pixel-7'), G('google-pixel7')]],

  // Apple Watch
  ['aws11', [G('apple-watch-series-11'), G('apple-watch-s11'), G('apple-watch-series11')]],
  ['aws10', [G('apple-watch-series-10'), G('apple-watch-s10'), G('apple-watch-series10')]],
  ['aws9',  [G('apple-watch-series-9'), G('apple-watch-s9'), G('apple-watch-series9')]],
  ['awse2', [G('apple-watch-se-2022'), G('apple-watch-se2'), G('apple-watch-se-2')]],

  // iPhones with wrong slugs
  ['iphone15plus',   [G('apple-iphone-15-plus'), G('apple-iphone15-plus')]],
  ['iphone14promax', [G('apple-iphone-14-pro-max'), G('apple-iphone14-pro-max')]],
  ['iphone11promax', [G('apple-iphone-11-pro-max'), G('apple-iphone11-pro-max')]],

  // iPad 10
  ['ipad10', [G('apple-ipad-10-2022'), G('apple-ipad-2022'), G('apple-ipad-10th-generation')]],

  // MacBooks — try GSMArena then fallback URLs
  ['mba13m4', [G('apple-macbook-air-13-m4-2025'), G('apple-macbook-air-13-2025'),
    'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mba13-skyblue-select-202503?wid=800&hei=800&fmt=jpeg&qlt=90']],
  ['mba13',   [G('apple-macbook-air-13-2024'), G('apple-macbook-air-m3'),
    'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mba13-midnight-select-202402?wid=800&hei=800&fmt=jpeg&qlt=90']],
  ['mba15',   [G('apple-macbook-air-15-2024'), G('apple-macbook-air-15-m3'),
    'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mba15-midnight-select-202402?wid=800&hei=800&fmt=jpeg&qlt=90']],
  ['mbp14m4', [G('apple-macbook-pro-14-2024'), G('apple-macbook-pro-14-m4'),
    'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp14-spaceblack-select-202411?wid=800&hei=800&fmt=jpeg&qlt=90']],
  ['mbp14',   [G('apple-macbook-pro-14-2023'), G('apple-macbook-pro-14-m3'),
    'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp14-spacegray-select-202310?wid=800&hei=800&fmt=jpeg&qlt=90']],
  ['mbp16m4', [G('apple-macbook-pro-16-2024'), G('apple-macbook-pro-16-m4'),
    'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp16-spaceblack-select-202411?wid=800&hei=800&fmt=jpeg&qlt=90']],
  ['mbp16',   [G('apple-macbook-pro-16-2023'), G('apple-macbook-pro-16-m3'),
    'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp16-spacegray-select-202310?wid=800&hei=800&fmt=jpeg&qlt=90']],

  // Surface Laptop — Microsoft media
  ['surfacelaptop7', [
    'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RW1nE7c?ver=7698&q=90&m=6&h=600&w=600&b=%23FFFFFF&l=f&o=t&aim=true',
    G('microsoft-surface-laptop-7'),
  ]],
  ['surfacelaptop6', [
    'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RW1lVRk?ver=d3d0&q=90&m=6&h=600&w=600&b=%23FFFFFF&l=f&o=t&aim=true',
    G('microsoft-surface-laptop-6'),
  ]],

  // PS5
  ['ps5',     [G('sony-playstation-5'), G('sony-ps5'), G('sony-playstation5')]],
  ['ps5slim', [G('sony-playstation-5-slim'), G('sony-playstation5-slim')]],

  // Nintendo
  ['switch2',    [G('nintendo-switch-2'), G('nintendo-switch2-2025')]],
  ['switcholed', [G('nintendo-switch-oled'), G('nintendo-switch-oled-model'), G('nintendo-switch-oled-2021')]],
  ['switch',     [G('nintendo-switch-2017'), G('nintendo-switch')]],

  // Xbox
  ['xboxx', [G('microsoft-xbox-series-x'), G('microsoft-xbox-series-x-2020')]],
  ['xboxs', [G('microsoft-xbox-series-s'), G('microsoft-xbox-series-s-2020')]],

  // Meta Quest
  ['quest3',  [G('meta-quest-3'), G('meta-quest-3-2023')]],
  ['quest3s', [G('meta-quest-3s'), G('meta-quest-3s-2024')]],

  // Steam Deck
  ['steamdeckoled', [G('valve-steam-deck-oled'), G('valve-steam-deck-oled-2023')]],

  // AirPods
  ['airpodspro2', [
    G('apple-airpods-pro-2nd-generation-2022'),
    G('apple-airpods-pro-2022'),
    G('apple-airpods-pro-2'),
    'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MQD83?wid=800&hei=800&fmt=jpeg&qlt=90',
  ]],

  // Sony headphones
  ['sonyxm6', [G('sony-wh-1000xm6'), G('sony-wh1000xm6'),
    'https://www.bhphotovideo.com/images/images500x500/sony_wh1000xm6_b_wh_1000xm6_wireless_noise_canceling.jpg']],
  ['sonyxm5', [G('sony-wh-1000xm5'), G('sony-wh1000xm5')]],
  ['sonyxm4', [G('sony-wh-1000xm4'), G('sony-wh1000xm4')]],

  // Bose
  ['boseqcultra', [G('bose-quietcomfort-ultra-headphones'), G('bose-quietcomfort-ultra'),
    'https://assets.bose.com/content/dam/cloudassets/Bose_DAM/Web/consumer_electronics/global/products/headphones/qc_ultra_headphones/product_silo_images/QCUltraHeadphones_Black_Hero.png/jcr:content/renditions/cq5dam.web.600.600.png']],
  ['boseqc45', [G('bose-quietcomfort-45'), G('bose-quietcomfort45'),
    'https://assets.bose.com/content/dam/cloudassets/Bose_DAM/Web/consumer_electronics/global/products/headphones/qc45/product_silo_images/QC45_Black_Hero.png/jcr:content/renditions/cq5dam.web.600.600.png']],
];

function download(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' }
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) { res.resume(); return reject(new Error(`HTTP ${res.statusCode}`)); }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(12000, () => { req.destroy(); reject(new Error('timeout')); });
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
        if (buf.length < 4000) continue;
        await sharp(buf)
          .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
          .png({ compressionLevel: 6 })
          .toFile(outPath);
        console.log(`✅ ${filename}.png (${Math.round(buf.length/1024)}KB)`);
        ok++; success = true; break;
      } catch { /* try next */ }
    }

    if (!success) {
      console.log(`❌ ${filename}`);
      failed.push(filename);
      fail++;
    }
  }

  console.log(`\n✅ ${ok} | ❌ ${fail}`);
  if (failed.length) console.log('Still failed:', failed.join(', '));
}

main();
