#! /usr/bin/env node
const Bundler = require('parcel-bundler');
const fs = require('fs');
const path = require('path');
const { zip } = require('ramda');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);

const srcPath = path.join(process.cwd(), 'src');

const toSrcDirectories = async () => await readdir(srcPath);

// ie. reception -> src/reception/index.html.
const toEntryFile = directory => path.join(srcPath, directory, 'index.html');

const toOptions = name => ({
  hmr: false,
  outDir: `./dist/${name}`,
  publicUrl: '.',
  watch: false,
});

const toBundler = ([name, entryFile]) => new Bundler(entryFile, toOptions(name));

const main = async () => {
  const directories = await toSrcDirectories();
  const entryFiles = directories.map(toEntryFile);
  const entries = zip(directories, entryFiles);
  const bundlers = entries.map(toBundler);

  for (bundler of bundlers) {
    await bundler.bundle();
  }
};

main().catch(err => console.error(err));
