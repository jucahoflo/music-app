const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputIcon = path.join(process.cwd(), 'public', 'icon-base.png');
const outputDir = path.join(process.cwd(), 'public', 'icons');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  if (!fs.existsSync(inputIcon)) {
    console.log('⚠️ No se encontró icono base en public/icon-base.png');
    console.log('📝 Puedes descargar iconos de muestra desde: https://placehold.co/512x512/1a1a2e/white?text=🎵');
    return;
  }

  for (const size of sizes) {
    await sharp(inputIcon)
      .resize(size, size)
      .toFile(path.join(outputDir, `icon-${size}x${size}.png`));
    console.log(`✅ Generado icono ${size}x${size}`);
  }
}

generateIcons();
