module.exports = bundler => {
  bundler.on('bundled', bundle => {
    console.log('outDir', bundler.options.outDir);
  });
};
