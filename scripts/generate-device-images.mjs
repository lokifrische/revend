// Generate professional product-style SVG images for missing devices
import sharp from '/home/openclaw/.openclaw/workspace/revend/node_modules/sharp/lib/index.js';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const OUT_DIR = '/home/openclaw/.openclaw/workspace/revend/public/images';

// Device definitions with brand colors and SVG shapes
const devices = [
  {
    filename: 'ipadair13',
    name: 'iPad Air 13"',
    brand: 'Apple',
    bg1: '#1C1C1E', bg2: '#2C2C2E',
    accent: '#0071E3',
    shape: 'tablet',
  },
  {
    filename: 'mbp16',
    name: 'MacBook Pro 16"',
    brand: 'Apple',
    bg1: '#1C1C1E', bg2: '#3A3A3C',
    accent: '#0071E3',
    shape: 'laptop',
  },
  {
    filename: 'mba15',
    name: 'MacBook Air 15"',
    brand: 'Apple',
    bg1: '#E8D5B7', bg2: '#C8A87A',
    accent: '#0071E3',
    shape: 'laptop',
  },
  {
    filename: 'mbp14',
    name: 'MacBook Pro 14"',
    brand: 'Apple',
    bg1: '#1C1C1E', bg2: '#3A3A3C',
    accent: '#0071E3',
    shape: 'laptop',
  },
  {
    filename: 'mba13',
    name: 'MacBook Air 13"',
    brand: 'Apple',
    bg1: '#F5F5F0', bg2: '#E0E0D8',
    accent: '#0071E3',
    shape: 'laptop',
  },
  {
    filename: 'ps5',
    name: 'PlayStation 5',
    brand: 'Sony',
    bg1: '#003087', bg2: '#006FBC',
    accent: '#00AEEF',
    shape: 'console',
  },
  {
    filename: 'ps5slim',
    name: 'PS5 Slim',
    brand: 'Sony',
    bg1: '#1A1A2E', bg2: '#16213E',
    accent: '#0F3460',
    shape: 'console',
  },
  {
    filename: 'switch2',
    name: 'Nintendo Switch 2',
    brand: 'Nintendo',
    bg1: '#E60012', bg2: '#C0000F',
    accent: '#FFFFFF',
    shape: 'handheld',
  },
  {
    filename: 'switcholed',
    name: 'Switch OLED',
    brand: 'Nintendo',
    bg1: '#E60012', bg2: '#C0000F',
    accent: '#FFFFFF',
    shape: 'handheld',
  },
  {
    filename: 'airpodspro2',
    name: 'AirPods Pro 2',
    brand: 'Apple',
    bg1: '#F5F5F7', bg2: '#E0E0E5',
    accent: '#0071E3',
    shape: 'earbuds',
  },
  {
    filename: 'sonyxm6',
    name: 'Sony WH-1000XM6',
    brand: 'Sony',
    bg1: '#1C1C1C', bg2: '#333333',
    accent: '#FF6600',
    shape: 'headphones',
  },
];

function getShape(shape, bg1, bg2, accent) {
  switch (shape) {
    case 'tablet':
      return `
        <!-- iPad silhouette -->
        <rect x="145" y="60" width="210" height="280" rx="18" ry="18" fill="${bg2}" stroke="${accent}22" stroke-width="1"/>
        <rect x="155" y="78" width="190" height="245" rx="4" ry="4" fill="#111"/>
        <circle cx="250" cy="330" r="8" fill="${accent}44" stroke="${accent}88" stroke-width="1"/>
        <rect x="155" y="78" width="190" height="245" rx="4" ry="4" fill="${bg1}11"/>
        <!-- Screen glow -->
        <rect x="160" y="83" width="180" height="230" rx="3" ry="3" fill="url(#screenGlow)"/>
      `;
    case 'laptop':
      return `
        <!-- MacBook silhouette -->
        <!-- Screen lid -->
        <rect x="100" y="80" width="300" height="190" rx="10" ry="10" fill="${bg2}" stroke="${accent}22" stroke-width="1"/>
        <rect x="112" y="92" width="276" height="166" rx="4" ry="4" fill="#0D0D0D"/>
        <rect x="115" y="95" width="270" height="160" rx="3" ry="3" fill="url(#screenGlow)"/>
        <!-- Base -->
        <rect x="80" y="268" width="340" height="32" rx="6" ry="6" fill="${bg2}"/>
        <!-- Hinge line -->
        <rect x="80" y="267" width="340" height="3" rx="1" fill="${accent}44"/>
        <!-- Trackpad -->
        <rect x="185" y="278" width="130" height="14" rx="4" ry="4" fill="${bg1}66" stroke="${accent}33" stroke-width="1"/>
      `;
    case 'console':
      return `
        <!-- PS5 silhouette -->
        <ellipse cx="250" cy="215" rx="100" ry="145" fill="${bg2}" stroke="${accent}22" stroke-width="1"/>
        <ellipse cx="250" cy="215" rx="75" ry="110" fill="${bg1}"/>
        <!-- Disc slot -->
        <rect x="175" y="200" width="150" height="4" rx="2" fill="${accent}66"/>
        <!-- Power button -->
        <circle cx="250" cy="155" r="8" fill="${accent}88" stroke="${accent}" stroke-width="1.5"/>
        <!-- USB ports -->
        <rect x="225" y="280" width="12" height="6" rx="2" fill="${accent}55"/>
        <rect x="263" y="280" width="12" height="6" rx="2" fill="${accent}55"/>
      `;
    case 'handheld':
      return `
        <!-- Nintendo Switch silhouette -->
        <!-- Left Joy-Con -->
        <rect x="80" y="120" width="70" height="160" rx="30" ry="30" fill="${accent}22" stroke="${accent}55" stroke-width="1.5"/>
        <!-- Right Joy-Con -->
        <rect x="350" y="120" width="70" height="160" rx="30" ry="30" fill="${accent}22" stroke="${accent}55" stroke-width="1.5"/>
        <!-- Main body -->
        <rect x="145" y="100" width="210" height="200" rx="6" ry="6" fill="${bg2}"/>
        <!-- Screen -->
        <rect x="155" y="112" width="190" height="176" rx="4" ry="4" fill="#0D0D0D"/>
        <rect x="158" y="115" width="184" height="170" rx="3" ry="3" fill="url(#screenGlow)"/>
        <!-- Joy-Con buttons -->
        <circle cx="115" cy="165" r="7" fill="${bg1}" stroke="${accent}88" stroke-width="1.5"/>
        <circle cx="385" cy="165" r="7" fill="${bg1}" stroke="${accent}88" stroke-width="1.5"/>
      `;
    case 'earbuds':
      return `
        <!-- AirPods Pro silhouette -->
        <!-- Left earbud -->
        <ellipse cx="185" cy="190" rx="38" ry="48" fill="${bg2}" stroke="#88888844" stroke-width="1.5"/>
        <ellipse cx="185" cy="190" rx="28" ry="35" fill="#DDDDDE"/>
        <!-- Left stem -->
        <rect x="179" y="228" width="12" height="45" rx="6" fill="${bg2}" stroke="#88888844" stroke-width="1"/>
        <!-- Right earbud -->
        <ellipse cx="315" cy="190" rx="38" ry="48" fill="${bg2}" stroke="#88888844" stroke-width="1.5"/>
        <ellipse cx="315" cy="190" rx="28" ry="35" fill="#DDDDDE"/>
        <!-- Right stem -->
        <rect x="309" y="228" width="12" height="45" rx="6" fill="${bg2}" stroke="#88888844" stroke-width="1"/>
        <!-- Speaker mesh dots -->
        <circle cx="180" cy="187" r="2.5" fill="#BBBBBB"/>
        <circle cx="189" cy="187" r="2.5" fill="#BBBBBB"/>
        <circle cx="184.5" cy="196" r="2.5" fill="#BBBBBB"/>
        <circle cx="310" cy="187" r="2.5" fill="#BBBBBB"/>
        <circle cx="319" cy="187" r="2.5" fill="#BBBBBB"/>
        <circle cx="314.5" cy="196" r="2.5" fill="#BBBBBB"/>
      `;
    case 'headphones':
      return `
        <!-- Headphone arc -->
        <path d="M 130 220 Q 130 100 250 100 Q 370 100 370 220" 
              stroke="${bg2}" stroke-width="22" fill="none" stroke-linecap="round"/>
        <!-- Left cup -->
        <ellipse cx="130" cy="235" rx="42" ry="52" fill="${bg2}" stroke="${accent}33" stroke-width="1.5"/>
        <ellipse cx="130" cy="235" rx="30" ry="38" fill="#111111"/>
        <circle cx="130" cy="235" r="16" fill="${accent}33"/>
        <!-- Right cup -->
        <ellipse cx="370" cy="235" rx="42" ry="52" fill="${bg2}" stroke="${accent}33" stroke-width="1.5"/>
        <ellipse cx="370" cy="235" rx="30" ry="38" fill="#111111"/>
        <circle cx="370" cy="235" r="16" fill="${accent}33"/>
        <!-- Headband padding -->
        <path d="M 155 170 Q 250 120 345 170" 
              stroke="${accent}44" stroke-width="12" fill="none" stroke-linecap="round"/>
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
      <stop offset="0%" style="stop-color:${accent};stop-opacity:0.15" />
      <stop offset="100%" style="stop-color:#000000;stop-opacity:0" />
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:${accent};stop-opacity:0.12" />
      <stop offset="100%" style="stop-color:${accent};stop-opacity:0" />
    </radialGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1000" height="1000" fill="url(#bg)"/>
  
  <!-- Subtle glow -->
  <ellipse cx="250" cy="220" rx="200" ry="180" fill="url(#glow)"/>
  
  <!-- Device shape -->
  ${getShape(shape, bg1, bg2, accent)}
  
  <!-- Brand name -->
  <text x="250" y="390" 
    font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif"
    font-size="13" font-weight="500" letter-spacing="2"
    fill="${accent}" opacity="0.9" text-anchor="middle"
    text-rendering="optimizeLegibility">${brand.toUpperCase()}</text>
  
  <!-- Device name -->
  <text x="250" y="415"
    font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif"
    font-size="17" font-weight="600" letter-spacing="0.3"
    fill="#FFFFFF" opacity="0.95" text-anchor="middle"
    text-rendering="optimizeLegibility">${name}</text>
</svg>`;
}

async function main() {
  for (const device of devices) {
    const svgContent = generateSVG(device);
    const svgPath = resolve(OUT_DIR, `${device.filename}.svg`);
    const pngPath = resolve(OUT_DIR, `${device.filename}.png`);
    
    // Write SVG first
    writeFileSync(svgPath, svgContent);
    
    // Convert SVG to PNG using sharp
    try {
      await sharp(Buffer.from(svgContent), { density: 300 })
        .png({ compressionLevel: 6 })
        .toFile(pngPath);
      console.log(`✅ ${device.filename}.png (${device.name})`);
    } catch (e) {
      console.error(`❌ ${device.filename}:`, e.message);
    }
  }
  console.log('Done generating placeholder images!');
}

main();
