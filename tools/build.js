const esbuild = require('esbuild');
const { readFileSync, writeFileSync } = require('fs');
const { config, target } = require('./config');
const { version } = require('../package.json');

function normalizeManifest() {
  const manifestPath = `${target}/manifest.json`;
  const content = readFileSync(manifestPath, 'utf8');
  const manifest = JSON.parse(content);

  if (manifest.version !== version) {
    manifest.version = version;
    const newContent = JSON.stringify(manifest, undefined, 2);
    writeFileSync(manifestPath, newContent, 'utf8');
  }
}

esbuild
  .build({
    ...config,
    sourcemap: false,
    watch: false,
  })
  .then(normalizeManifest);
