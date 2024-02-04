import esbuild from 'esbuild';
import { config } from './config.mjs';

const context = await esbuild.context({
  ...config,
  sourcemap: true,
});

await context.watch();
