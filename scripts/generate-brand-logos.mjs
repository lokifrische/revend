// Generate clean brand logo SVGs
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const OUT_DIR = '/home/openclaw/.openclaw/workspace/revend/public/brands';

const logos = {
  apple: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#1C1C1E" rx="22"/>
  <!-- Apple logo path (simplified) -->
  <path d="M 50 22 C 45 22 41 26 41 30 C 41 32 42 34 43 35 C 39 35 34 38 32 44 C 30 50 31 57 34 62 C 37 67 41 72 46 72 C 48 72 50 71 52 70 C 54 71 56 72 58 72 C 63 72 67 67 70 62 C 73 57 74 50 72 44 C 70 38 65 35 61 35 C 62 34 63 32 63 30 C 63 26 59 22 54 22 C 52.5 22 51 22.3 50 22 Z" 
        fill="white" opacity="0.9"/>
  <ellipse cx="52" cy="18" rx="5" ry="6" fill="white" opacity="0.9" transform="rotate(-15 52 18)"/>
</svg>`,

  samsung: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#1428A0" rx="22"/>
  <text x="50" y="62" font-family="'Samsung Sharp Sans', Arial, sans-serif" font-size="22" 
        font-weight="700" fill="white" text-anchor="middle" letter-spacing="-1">SAMSUNG</text>
</svg>`,

  google: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#FFFFFF" rx="22"/>
  <!-- Google G logo -->
  <path d="M 70 50 L 50 50 L 50 58 L 62 58 C 60 64 55 68 50 68 C 43 68 37 62 37 55 C 37 48 43 42 50 42 C 53 42 56 43 58 45 L 64 39 C 61 36 56 34 50 34 C 38 34 29 43 29 55 C 29 67 38 76 50 76 C 62 76 71 67 71 55 C 71 53 70.7 51.5 70 50 Z" fill="#4285F4"/>
  <path d="M 29 55 L 37 55 C 37 48 43 42 50 42 L 58 45 L 64 39 C 61 36 56 34 50 34 C 38 34 29 43 29 55 Z" fill="#34A853" opacity="0.8"/>
</svg>`,

  oneplus: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#1A1A1A" rx="22"/>
  <text x="50" y="42" font-family="Arial, sans-serif" font-size="30" font-weight="900" 
        fill="#EB0029" text-anchor="middle">1+</text>
  <text x="50" y="68" font-family="Arial, sans-serif" font-size="11" font-weight="600" 
        fill="white" text-anchor="middle" letter-spacing="2" opacity="0.7">ONEPLUS</text>
</svg>`,

  microsoft: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#F3F3F3" rx="22"/>
  <!-- Microsoft 4-square logo -->
  <rect x="30" y="30" width="18" height="18" fill="#F25022"/>
  <rect x="52" y="30" width="18" height="18" fill="#7FBA00"/>
  <rect x="30" y="52" width="18" height="18" fill="#00A4EF"/>
  <rect x="52" y="52" width="18" height="18" fill="#FFB900"/>
</svg>`,

  sony: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#000000" rx="22"/>
  <text x="50" y="58" font-family="'Sony Sketch EF', 'Helvetica Neue', Arial, sans-serif" 
        font-size="22" font-weight="700" fill="white" text-anchor="middle" letter-spacing="3">SONY</text>
</svg>`,

  nintendo: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#E60012" rx="22"/>
  <text x="50" y="56" font-family="Arial, sans-serif" font-size="13" font-weight="900" 
        fill="white" text-anchor="middle" letter-spacing="1.5">NINTENDO</text>
</svg>`,
};

for (const [name, svg] of Object.entries(logos)) {
  const path = resolve(OUT_DIR, `${name}.svg`);
  writeFileSync(path, svg.trim());
  console.log(`✅ /brands/${name}.svg`);
}
console.log('Brand logos generated!');
