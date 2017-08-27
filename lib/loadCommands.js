const { resolve } = require('path');
const { readdirSync } = require('fs-extra');

module.exports = (vorpal) => {
  const directory = resolve(__dirname, 'commands');
  const files = readdirSync(directory);

  files.forEach((filename) => {
    require(resolve(directory, filename))(vorpal);
  });
};
