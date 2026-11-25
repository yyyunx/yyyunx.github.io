// Programmatic Astro preview stays attached to the test runner and serves dist.
import { preview } from 'astro';
const server = await preview({ server: { host: '127.0.0.1', port: 4173 } });
console.log('Production preview ready on http://127.0.0.1:' + server.port);
const stop = async () => {
  await server.stop();
  process.exit(0);
};
process.on('SIGTERM', stop);
process.on('SIGINT', stop);
