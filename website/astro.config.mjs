import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  outDir: '../docs',
  site: 'https://idorozin.github.io',
  base: '/agentpages-site',
});
