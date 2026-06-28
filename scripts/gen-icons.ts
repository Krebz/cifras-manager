import sharp from "sharp";
import { resolve } from "path";

// Gera ícones maskable a partir do ícone full-bleed existente.
// O Android aplica uma máscara (squircle/círculo) e corta ~10% das bordas;
// o ícone maskable precisa do logo dentro da "zona de segurança" (~80%),
// então reduzimos o logo e preenchemos a margem com a cor de fundo do logo.

const SRC = resolve(process.cwd(), "public/pwa-512x512.png");
const SCALE = 0.78; // logo ocupa 78% — cabe na zona de segurança de 80%

async function bgColor(): Promise<{ r: number; g: number; b: number }> {
  // amostra o pixel do canto (fundo do logo) para a margem combinar
  const buf = await sharp(SRC).extract({ left: 0, top: 0, width: 1, height: 1 }).raw().toBuffer();
  return { r: buf[0], g: buf[1], b: buf[2] };
}

async function maskable(size: number, bg: { r: number; g: number; b: number }) {
  const inner = Math.round(size * SCALE);
  const logo = await sharp(SRC).resize(inner, inner).toBuffer();
  const out = resolve(process.cwd(), `public/pwa-maskable-${size}x${size}.png`);
  await sharp({
    create: { width: size, height: size, channels: 4, background: { ...bg, alpha: 1 } },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toFile(out);
  console.log(`gerado ${out} (logo ${inner}px)`);
}

async function main() {
  const bg = await bgColor();
  console.log(`cor de fundo do logo: rgb(${bg.r}, ${bg.g}, ${bg.b})`);
  await maskable(512, bg);
  await maskable(192, bg);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
