exports.IS_INTERACTIVE = process.argv.length === 2;

exports.PROJECT_NAME = require('./getProjectName')();
exports.CWD = process.cwd();
exports.VERSION = require('../package.json').version;

exports.DEFAULT_CONFIG_PATH = 'migrace/config.js';
exports.DEFAULT_SCHEMA = 'main';
exports.DEFAULT_SET_CURRENT_MIGRATION = 'current';
exports.DEFAULT_FROM_MIGRATION = 'current';
exports.DEFAULT_TO_MIGRATION = 'last';
