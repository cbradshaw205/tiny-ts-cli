
// TypeDI
import 'reflect-metadata';
import { Container } from 'typedi';

import chalk from "chalk";
import { Command, InvalidArgumentError } from 'commander';
import { Logger } from './core/logger.js';

export const main = async (argv: string[]) => {
  // Argument Validation
  const [command] = argv;

  const logger = new Logger({ context: 'TinyCli', color: chalk.blueBright })

  // Import config
  let config;
  try {
    // config = await import('../tinycli.config.json');
  } catch (e) {
    logger.error('Error importing config.\n%o', e);
  }

  let script, options;
  if (command === 'run') {
    const [, name] = argv;
    try {
      logger.start().info(`Importing Module...`);
      const { Script, args } = await import(`../scripts/${name}`);
      script = Container.get(Script);
      options = args;
      logger.stop().success(`Succesfully imported module.`);
    } catch (e) {
      logger.stop().error('Cannot import module: %s\n%o', name, e);
      process.exit(1);
    }
  }
  
  let cli = new Command();

  cli.command('run')
  .argument('<name>', 'name of script to run')
  .action(async (options) => {
    await script.run();
  })

  if (options.length > 0) {
    cli = generateOptions(cli, options);
  }

  await cli.parseAsync(argv, { from: 'user' });

  return 0;
};

const generateOptions = (command: Command, options: { name: string, type: string, required: boolean }[]) => {

  function myParseInt(value, dummyPrevious) {
    // parseInt takes a string and a radix
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
      throw new InvalidArgumentError('Not a number.');
    }
    return parsedValue;
  }
  
  for (const { name, type, required } of options) {
    if (required) {
      command.requiredOption(`--${name} <value>`, 'Test description', myParseInt)
    } else {
      command.option(`${name} <value>`, 'Test description', myParseInt)
    }
  }

  return command;
}

main(process.argv.splice(2));
