const generateConfig = require('../generateConfig');

const {
  DEFAULT_CONFIG_PATH,
  DEFAULT_SCHEMA
} = require('../constants');

module.exports = (vorpal) => {
  vorpal
    .command('generate-config [schemas...]')
    .description(`Generates migrace config with specified schemas (defaults to ["${ DEFAULT_SCHEMA }"]).`)
    .option('-p, --path <path>', `path to save the config at (default: "${ DEFAULT_CONFIG_PATH }")`)
    .action(({
      options: {
        path = DEFAULT_CONFIG_PATH
      },
      schemas = [DEFAULT_SCHEMA]
    }) => (
      generateConfig(path, schemas)
    ));
};
