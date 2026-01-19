import { PNG } from 'pngjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createIcon(size, outputPath) {
  const png = new PNG({ width: size, height: size });

  // Fill with accent color (#007AFF)
  const bgColor = { r: 0, g: 122, b: 255 };

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;

      // Create a rounded square effect
      const centerX = size / 2;
      const centerY = size / 2;
      const radius = size * 0.45;
      const cornerRadius = size * 0.1;

      const dx = Math.abs(x - centerX);
      const dy = Math.abs(y - centerY);

      // Check if point is inside rounded rectangle
      const inHorizontal = dx <= radius - cornerRadius;
      const inVertical = dy <= radius - cornerRadius;
      const inCorner = dx > radius - cornerRadius && dy > radius - cornerRadius
        ? Math.sqrt(Math.pow(dx - (radius - cornerRadius), 2) + Math.pow(dy - (radius - cornerRadius), 2)) <= cornerRadius
        : false;

      if (inHorizontal && dy <= radius || inVertical && dx <= radius || inCorner) {
        // Draw letter "L" in white
        const lTop = size * 0.25;
        const lBottom = size * 0.75;
        const lLeft = size * 0.35;
        const lRight = size * 0.65;
        const lStroke = size * 0.08;

        const isVerticalBar = x >= lLeft && x <= lLeft + lStroke && y >= lTop && y <= lBottom;
        const isHorizontalBar = x >= lLeft && x <= lRight && y >= lBottom - lStroke && y <= lBottom;

        if (isVerticalBar || isHorizontalBar) {
          // White letter
          png.data[idx] = 255;
          png.data[idx + 1] = 255;
          png.data[idx + 2] = 255;
          png.data[idx + 3] = 255;
        } else {
          // Accent color background
          png.data[idx] = bgColor.r;
          png.data[idx + 1] = bgColor.g;
          png.data[idx + 2] = bgColor.b;
          png.data[idx + 3] = 255;
        }
      } else {
        // Transparent outside
        png.data[idx] = 0;
        png.data[idx + 1] = 0;
        png.data[idx + 2] = 0;
        png.data[idx + 3] = 0;
      }
    }
  }

  png.pack().pipe(fs.createWriteStream(outputPath));
  console.log(`Generated ${size}x${size} icon at ${outputPath}`);
}

// Create icons
const publicDir = path.join(__dirname, '..', 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

createIcon(192, path.join(publicDir, 'icon-192.png'));
createIcon(512, path.join(publicDir, 'icon-512.png'));

console.log('Icon generation complete!');
