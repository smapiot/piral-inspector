const copyStaticFiles = require('esbuild-copy-static-files');
const { resolve } = require('path');

const browser = process.argv.pop();

switch (browser) {
  case 'chrome':
  case 'firefox':
  case 'edge':
  case 'opera':
    break;
  default:
    throw new Error('Invalid browser provided. Select a valid one.');
}

const src = resolve(__dirname, '../src');
const dst = resolve(__dirname, `../dist/${browser}`);

exports.target = dst;

exports.config = {
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
