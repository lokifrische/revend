// Generate SVG-based product images for all missing device families
import sharp from '/home/openclaw/.openclaw/workspace/revend/node_modules/sharp/lib/index.js';
import { } from 'fs';
import { resolve } from 'path';

const OUT_DIR = '/home/openclaw/.openclaw/workspace/revend/public/images';

const devices = [
  // ── Apple Watch (missing) ──────────────────────────────────
  { filename: 'aws9',       name: 'Apple Watch Series 9', brand: 'Apple',   bg1: '#1C1C1E', bg2: '#2C2C2E', accent: '#0071E3', shape: 'watch' },
  { filename: 'aws10',      name: 'Apple Watch Series 10',brand: 'Apple',   bg1: '#1C1C1E', bg2: '#3A3A3C', accent: '#0071E3', shape: 'watch' },
  { filename: 'awultra3',   name: 'Apple Watch Ultra 3',  brand: 'Apple',   bg1: '#1B2838', bg2: '#2A3F5F', accent: '#FF6B00', shape: 'watch-ultra' },
  { filename: 'awse2',      name: 'Apple Watch SE 2',     brand: 'Apple',   bg1: '#F5F5F0', bg2: '#E0E0D8', accent: '#0071E3', shape: 'watch' },

  // ── Samsung Galaxy S (missing) ─────────────────────────────
  { filename: 's22',        name: 'Galaxy S22',           brand: 'Samsung', bg1: '#0C1B33', bg2: '#1A2F50', accent: '#1428A0', shape: 'phone' },
  { filename: 's22ultra',   name: 'Galaxy S22 Ultra',     brand: 'Samsung', bg1: '#1A1A1A', bg2: '#2C2C2C', accent: '#1428A0', shape: 'phone' },
  { filename: 's23',        name: 'Galaxy S23',           brand: 'Samsung', bg1: '#0C1B33', bg2: '#1A3055', accent: '#1428A0', shape: 'phone' },
  { filename: 's23plus',    name: 'Galaxy S23+',          brand: 'Samsung', bg1: '#12223D', bg2: '#1E3560', accent: '#1428A0', shape: 'phone' },
  { filename: 's24plus',    name: 'Galaxy S24+',          brand: 'Samsung', bg1: '#0A1628', bg2: '#162540', accent: '#1428A0', shape: 'phone' },

  // ── Samsung Galaxy A (missing) ─────────────────────────────
  { filename: 'galaxya35',  name: 'Galaxy A35',           brand: 'Samsung', bg1: '#1C2B3A', bg2: '#2A3F56', accent: '#1428A0', shape: 'phone' },
  { filename: 'galaxya55',  name: 'Galaxy A55',           brand: 'Samsung', bg1: '#1A2B40', bg2: '#253D5C', accent: '#1428A0', shape: 'phone' },

  // ── Samsung Galaxy Tab ─────────────────────────────────────
  { filename: 'tabs9',      name: 'Galaxy Tab S9',        brand: 'Samsung', bg1: '#1A2535', bg2: '#253548', accent: '#1428A0', shape: 'tablet' },
  { filename: 'tabs9plus',  name: 'Galaxy Tab S9+',       brand: 'Samsung', bg1: '#1A2535', bg2: '#253548', accent: '#1428A0', shape: 'tablet' },
  { filename: 'tabs9ultra', name: 'Galaxy Tab S9 Ultra',  brand: 'Samsung', bg1: '#0D1B2A', bg2: '#1A2E45', accent: '#1428A0', shape: 'tablet' },

  // ── Samsung Galaxy Watch ───────────────────────────────────
  { filename: 'gw6',        name: 'Galaxy Watch 6',       brand: 'Samsung', bg1: '#0C1B33', bg2: '#1A2F50', accent: '#1428A0', shape: 'watch' },
  { filename: 'gw7',        name: 'Galaxy Watch 7',       brand: 'Samsung', bg1: '#0A1628', bg2: '#162540', accent: '#1428A0', shape: 'watch' },

  // ── Google Pixel (missing) ─────────────────────────────────
  { filename: 'pixel6',     name: 'Pixel 6',              brand: 'Google',  bg1: '#2D3748', bg2: '#3D4F64', accent: '#4285F4', shape: 'phone' },
  { filename: 'pixel6pro',  name: 'Pixel 6 Pro',          brand: 'Google',  bg1: '#252D3A', bg2: '#333F52', accent: '#4285F4', shape: 'phone' },
  { filename: 'pixel7',     name: 'Pixel 7',              brand: 'Google',  bg1: '#1E2A38', bg2: '#2C3D52', accent: '#4285F4', shape: 'phone' },
  { filename: 'pixel9proxl',name: 'Pixel 9 Pro XL',       brand: 'Google',  bg1: '#1A2535', bg2: '#253548', accent: '#4285F4', shape: 'phone' },

  // ── OnePlus ────────────────────────────────────────────────
  { filename: 'oneplus12',  name: 'OnePlus 12',           brand: 'OnePlus', bg1: '#1A0A0A', bg2: '#2E0F0F', accent: '#F50514', shape: 'phone' },

  // ── iPad (missing) ─────────────────────────────────────────
  { filename: 'ipad10',     name: 'iPad 10th Gen',        brand: 'Apple',   bg1: '#1C2B3A', bg2: '#253D56', accent: '#0071E3', shape: 'tablet' },
  { filename: 'ipadair11',  name: 'iPad Air 11" M2',      brand: 'Apple',   bg1: '#E8D5B7', bg2: '#C8A87A', accent: '#0071E3', shape: 'tablet' },
  { filename: 'ipadpro11',  name: 'iPad Pro 11" M4',      brand: 'Apple',   bg1: '#1C1C1E', bg2: '#2C2C2E', accent: '#0071E3', shape: 'tablet' },
  { filename: 'ipadmini7',  name: 'iPad mini 7',          brand: 'Apple',   bg1: '#F5F5F0', bg2: '#E0E0D8', accent: '#0071E3', shape: 'tablet-mini' },

  // ── MacBook M4 variants ────────────────────────────────────
  { filename: 'mbp14m4',    name: 'MacBook Pro 14" M4',   brand: 'Apple',   bg1: '#1C1C1E', bg2: '#3A3A3C', accent: '#0071E3', shape: 'laptop' },
  { filename: 'mbp16m4',    name: 'MacBook Pro 16" M4',   brand: 'Apple',   bg1: '#0D0D0F', bg2: '#1C1C1E', accent: '#0071E3', shape: 'laptop' },
  { filename: 'mba13m4',    name: 'MacBook Air 13" M4',   brand: 'Apple',   bg1: '#F0EDE8', bg2: '#D8D3C8', accent: '#0071E3', shape: 'laptop' },

  // ── Meta Quest ─────────────────────────────────────────────
  { filename: 'quest3',     name: 'Meta Quest 3',         brand: 'Meta',    bg1: '#0A0A1A', bg2: '#1A1A35', accent: '#0082FB', shape: 'vr' },
  { filename: 'quest3s',    name: 'Meta Quest 3S',        brand: 'Meta',    bg1: '#0D0D1F', bg2: '#1A1A38', accent: '#0082FB', shape: 'vr' },

  // ── Nintendo Switch (original) ─────────────────────────────
  { filename: 'switch',     name: 'Nintendo Switch',      brand: 'Nintendo',bg1: '#E60012', bg2: '#C0000F', accent: '#FFFFFF', shape: 'handheld' },

  // ── Sony Headphones (missing) ──────────────────────────────
  { filename: 'xm4',        name: 'Sony WH-1000XM4',      brand: 'Sony',    bg1: '#1A1A1A', bg2: '#2C2C2C', accent: '#FF6600', shape: 'headphones' },
  { filename: 'xm5',        name: 'Sony WH-1000XM5',      brand: 'Sony',    bg1: '#111111', bg2: '#222222', accent: '#FF6600', shape: 'headphones' },

  // ── Bose ───────────────────────────────────────────────────
  { filename: 'boseqc45',   name: 'QuietComfort 45',      brand: 'Bose',    bg1: '#1A1A2E', bg2: '#2C2C45', accent: '#00A4BD', shape: 'headphones' },
  { filename: 'boseqcultra',name: 'QuietComfort Ultra',   brand: 'Bose',    bg1: '#0D0D1A', bg2: '#1A1A2E', accent: '#00A4BD', shape: 'headphones' },

  // ── Steam Deck ─────────────────────────────────────────────
  { filename: 'steamdeckoled',name:'Steam Deck OLED',     brand: 'Valve',   bg1: '#1B2838', bg2: '#2A3F5F', accent: '#66C0F4', shape: 'handheld-wide' },

  // ── Surface Laptop ─────────────────────────────────────────
  { filename: 'surfacelaptop6',name:'Surface Laptop 6',   brand: 'Microsoft',bg1:'#0078D4', bg2: '#1A5FA8', accent: '#50E6FF', shape: 'laptop' },
  { filename: 'surfacelaptop7',name:'Surface Laptop 7',   brand: 'Microsoft',bg1:'#005BA1', bg2: '#0078D4', accent: '#50E6FF', shape: 'laptop' },

  // ── Xbox ───────────────────────────────────────────────────
  { filename: 'xboxx',      name: 'Xbox Series X',        brand: 'Microsoft',bg1:'#107C10', bg2: '#1B5E20', accent: '#52B043', shape: 'console-box' },
  { filename: 'xboxs',      name: 'Xbox Series S',        brand: 'Microsoft',bg1:'#CCCCCC', bg2: '#AAAAAA', accent: '#107C10', shape: 'console-box' },
];

function getShape(shape, bg1, bg2, accent) {
  switch (shape) {
    case 'phone':
      return `
        <!-- Phone body -->
        <rect x="165" y="60" width="170" height="315" rx="22" ry="22" fill="${bg2}" stroke="${accent}33" stroke-width="1.5"/>
        <!-- Screen -->
        <rect x="175" y="95" width="150" height="250" rx="8" ry="8" fill="#080810"/>
        <rect x="178" y="98" width="144" height="244" rx="6" ry="6" fill="url(#screenGlow)"/>
        <!-- Dynamic island / notch -->
        <rect x="218" y="75" width="64" height="12" rx="6" ry="6" fill="#000"/>
        <!-- Home indicator -->
        <rect x="218" y="352" width="64" height="4" rx="2" fill="${accent}55"/>
        <!-- Power button -->
        <rect x="335" y="140" width="4" height="40" rx="2" fill="${accent}66"/>
        <!-- Volume buttons -->
        <rect x="161" y="125" width="4" height="30" rx="2" fill="${accent}55"/>
        <rect x="161" y="165" width="4" height="30" rx="2" fill="${accent}55"/>
      `;
    case 'watch':
      return `
        <!-- Watch band top -->
        <rect x="215" y="55" width="70" height="80" rx="8" fill="${bg2}" stroke="${accent}22" stroke-width="1"/>
        <!-- Watch band bottom -->
        <rect x="215" y="295" width="70" height="80" rx="8" fill="${bg2}" stroke="${accent}22" stroke-width="1"/>
        <!-- Watch case -->
        <rect x="168" y="145" width="164" height="145" rx="40" ry="40" fill="${bg2}" stroke="${accent}44" stroke-width="2"/>
        <!-- Screen -->
        <rect x="182" y="160" width="136" height="115" rx="28" ry="28" fill="#060610"/>
        <rect x="188" y="166" width="124" height="103" rx="24" ry="24" fill="url(#screenGlow)"/>
        <!-- Crown -->
        <rect x="332" y="195" width="10" height="30" rx="4" fill="${bg2}" stroke="${accent}44" stroke-width="1"/>
        <!-- Digital crown -->
        <circle cx="337" cy="210" r="6" fill="${accent}66"/>
      `;
    case 'watch-ultra':
      return `
        <!-- Watch band top -->
        <rect x="210" y="48" width="80" height="85" rx="8" fill="${bg2}" stroke="${accent}22" stroke-width="1"/>
        <!-- Watch band bottom -->
        <rect x="210" y="290" width="80" height="85" rx="8" fill="${bg2}" stroke="${accent}22" stroke-width="1"/>
        <!-- Watch case (rectangular/rugged) -->
        <rect x="155" y="138" width="190" height="156" rx="30" ry="30" fill="${bg2}" stroke="${accent}66" stroke-width="2.5"/>
        <!-- Screen -->
        <rect x="170" y="153" width="160" height="126" rx="22" ry="22" fill="#050510"/>
        <rect x="176" y="159" width="148" height="114" rx="18" ry="18" fill="url(#screenGlow)"/>
        <!-- Crown/button -->
        <rect x="344" y="175" width="10" height="35" rx="4" fill="${bg2}" stroke="${accent}66" stroke-width="1.5"/>
        <circle cx="349" cy="192" r="7" fill="${accent}88"/>
        <!-- Action button -->
        <rect x="155" y="175" width="8" height="22" rx="3" fill="${accent}88"/>
      `;
    case 'tablet':
      return `
        <!-- Tablet body -->
        <rect x="120" y="60" width="260" height="340" rx="18" ry="18" fill="${bg2}" stroke="${accent}22" stroke-width="1.5"/>
        <!-- Screen -->
        <rect x="132" y="78" width="236" height="305" rx="6" ry="6" fill="#0A0A12"/>
        <rect x="136" y="82" width="228" height="297" rx="4" ry="4" fill="url(#screenGlow)"/>
        <!-- Home button / Face ID bar -->
        <rect x="218" y="68" width="64" height="4" rx="2" fill="${accent}44"/>
        <!-- Camera -->
        <circle cx="382" cy="238" r="5" fill="${accent}44" stroke="${accent}66" stroke-width="1"/>
        <!-- Power button -->
        <rect x="380" y="145" width="4" height="35" rx="2" fill="${accent}55"/>
        <rect x="380" y="188" width="4" height="25" rx="2" fill="${accent}44"/>
      `;
    case 'tablet-mini':
      return `
        <!-- Mini tablet body -->
        <rect x="148" y="75" width="204" height="300" rx="16" ry="16" fill="${bg2}" stroke="${accent}22" stroke-width="1.5"/>
        <!-- Screen -->
        <rect x="158" y="92" width="184" height="265" rx="5" ry="5" fill="#0A0A12"/>
        <rect x="162" y="96" width="176" height="257" rx="4" ry="4" fill="url(#screenGlow)"/>
        <!-- Top bar -->
        <rect x="220" y="82" width="60" height="4" rx="2" fill="${accent}44"/>
        <circle cx="305" cy="225" r="4" fill="${accent}44" stroke="${accent}55" stroke-width="1"/>
        <!-- Power button -->
        <rect x="352" y="148" width="4" height="30" rx="2" fill="${accent}55"/>
        <rect x="352" y="185" width="4" height="22" rx="2" fill="${accent}44"/>
      `;
    case 'laptop':
      return `
        <!-- Screen lid -->
        <rect x="90" y="75" width="320" height="205" rx="10" ry="10" fill="${bg2}" stroke="${accent}22" stroke-width="1"/>
        <rect x="103" y="88" width="294" height="180" rx="4" ry="4" fill="#080810"/>
        <rect x="107" y="92" width="286" height="172" rx="3" ry="3" fill="url(#screenGlow)"/>
        <!-- Notch camera -->
        <circle cx="250" cy="84" r="3" fill="${accent}44"/>
        <!-- Base -->
        <rect x="70" y="278" width="360" height="35" rx="6" ry="6" fill="${bg2}" stroke="${accent}22" stroke-width="1"/>
        <!-- Hinge -->
        <rect x="70" y="276" width="360" height="4" rx="1" fill="${accent}33"/>
        <!-- Trackpad -->
        <rect x="188" y="288" width="124" height="16" rx="4" ry="4" fill="${bg1}88" stroke="${accent}22" stroke-width="1"/>
        <!-- Keyboard row hints -->
        <rect x="100" y="285" width="70" height="5" rx="2" fill="${accent}11"/>
        <rect x="330" y="285" width="70" height="5" rx="2" fill="${accent}11"/>
      `;
    case 'console':
      return `
        <!-- PS5 tower shape -->
        <ellipse cx="250" cy="210" rx="105" ry="150" fill="${bg2}" stroke="${accent}22" stroke-width="1.5"/>
        <ellipse cx="250" cy="210" rx="78" ry="112" fill="${bg1}"/>
        <!-- Disc slot -->
        <rect x="172" y="198" width="156" height="4" rx="2" fill="${accent}66"/>
        <!-- Power button -->
        <circle cx="250" cy="148" r="9" fill="${accent}88" stroke="${accent}" stroke-width="1.5"/>
        <!-- USB ports -->
        <rect x="224" y="275" width="13" height="7" rx="2" fill="${accent}55"/>
        <rect x="263" y="275" width="13" height="7" rx="2" fill="${accent}55"/>
      `;
    case 'console-box':
      return `
        <!-- Xbox Series X box shape -->
        <rect x="165" y="80" width="170" height="290" rx="18" ry="18" fill="${bg2}" stroke="${accent}33" stroke-width="1.5"/>
        <!-- Xbox circle -->
        <circle cx="250" cy="185" r="55" fill="${bg1}" stroke="${accent}44" stroke-width="2"/>
        <circle cx="250" cy="185" r="30" fill="${accent}44"/>
        <!-- X logo lines -->
        <line x1="230" y1="165" x2="270" y2="205" stroke="${accent}" stroke-width="3" stroke-linecap="round"/>
        <line x1="270" y1="165" x2="230" y2="205" stroke="${accent}" stroke-width="3" stroke-linecap="round"/>
        <!-- Disc drive slot -->
        <rect x="192" y="288" width="116" height="5" rx="2.5" fill="${accent}44"/>
        <!-- USB port -->
        <rect x="234" y="312" width="32" height="8" rx="3" fill="${accent}33"/>
        <!-- Power button -->
        <circle cx="250" cy="110" r="8" fill="${accent}66"/>
      `;
    case 'handheld':
      return `
        <!-- Left Joy-Con -->
        <rect x="72" y="118" width="72" height="164" rx="32" ry="32" fill="${bg2}" stroke="${accent}44" stroke-width="1.5"/>
        <!-- Right Joy-Con -->
        <rect x="356" y="118" width="72" height="164" rx="32" ry="32" fill="${bg2}" stroke="${accent}44" stroke-width="1.5"/>
        <!-- Main body -->
        <rect x="140" y="98" width="220" height="204" rx="6" ry="6" fill="${bg2}" stroke="${accent}22" stroke-width="1"/>
        <!-- Screen -->
        <rect x="151" y="110" width="198" height="180" rx="4" ry="4" fill="#050510"/>
        <rect x="155" y="114" width="190" height="172" rx="3" ry="3" fill="url(#screenGlow)"/>
        <!-- Left thumb stick -->
        <circle cx="108" cy="175" r="15" fill="${bg1}" stroke="${accent}66" stroke-width="1.5"/>
        <!-- Right thumb stick -->
        <circle cx="392" cy="175" r="15" fill="${bg1}" stroke="${accent}66" stroke-width="1.5"/>
        <!-- D-pad -->
        <circle cx="108" cy="230" r="12" fill="${accent}22" stroke="${accent}55" stroke-width="1"/>
        <!-- Buttons -->
        <circle cx="385" cy="225" r="6" fill="${accent}44"/>
        <circle cx="399" cy="211" r="6" fill="${accent}44"/>
        <circle cx="399" cy="239" r="6" fill="${accent}44"/>
        <circle cx="371" cy="225" r="6" fill="${accent}44"/>
      `;
    case 'handheld-wide':
      return `
        <!-- Steam Deck wide body -->
        <!-- Grips -->
        <ellipse cx="105" cy="265" rx="55" ry="75" fill="${bg2}" stroke="${accent}33" stroke-width="1.5"/>
        <ellipse cx="395" cy="265" rx="55" ry="75" fill="${bg2}" stroke="${accent}33" stroke-width="1.5"/>
        <!-- Main body -->
        <rect x="110" y="90" width="280" height="230" rx="15" ry="15" fill="${bg2}" stroke="${accent}33" stroke-width="1.5"/>
        <!-- Screen -->
        <rect x="125" y="106" width="250" height="198" rx="6" ry="6" fill="#050510"/>
        <rect x="130" y="111" width="240" height="188" rx="5" ry="5" fill="url(#screenGlow)"/>
        <!-- Left thumbstick -->
        <circle cx="160" cy="185" r="22" fill="${bg1}" stroke="${accent}55" stroke-width="1.5"/>
        <!-- Right thumbstick -->
        <circle cx="340" cy="230" r="22" fill="${bg1}" stroke="${accent}55" stroke-width="1.5"/>
        <!-- D-pad -->
        <circle cx="160" cy="238" r="17" fill="${accent}22" stroke="${accent}44" stroke-width="1"/>
        <!-- Face buttons -->
        <circle cx="330" cy="178" r="9" fill="${accent}44"/>
        <circle cx="350" cy="162" r="9" fill="${accent}44"/>
        <circle cx="350" cy="194" r="9" fill="${accent}44"/>
        <circle cx="310" cy="178" r="9" fill="${accent}44"/>
        <!-- Bumpers -->
        <rect x="118" y="93" width="55" height="12" rx="5" fill="${accent}44"/>
        <rect x="327" y="93" width="55" height="12" rx="5" fill="${accent}44"/>
      `;
    case 'vr':
      return `
        <!-- VR Headset body -->
        <rect x="110" y="120" width="280" height="170" rx="30" ry="30" fill="${bg2}" stroke="${accent}33" stroke-width="1.5"/>
        <!-- Left lens -->
        <circle cx="190" cy="205" r="52" fill="#070712" stroke="${accent}44" stroke-width="1.5"/>
        <circle cx="190" cy="205" r="38" fill="url(#screenGlow)"/>
        <circle cx="190" cy="205" r="25" fill="${accent}22"/>
        <!-- Right lens -->
        <circle cx="310" cy="205" r="52" fill="#070712" stroke="${accent}44" stroke-width="1.5"/>
        <circle cx="310" cy="205" r="38" fill="url(#screenGlow)"/>
        <circle cx="310" cy="205" r="25" fill="${accent}22"/>
        <!-- Bridge -->
        <rect x="228" y="195" width="44" height="20" rx="8" fill="${bg2}" stroke="${accent}22" stroke-width="1"/>
        <!-- Strap hint top -->
        <path d="M 110 155 Q 70 120 60 200" stroke="${bg2}" stroke-width="18" fill="none" stroke-linecap="round"/>
        <path d="M 390 155 Q 430 120 440 200" stroke="${bg2}" stroke-width="18" fill="none" stroke-linecap="round"/>
        <!-- Volume/power buttons -->
        <rect x="112" y="195" width="8" height="25" rx="3" fill="${accent}55"/>
        <rect x="380" y="195" width="8" height="25" rx="3" fill="${accent}55"/>
      `;
    case 'headphones':
      return `
        <!-- Headband arc -->
        <path d="M 125 225 Q 125 95 250 95 Q 375 95 375 225" 
              stroke="${bg2}" stroke-width="24" fill="none" stroke-linecap="round"/>
        <!-- Headband padding -->
        <path d="M 150 175 Q 250 118 350 175"
              stroke="${accent}44" stroke-width="10" fill="none" stroke-linecap="round"/>
        <!-- Left cup -->
        <ellipse cx="125" cy="240" rx="46" ry="55" fill="${bg2}" stroke="${accent}33" stroke-width="1.5"/>
        <ellipse cx="125" cy="240" rx="33" ry="40" fill="#0A0A0A"/>
        <circle cx="125" cy="240" r="16" fill="${accent}33"/>
        <!-- Left driver ring -->
        <circle cx="125" cy="240" r="22" fill="none" stroke="${accent}33" stroke-width="1.5"/>
        <!-- Right cup -->
        <ellipse cx="375" cy="240" rx="46" ry="55" fill="${bg2}" stroke="${accent}33" stroke-width="1.5"/>
        <ellipse cx="375" cy="240" rx="33" ry="40" fill="#0A0A0A"/>
        <circle cx="375" cy="240" r="16" fill="${accent}33"/>
        <circle cx="375" cy="240" r="22" fill="none" stroke="${accent}33" stroke-width="1.5"/>
        <!-- Touch sensor indicator -->
        <circle cx="125" cy="240" r="5" fill="${accent}88"/>
        <circle cx="375" cy="240" r="5" fill="${accent}88"/>
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

  <!-- Background -->
  <rect width="1000" height="1000" fill="url(#bg)"/>

  <!-- Ambient glow -->
  <ellipse cx="250" cy="220" rx="210" ry="190" fill="url(#glow)"/>

  <!-- Device shape -->
  ${getShape(shape, bg1, bg2, accent)}

  <!-- Brand name -->
  <text x="250" y="392"
    font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif"
    font-size="13" font-weight="500" letter-spacing="2"
    fill="${accent}" opacity="0.9" text-anchor="middle">${brand.toUpperCase()}</text>

  <!-- Device name -->
  <text x="250" y="418"
    font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif"
    font-size="17" font-weight="600" letter-spacing="0.3"
    fill="#FFFFFF" opacity="0.95" text-anchor="middle">${name}</text>
</svg>`;
}

async function main() {
  let generated = 0;

  for (const device of devices) {
    const pngPath = resolve(OUT_DIR, `${device.filename}.png`);

    const svgContent = generateSVG(device);

    try {
      await sharp(Buffer.from(svgContent), { density: 300 })
        .png({ compressionLevel: 6 })
        .toFile(pngPath);
      console.log(`✅ ${device.filename}.png — ${device.name}`);
      generated++;
    } catch (e) {
      console.error(`❌ ${device.filename}: ${e.message}`);
    }
  }

  console.log(`\nDone. Regenerated: ${generated} images at 1000×1000 (2×)`);
}

main();
