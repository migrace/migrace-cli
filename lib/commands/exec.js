const Migrator = require('../Migrator');

const {
  DEFAULT_CONFIG_PATH,
  DEFAULT_SCHEMA,
  DEFAULT_FROM_MIGRATION,
  DEFAULT_TO_MIGRATION
} = require('../constants');

module.exports = (vorpal) => {
  vorpal
    .command('exec')
    .description('Executes not yet executed migrations.')
    .option('-c, --config <config>', `config path (default: "${ DEFAULT_CONFIG_PATH }")`)
    .option('-s, --schema <schema>', `schema to add a migration to (default: "${ DEFAULT_SCHEMA }")`)
    .option('-f, --from <from-point>', (
      'migrate from this migration '
      + '(one of [ id | full-id | name | "first" | "current" ],'
      + ` defaults to "${ DEFAULT_FROM_MIGRATION }")`
    ))
    .option('-t, --to <to-point>', (
      'migrate up to this migration '
      + '(one of [ id | full-id | name | "last" ],'
      + ` defaults to "${ DEFAULT_TO_MIGRATION }")`
    ))
    .action(({
      options: {
        schema = DEFAULT_SCHEMA,
        config = DEFAULT_CONFIG_PATH,
        from = DEFAULT_FROM_MIGRATION,
        to = DEFAULT_TO_MIGRATION
      }
    }) => (
      new Migrator(config, schema).execMigrations(from, to)
    ));
};
