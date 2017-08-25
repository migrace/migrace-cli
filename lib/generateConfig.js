const { resolve } = require('path');
const { outputFile } = require('fs-extra');
const { blue, red } = require('chalk');

const { stringifyIdentifier } = require('./utils');

const { CWD } = require('./constants');

module.exports = (path, schemas) => (
  new Promise((res) => {
    console.log();

    const absolutePath = resolve(CWD, path);
    const schemasString = schemas.map((schema) => (
      `  ${ stringifyIdentifier(schema) }: {}`
    )).join(',\n');
    const content = `module.exports = {
${ schemasString }
};`;

    res(
      outputFile(absolutePath, content).then(() => {
        console.log(blue(`Config has been generated at ${ red(path) }`));
        console.log();
      })
    );
  })
);
