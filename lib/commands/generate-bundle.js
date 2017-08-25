const Migrator = require('../Migrator');

const {
  DEFAULT_CONFIG_PATH,
  DEFAULT_SCHEMA
} = require('../constants');

module.exports = (vorpal) => {
  vorpal
    .command('generate-bundle')
    .description('Generates migrations bundle.')
    .option('-c, --config <config>', `config path (default: "${ DEFAULT_CONFIG_PATH }")`)
    .option('-s, --schema <schema>', `schema to generate a bundle entry for (default: "${ DEFAULT_SCHEMA }")`)
    .action(({
      options: {
        config = DEFAULT_CONFIG_PATH,
        schema = DEFAULT_SCHEMA
      }
    }) => (
      new Migrator(config, schema).generateBundle()
    ));
};
