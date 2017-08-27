const { sync: resolve } = require('resolve');

const { CWD } = require('./constants');

module.exports = (path) => (
  resolve(path, {
    basedir: CWD
  })
);
