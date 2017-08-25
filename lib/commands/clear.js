module.exports = (vorpal) => {
  vorpal
    .command('clear')
    .description('Clears the terminal.')
    .action((args, cb) => {
      process.stdout.write('\x1bc');

      cb();
    });
};
