'use strict';

const fs = require('fs');

function registerTsNode() {
  // eslint-disable-next-line node/no-deprecated-api
  if (!require.extensions['.ts']) {
    const options = {
      project: `${__dirname}/ts/tsconfig.json`
    };

    // If we're operating in the context of another project, which might happen
    // if someone has installed ember-cli-typescript from git, only perform
    // transpilation. In this case, we also overwrite the default ignore glob
    // (which ignores everything in `node_modules`) to instead ignore anything
    // that doesn't end with `.ts`.
    if (process.cwd() !== __dirname) {
      options.ignore = [/\.(?!ts$)\w+$/];
      options.transpileOnly = true;
    }

    require('ts-node').register(options);
  }
}

// If transpiled output is present, always default to loading that first.
// Otherwise, register ts-node if necessary and load from source.
if (fs.existsSync(`${__dirname}/js/addon.js`)) {
  module.exports = require('./js/addon').default;

} else {
  registerTsNode();

  module.exports = require('./ts/addon').default;
}
