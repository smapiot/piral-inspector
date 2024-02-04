import esbuild from 'esbuild';
import { config } from './config.mjs';

await esbuild.build({
  ...config,
  sourcemap: false,
});
