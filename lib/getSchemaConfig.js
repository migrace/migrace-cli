const { resolve } = require('path');

const { CWD, IS_INTERACTIVE } = require('./constants');

module.exports = (config, schema) => {
  const configPath = resolve(CWD, config);

  if (IS_INTERACTIVE) {
    delete require.cache[configPath];
  }

  return require(configPath)[schema];
};
