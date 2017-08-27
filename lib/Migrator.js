const { resolve, relative } = require('path');
const { blue, red } = require('chalk');
const { pick } = require('lodash');

const {
  getTableString,
  getStandardTableString
} = require('./utils');

const {
  CWD,
  CLI_VERSION,
  MIGRACE_VERSION,
  IS_INTERACTIVE
} = require('./constants');

const { hasOwnProperty } = {};

const { Migrator, MigrationManager } = require(require('./resolve')('migrace'));

class CliMigrator {
  static _pickMigratorOptions(options) {
    return pick(options, [
      'migrationStorage',
      'metadataStorage',
      'migrationCacheStorage',
      'force',
      'downgradeSupport'
    ]);
  }

  static _pickManagerOptions(options) {
    return pick(options, [
      'migrationStorage',
      'bundler',
      'bundlePath',
      'force',
      'downgradeSupport'
    ]);
  }

  constructor(config, schema) {
    console.log();
    console.log(getStandardTableString(config, schema));
    console.log();

    if (typeof schema === 'string') {
      this.instances = this._getMigraceInstances(config, schema);
    } else {
      this.schemas = schema;
      this.schemaInstances = Promise.all(
        schema.map((schema) => (
          this._getMigraceInstances(config, schema)
        ))
      );
    }
  }

  _getMigraceInstances(config, schema) {
    return new Promise((res) => {
      const configPath = resolve(CWD, config);

      if (IS_INTERACTIVE) {
        delete require.cache[configPath];
      }

      const conf = require(configPath);

      if (!hasOwnProperty.call(conf, schema)) {
        throw new Error(`There's no schema ${ JSON.stringify(schema) } in the config`);
      }

      const options = conf[schema];

      res({
        migrator: new Migrator(CliMigrator._pickMigratorOptions(options)),
        manager: new MigrationManager(CliMigrator._pickManagerOptions(options))
      });
    });
  }

  addMigration(name) {
    return this.instances
      .then(({ manager }) => (
        manager.addMigration(name)
      ))
      .then(({ fullId }) => {
        console.log(blue(`Migration "${ red(fullId) }" has been added`));
        console.log();
      });
  }

  execMigrations(from, to) {
    return this.instances.then(({ migrator }) => {
      const asyncIterator = migrator.migrateByOne(from, to);

      return asyncIterator
        .next()
        .then(({ value, done }) => {
          if (done) {
            return;
          }

          console.log(blue(`Migration "${ red(value.fullId) }" has been executed`));
          console.log();

          return asyncIterator.next();
        });
    });
  }

  generateBundle() {
    return this.instances
      .then(({ manager }) => (
        manager.generateBundleEntry()
      ))
      .then((path) => {
        console.log(blue(`Bundle has been entry generated at ${ red(relative(CWD, path)) }`));
        console.log();
      });
  }

  generateBundleEntry() {
    return this.instances
      .then(({ manager }) => (
        manager.generateBundleEntry()
      ))
      .then((path) => {
        console.log(blue(`Bundle entry has been entry generated at ${ red(relative(CWD, path)) }`));
        console.log();
      });
  }

  getStatus() {
    return this.schemaInstances
      .then((instances) => (
        Promise.all(
          instances.map(({ migrator }) => (
            migrator.getStatus()
          ))
        )
      ))
      .then((infos) => {
        infos.forEach(({
          updatedAt,
          lastMigration,
          currentMigration,
          actualCurrentMigration
        }, index) => {
          console.log(getTableString([
            ['migrace-cli version', CLI_VERSION],
            ['migrace version', MIGRACE_VERSION],
            ['Schema', this.schemas[index]],
            ['Last update at', updatedAt],
            ['Current migration', currentMigration],
            ['Actual current migration', actualCurrentMigration],
            ['Last migration', lastMigration]
          ]));
          console.log();
        });
      });
  }

  setCurrent(migration) {
    return this.instances
      .then(({ migrator }) => (
        migrator.setCurrent(migration)
      ))
      .then(({ fullId }) => {
        console.log(blue(`Current migration has been set to ${ red(fullId) }`));
        console.log();
      });
  }
}

module.exports = CliMigrator;
