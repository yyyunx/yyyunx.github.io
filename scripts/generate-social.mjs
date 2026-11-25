import { createRequire } from 'node:module';
// Reuse the image service already installed by Astro.
const requireFromAstro = createRequire(import.meta.resolve('astro'));
const sharp = requireFromAstro('sharp');
await sharp('public/social.svg').png().toFile('public/social.png');
await sharp('public/favicon.svg')
  .resize(32, 32)
  .png()
  .toFile('public/favicon-32.png');
console.log('Generated local Open Graph and favicon assets.');
