const { resolve } = require('path');

module.exports = () => {
  try {
    const { name } = require(resolve(process.cwd(), 'package.json'));

    if (typeof name === 'string' && name) {
      return name;
    }
  } catch (err) {} // eslint-disable-line no-empty
};
