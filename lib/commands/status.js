const {
  DEFAULT_CONFIG_PATH,
  DEFAULT_SCHEMA
} = require('../constants');

const Migrator = require('../Migrator');

module.exports = (vorpal) => {
  vorpal
    .command('status [schemas...]')
    .description(`Get migrations status for specified schemas (default: ["${ DEFAULT_SCHEMA }"]).`)
    .option('-c, --config <config>', `config path (default: "${ DEFAULT_CONFIG_PATH }")`)
    .action(({
      options: {
        config = DEFAULT_CONFIG_PATH
      },
      schemas = [DEFAULT_SCHEMA]
    }) => (
      new Migrator(config, schemas).getStatus()
    ));
};
