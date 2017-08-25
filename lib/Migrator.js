const { resolve, relative } = require('path');
const Migrace = require('migrace');
const { blue, red } = require('chalk');

const {
  getTableString,
  getStandardTableString
} = require('./utils');

const { CWD, IS_INTERACTIVE } = require('./constants');

const { hasOwnProperty } = {};

class Migrator {
  constructor(config, schema) {
    console.log();
    console.log(getStandardTableString(config, schema));
    console.log();

    if (typeof schema === 'string') {
      this.migrator = this._getMigratorInstance(config, schema);
    } else {
      this.schemas = schema;
      this.migrators = Promise.all(
        schema.map((schema) => (
          this._getMigratorInstance(config, schema)
        ))
      );
    }
  }

  _getMigratorInstance(config, schema) {
    return new Promise((res) => {
      const configPath = resolve(CWD, config);

      if (IS_INTERACTIVE) {
        delete require.cache[configPath];
      }

      const conf = require(configPath);

      if (!hasOwnProperty.call(conf, schema)) {
        throw new Error(`There's no schema ${ JSON.stringify(schema) } in the config`);
      }

      res(new Migrace(conf[schema]));
    });
  }

  addMigration(name) {
    return this.migrator
      .then((migrator) => (
        migrator.addMigration(name)
      ))
      .then(({ fullId }) => {
        console.log(blue(`Migration "${ red(fullId) }" has been added`));
        console.log();
      });
  }

  execMigrations(from, to) {
    return this.migrator.then((migrator) => (
      migrator.execMigrations({
        from,
        to,
        onProgress({ fullId }) {
          console.log(blue(`Migration "${ red(fullId) }" has been executed`));
          console.log();
        }
      })
    ));
  }

  generateBundle() {
    return this.migrator
      .then((migrator) => (
        migrator.generateBundleEntry()
      ))
      .then((path) => {
        console.log(blue(`Bundle has been entry generated at ${ red(relative(CWD, path)) }`));
        console.log();
      });
  }

  generateBundleEntry() {
    return this.migrator
      .then((migrator) => (
        migrator.generateBundleEntry()
      ))
      .then((path) => {
        console.log(blue(`Bundle entry has been entry generated at ${ red(relative(CWD, path)) }`));
        console.log();
      });
  }

  getStatus() {
    return this.migrators
      .then((migrators) => (
        Promise.all(
          migrators.map((migrator) => (
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
            ['Schema', this.schemas[index]],
            ['Updated at', updatedAt],
            ['Current migration', currentMigration],
            ['Actual current migration', actualCurrentMigration],
            ['Last migration', lastMigration]
          ]));
          console.log();
        });
      });
  }

  setCurrent(migration) {
    return this.migrator
      .then((migrator) => (
        migrator.setCurrent(migration)
      ))
      .then(({ fullId }) => {
        console.log(blue(`Current migration has been set to ${ red(fullId) }`));
        console.log();
      });
  }
}

module.exports = Migrator;
