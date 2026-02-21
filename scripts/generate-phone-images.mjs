// Regenerate original phone/watch/Samsung images at 1000×1000 (2× retina)
import sharp from '/home/openclaw/.openclaw/workspace/revend/node_modules/sharp/lib/index.js';
import { resolve } from 'path';

const OUT_DIR = '/home/openclaw/.openclaw/workspace/revend/public/images';

const devices = [
  // iPhones
  { filename: 'iphone11',       name: 'iPhone 11',          brand: 'Apple',   bg1: '#1A2A1A', bg2: '#2A3F2A', accent: '#30D158', shape: 'phone' },
  { filename: 'iphone12',       name: 'iPhone 12',           brand: 'Apple',   bg1: '#1A1A2E', bg2: '#2A2A4A', accent: '#0071E3', shape: 'phone' },
  { filename: 'iphone13',       name: 'iPhone 13',           brand: 'Apple',   bg1: '#1A2A3A', bg2: '#253D56', accent: '#0071E3', shape: 'phone' },
  { filename: 'iphone13promax', name: 'iPhone 13 Pro Max',   brand: 'Apple',   bg1: '#1C1C1E', bg2: '#2A2A30', accent: '#FFD60A', shape: 'phone' },
  { filename: 'iphone14',       name: 'iPhone 14',           brand: 'Apple',   bg1: '#2A1A2A', bg2: '#3D2A3D', accent: '#BF5AF2', shape: 'phone' },
  { filename: 'iphone14plus',   name: 'iPhone 14 Plus',      brand: 'Apple',   bg1: '#1A1A1A', bg2: '#2C2C2C', accent: '#0071E3', shape: 'phone' },
  { filename: 'iphone14pro',    name: 'iPhone 14 Pro',       brand: 'Apple',   bg1: '#1C1C1E', bg2: '#2C2C2E', accent: '#FFD60A', shape: 'phone' },
  { filename: 'iphone14promax', name: 'iPhone 14 Pro Max',   brand: 'Apple',   bg1: '#1A1A1A', bg2: '#262626', accent: '#FFD60A', shape: 'phone' },
  { filename: 'iphone15',       name: 'iPhone 15',           brand: 'Apple',   bg1: '#1A2835', bg2: '#253D52', accent: '#0071E3', shape: 'phone' },
  { filename: 'iphone15plus',   name: 'iPhone 15 Plus',      brand: 'Apple',   bg1: '#1C2E1C', bg2: '#2A3F2A', accent: '#30D158', shape: 'phone' },
  { filename: 'iphone15pro',    name: 'iPhone 15 Pro',       brand: 'Apple',   bg1: '#1C1C1E', bg2: '#2E2A24', accent: '#FF9F0A', shape: 'phone' },
  { filename: 'iphone15promax', name: 'iPhone 15 Pro Max',   brand: 'Apple',   bg1: '#1A1A18', bg2: '#2C2A20', accent: '#FFD60A', shape: 'phone' },
  { filename: 'iphone16',       name: 'iPhone 16',           brand: 'Apple',   bg1: '#1A2838', bg2: '#253D58', accent: '#0071E3', shape: 'phone' },
  { filename: 'iphone16e',      name: 'iPhone 16e',          brand: 'Apple',   bg1: '#1C1C1E', bg2: '#2C2C2E', accent: '#0071E3', shape: 'phone' },
  { filename: 'iphone16plus',   name: 'iPhone 16 Plus',      brand: 'Apple',   bg1: '#1C2A1C', bg2: '#2A3F2A', accent: '#30D158', shape: 'phone' },
  { filename: 'iphone16pro',    name: 'iPhone 16 Pro',       brand: 'Apple',   bg1: '#1C1C1E', bg2: '#262420', accent: '#FF9F0A', shape: 'phone' },
  { filename: 'iphone16promax', name: 'iPhone 16 Pro Max',   brand: 'Apple',   bg1: '#1A1A18', bg2: '#28261E', accent: '#FF9F0A', shape: 'phone' },
  { filename: 'iphone17',       name: 'iPhone 17',           brand: 'Apple',   bg1: '#1A2C3A', bg2: '#253F56', accent: '#0071E3', shape: 'phone' },
  { filename: 'iphone17pro',    name: 'iPhone 17 Pro',       brand: 'Apple',   bg1: '#1C1C1E', bg2: '#1E1C18', accent: '#FF9F0A', shape: 'phone' },
  { filename: 'iphone17promax', name: 'iPhone 17 Pro Max',   brand: 'Apple',   bg1: '#181816', bg2: '#22201A', accent: '#FFD60A', shape: 'phone' },
  { filename: 'iphoneair',      name: 'iPhone Air',          brand: 'Apple',   bg1: '#E8F0F8', bg2: '#C8D8F0', accent: '#0071E3', shape: 'phone' },
  // Google Pixel
  { filename: 'pixel7pro',      name: 'Pixel 7 Pro',         brand: 'Google',  bg1: '#1E2A38', bg2: '#2C3D52', accent: '#4285F4', shape: 'phone' },
  { filename: 'pixel8',         name: 'Pixel 8',             brand: 'Google',  bg1: '#1E1E2E', bg2: '#2C2C42', accent: '#4285F4', shape: 'phone' },
  { filename: 'pixel8pro',      name: 'Pixel 8 Pro',         brand: 'Google',  bg1: '#1A1A2A', bg2: '#26263A', accent: '#4285F4', shape: 'phone' },
  { filename: 'pixel9',         name: 'Pixel 9',             brand: 'Google',  bg1: '#1A2838', bg2: '#253D52', accent: '#4285F4', shape: 'phone' },
  { filename: 'pixel9pro',      name: 'Pixel 9 Pro',         brand: 'Google',  bg1: '#0D1A28', bg2: '#162540', accent: '#4285F4', shape: 'phone' },
  // Samsung Galaxy S
  { filename: 's24',            name: 'Galaxy S24',          brand: 'Samsung', bg1: '#0A1628', bg2: '#162540', accent: '#1428A0', shape: 'phone' },
  { filename: 's24ultra',       name: 'Galaxy S24 Ultra',    brand: 'Samsung', bg1: '#0C1018', bg2: '#161E2C', accent: '#1428A0', shape: 'phone' },
  { filename: 's25',            name: 'Galaxy S25',          brand: 'Samsung', bg1: '#0A1428', bg2: '#142040', accent: '#1428A0', shape: 'phone' },
  { filename: 's25plus',        name: 'Galaxy S25+',         brand: 'Samsung', bg1: '#0C1830', bg2: '#162645', accent: '#1428A0', shape: 'phone' },
  { filename: 's25ultra',       name: 'Galaxy S25 Ultra',    brand: 'Samsung', bg1: '#080C18', bg2: '#121A2E', accent: '#1428A0', shape: 'phone' },
  { filename: 's23ultra',       name: 'Galaxy S23 Ultra',    brand: 'Samsung', bg1: '#0A0A18', bg2: '#14142A', accent: '#1428A0', shape: 'phone' },
  // Samsung Z series
  { filename: 'zflip6',         name: 'Galaxy Z Flip6',      brand: 'Samsung', bg1: '#1A0A2A', bg2: '#2A1040', accent: '#9B00F5', shape: 'phone-flip' },
  { filename: 'zflip7',         name: 'Galaxy Z Flip7',      brand: 'Samsung', bg1: '#0A1A0A', bg2: '#103010', accent: '#4CAF50', shape: 'phone-flip' },
  { filename: 'zfold6',         name: 'Galaxy Z Fold6',      brand: 'Samsung', bg1: '#1A1A28', bg2: '#26263A', accent: '#1428A0', shape: 'phone-fold' },
  // Apple Watch
  { filename: 'aws11',          name: 'Apple Watch Series 11',brand: 'Apple', bg1: '#1C1C1E', bg2: '#2C2C2E', accent: '#30D158', shape: 'watch' },
  { filename: 'awultra2',       name: 'Apple Watch Ultra 2', brand: 'Apple',   bg1: '#1B2838', bg2: '#2A3F5F', accent: '#FF6B00', shape: 'watch-ultra' },
];

function getShape(shape, bg1, bg2, accent) {
  switch (shape) {
    case 'phone':
      return `
        <rect x="165" y="58" width="170" height="316" rx="24" ry="24" fill="${bg2}" stroke="${accent}33" stroke-width="1.5"/>
        <!-- Screen -->
        <rect x="175" y="94" width="150" height="252" rx="8" ry="8" fill="#060810"/>
        <rect x="178" y="97" width="144" height="246" rx="7" ry="7" fill="url(#screenGlow)"/>
        <!-- Dynamic island -->
        <rect x="218" y="74" width="64" height="13" rx="6.5" ry="6.5" fill="#000"/>
        <!-- Home indicator -->
        <rect x="218" y="353" width="64" height="5" rx="2.5" fill="${accent}66"/>
        <!-- Power button -->
        <rect x="335" y="138" width="4" height="42" rx="2" fill="${accent}77"/>
        <!-- Volume buttons -->
        <rect x="161" y="123" width="4" height="32" rx="2" fill="${accent}66"/>
        <rect x="161" y="164" width="4" height="32" rx="2" fill="${accent}66"/>
        <!-- Camera module -->
        <rect x="192" y="108" width="56" height="56" rx="16" fill="#000000aa" stroke="${accent}22" stroke-width="1"/>
        <circle cx="212" cy="128" r="10" fill="#111" stroke="${accent}44" stroke-width="1"/>
        <circle cx="212" cy="128" r="6" fill="${accent}22"/>
        <circle cx="232" cy="148" r="10" fill="#111" stroke="${accent}44" stroke-width="1"/>
        <circle cx="232" cy="148" r="6" fill="${accent}22"/>
      `;
    case 'phone-flip':
      return `
        <!-- Closed flip phone -->
        <!-- Top half -->
        <rect x="178" y="88" width="144" height="142" rx="20" ry="20" fill="${bg2}" stroke="${accent}33" stroke-width="1.5"/>
        <rect x="188" y="98" width="124" height="122" rx="10" ry="10" fill="#060810"/>
        <rect x="191" y="101" width="118" height="116" rx="8" ry="8" fill="url(#screenGlow)"/>
        <!-- Hinge -->
        <rect x="168" y="228" width="164" height="16" rx="6" fill="${accent}44" stroke="${accent}66" stroke-width="1"/>
        <!-- Bottom half -->
        <rect x="178" y="242" width="144" height="142" rx="20" ry="20" fill="${bg2}" stroke="${accent}33" stroke-width="1.5"/>
        <!-- Keyboard area hint -->
        <rect x="190" y="258" width="120" height="110" rx="8" fill="${bg1}88"/>
        <!-- Logo dot -->
        <circle cx="250" cy="313" r="8" fill="${accent}44" stroke="${accent}66" stroke-width="1"/>
        <!-- Power button -->
        <rect x="322" y="252" width="4" height="30" rx="2" fill="${accent}66"/>
      `;
    case 'phone-fold':
      return `
        <!-- Unfolded tablet-phone -->
        <rect x="120" y="88" width="260" height="280" rx="18" ry="18" fill="${bg2}" stroke="${accent}33" stroke-width="1.5"/>
        <!-- Crease line -->
        <rect x="246" y="92" width="8" height="272" rx="4" fill="${accent}22"/>
        <!-- Left panel -->
        <rect x="130" y="100" width="112" height="256" rx="8" ry="8" fill="#060810"/>
        <rect x="134" y="104" width="104" height="248" rx="6" ry="6" fill="url(#screenGlow)"/>
        <!-- Right panel -->
        <rect x="258" y="100" width="112" height="256" rx="8" ry="8" fill="#060810"/>
        <rect x="262" y="104" width="104" height="248" rx="6" ry="6" fill="url(#screenGlow)"/>
        <!-- Camera -->
        <circle cx="155" cy="120" r="8" fill="#111" stroke="${accent}44" stroke-width="1"/>
        <!-- Home indicator -->
        <rect x="210" y="352" width="80" height="5" rx="2.5" fill="${accent}55"/>
        <!-- Power button -->
        <rect x="380" y="148" width="4" height="38" rx="2" fill="${accent}66"/>
      `;
    case 'watch':
      return `
        <rect x="215" y="53" width="70" height="82" rx="8" fill="${bg2}" stroke="${accent}22" stroke-width="1"/>
        <rect x="215" y="295" width="70" height="82" rx="8" fill="${bg2}" stroke="${accent}22" stroke-width="1"/>
        <rect x="168" y="143" width="164" height="147" rx="40" ry="40" fill="${bg2}" stroke="${accent}44" stroke-width="2"/>
        <rect x="182" y="158" width="136" height="117" rx="28" ry="28" fill="#050610"/>
        <rect x="188" y="164" width="124" height="105" rx="24" ry="24" fill="url(#screenGlow)"/>
        <!-- Crown -->
        <rect x="332" y="193" width="10" height="32" rx="4" fill="${bg2}" stroke="${accent}44" stroke-width="1"/>
        <circle cx="337" cy="209" r="7" fill="${accent}66"/>
      `;
    case 'watch-ultra':
      return `
        <rect x="210" y="46" width="80" height="87" rx="8" fill="${bg2}" stroke="${accent}22" stroke-width="1"/>
        <rect x="210" y="287" width="80" height="87" rx="8" fill="${bg2}" stroke="${accent}22" stroke-width="1"/>
        <rect x="155" y="136" width="190" height="158" rx="30" ry="30" fill="${bg2}" stroke="${accent}66" stroke-width="2.5"/>
        <rect x="170" y="151" width="160" height="128" rx="22" ry="22" fill="#050510"/>
        <rect x="176" y="157" width="148" height="116" rx="18" ry="18" fill="url(#screenGlow)"/>
        <rect x="344" y="173" width="10" height="37" rx="4" fill="${bg2}" stroke="${accent}66" stroke-width="1.5"/>
        <circle cx="349" cy="191" r="7" fill="${accent}88"/>
        <rect x="155" y="173" width="8" height="24" rx="3" fill="${accent}88"/>
      `;
    default:
      return `<rect x="150" y="100" width="200" height="200" rx="12" fill="${bg2}"/>`;
  }
}

function generateSVG(device) {
  const { name, brand, bg1, bg2, accent, shape } = device;
  return `<svg width="1000" height="1000" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bg1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${bg2};stop-opacity:1" />
    </linearGradient>
    <radialGradient id="screenGlow" cx="50%" cy="30%" r="60%">
      <stop offset="0%" style="stop-color:${accent};stop-opacity:0.18" />
      <stop offset="100%" style="stop-color:#000000;stop-opacity:0" />
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:${accent};stop-opacity:0.12" />
      <stop offset="100%" style="stop-color:${accent};stop-opacity:0" />
    </radialGradient>
  </defs>
  <rect width="1000" height="1000" fill="url(#bg)"/>
  <ellipse cx="250" cy="220" rx="210" ry="190" fill="url(#glow)"/>
  ${getShape(shape, bg1, bg2, accent)}
  <text x="250" y="392"
    font-family="Arial, Helvetica, sans-serif"
    font-size="13" font-weight="bold" letter-spacing="2"
    fill="${accent}" opacity="0.9" text-anchor="middle">${brand.toUpperCase()}</text>
  <text x="250" y="418"
    font-family="Arial, Helvetica, sans-serif"
    font-size="17" font-weight="bold" letter-spacing="0.3"
    fill="#FFFFFF" opacity="0.95" text-anchor="middle">${name}</text>
</svg>`;
}

async function main() {
  let count = 0;
  for (const device of devices) {
    const pngPath = resolve(OUT_DIR, `${device.filename}.png`);
    const svgContent = generateSVG(device);
    try {
      await sharp(Buffer.from(svgContent), { density: 300 })
        .png({ compressionLevel: 6 })
        .toFile(pngPath);
      console.log(`✅ ${device.filename}.png — ${device.name}`);
      count++;
    } catch (e) {
      console.error(`❌ ${device.filename}: ${e.message}`);
    }
  }
  console.log(`\nDone. Regenerated: ${count} phone/watch images at 1000×1000`);
}

main();
