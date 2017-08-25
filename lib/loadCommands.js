const { resolve } = require('path');
const { readdir } = require('fs-extra');

module.exports = (vorpal) => {
  const directory = resolve(__dirname, 'commands');

  return readdir(directory).then((files) => {
    files.forEach((filename) => {
      require(resolve(directory, filename))(vorpal);
    });
  });
};
