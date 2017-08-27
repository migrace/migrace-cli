const Table = require('cli-table2');
const width = require('string-width');
const { red, blue } = require('chalk');

const {
  CWD,
  CLI_VERSION,
  MIGRACE_VERSION
} = require('./constants');

const IDENTIFIER_REGEX = /^[a-z$_][a-z$_\d]*$/i;

exports.stringifyIdentifier = (id) => (
  IDENTIFIER_REGEX.test(id)
    ? id
    : JSON.stringify(id)
);

const getTableString = exports.getTableString = (
  data,
  colWidths = [30, Math.max(process.stdout.columns - 40, 0)],
  colMappings = [red, blue]
) => {
  data = data.map((col) => (
    col.map((cell, ix) => colMappings[ix](cell))
  ));

  const colsCount = data[0].length;
  const availableWidth = process.stdout.columns - colsCount * 6;
  const isEnoughWidth = data.every((cols) => (
    cols.reduce((sum, string) => width(string), 0) < availableWidth
  ));

  const table = new Table(
    isEnoughWidth
      ? {}
      : { colWidths }
  );

  table.push(...data);

  return table.toString();
};

exports.getStandardTableString = (config, schema) => (
  getTableString([
    ['migrace-cli version', CLI_VERSION],
    ['migrace version', MIGRACE_VERSION],
    ['Working directory', CWD],
    ['Config path', config],
    [
      typeof schema === 'string' ? 'Schema' : 'Schemas',
      typeof schema === 'string' ? schema : schema.join(', ')
    ]
  ])
);
