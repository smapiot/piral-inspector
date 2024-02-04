import esbuild from 'esbuild';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { config, target } from './config.mjs';

async function normalizeManifest() {
  const cwd = process.cwd();
  const packageJsonPath = resolve(cwd, 'package.json');
  const packageJsonContent = await readFile(packageJsonPath, 'utf8');
  const { version } = JSON.parse(packageJsonContent);
  const manifestPath = `${target}/manifest.json`;
  const manifestContent = await readFile(manifestPath, 'utf8');
  const manifest = JSON.parse(manifestContent);

  if (manifest.version !== version) {
    manifest.version = version;
    const newContent = JSON.stringify(manifest, undefined, 2);
    await writeFile(manifestPath, newContent, 'utf8');
  }
}

await esbuild.build({
  ...config,
  sourcemap: false,
});

await normalizeManifest();
