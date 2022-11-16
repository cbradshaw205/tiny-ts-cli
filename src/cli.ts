import { Command } from 'commander';

export const main = async () => {
  const cli = new Command();

  cli
  .option('-d, --debug', 'output extra debugging')
  .option('-s, --small', 'small pizza size')
  .option('-p, --pizza-type <type>', 'flavour of pizza');

  cli.parse(process.argv);
};

main();