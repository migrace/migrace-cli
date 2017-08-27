const Migrator = require('../Migrator');

const {
  DEFAULT_CONFIG_PATH,
  DEFAULT_SCHEMA,
  DEFAULT_SET_CURRENT_MIGRATION
} = require('../constants');

module.exports = (vorpal) => {
  vorpal
    .command('set-current <migration>')
    .description(
      'Force the current migration to be set to the one specified by the argument'
      + ' (one of [ id | full-id | name | "first" | "last" | "current" ],'
      + ` defaults to "${ DEFAULT_SET_CURRENT_MIGRATION }")`
    )
    .option('-c, --config <config>', `config path (default: "${ DEFAULT_CONFIG_PATH }")`)
    .option('-s, --schema <schema>', `schema to set current migration for (default: "${ DEFAULT_SCHEMA }")`)
    .action(({
      options: {
        schema = DEFAULT_SCHEMA,
        config = DEFAULT_CONFIG_PATH
      },
      migration = DEFAULT_SET_CURRENT_MIGRATION
    }) => (
      new Migrator(config, schema).setCurrent(migration)
    ));
};
