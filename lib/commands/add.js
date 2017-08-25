const Migrator = require('../Migrator');

const {
  DEFAULT_CONFIG_PATH,
  DEFAULT_SCHEMA
} = require('../constants');

module.exports = (vorpal) => {
  vorpal
    .command('add <migration-name>')
    .description('Adds a migration with the given name to the migration storage.')
    .option('-c, --config <config>', `config path (default: "${ DEFAULT_CONFIG_PATH }")`)
    .option('-s, --schema <schema>', `schema to add a migration to (default: "${ DEFAULT_SCHEMA }")`)
    .action(({
      options: {
        schema = DEFAULT_SCHEMA,
        config = DEFAULT_CONFIG_PATH
      },
      'migration-name': name
    }) => (
      new Migrator(config, schema).addMigration(name)
    ));
};
