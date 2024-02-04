import copyStaticFiles from 'esbuild-copy-static-files';
import { resolve } from 'path';
import { readFile, writeFile } from 'fs/promises';

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

async function normalizeManifest(target) {
  const cwd = process.cwd();
  const packageJsonPath = resolve(cwd, 'package.json');
  const packageJsonContent = await readFile(packageJsonPath, 'utf8');
  const { version } = JSON.parse(packageJsonContent);
  const manifestPath = `${target}/manifest.json`;
  const manifestContent = await readFile(manifestPath, 'utf8');
  const manifest = JSON.parse(manifestContent);

  if (manifest.version !== version) {
    manifest.version = version;
  }

  if (browser === 'firefox') {
    manifest.background = {
      scripts: [manifest.background.service_worker],
    };
  }
  
  const newContent = JSON.stringify(manifest, undefined, 2);
  await writeFile(manifestPath, newContent, 'utf8');
}

function modifyManifest(dir) {
  return {
    name: 'modify-manifest',
    setup(build) {
      build.onEnd(result => {
        return normalizeManifest(dir);
      });
    },
  };
}

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
    modifyManifest(dst),
  ],
};
