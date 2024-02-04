import copyStaticFiles from 'esbuild-copy-static-files';
import { resolve } from 'path';

const browser = process.argv.pop();

switch (browser) {
  case 'chrome':
  case 'firefox':
  case 'edge':
  case 'opera':
  case 'safari':
    break;
  default:
    throw new Error('Invalid browser provided. Select a valid one.');
}

const cwd = process.cwd();
const src = resolve(cwd, 'src');
const dst = resolve(cwd, `dist/${browser}`);

export const target = dst;

export const config = {
  entryPoints: [
    resolve(src, 'panel.tsx'),
    resolve(src, 'devtools.ts'),
    resolve(src, 'contentScript.ts'),
    resolve(src, 'serviceWorker.ts'),
  ],
  minify: true,
  bundle: true,
  target: 'chrome90',
  platform: 'browser',
  outdir: dst,
  plugins: [
    copyStaticFiles({
      src: resolve(src, 'public'),
      dest: dst,
    }),
  ],
};
