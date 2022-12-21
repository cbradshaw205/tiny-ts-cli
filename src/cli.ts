
import ora from 'ora-classic';
import { Command, InvalidArgumentError } from 'commander';
// import { Script } from './models/script.model.js';
import { Logger } from './core/logger';
import chalk from "chalk";


const sleep = (ms) => new Promise(r => setTimeout(r, ms));

export const main = async (argv: string[]) => {
  // Argument Validation
  const [command] = argv;

  const spinner = ora({ stream: process.stdout });
  const logger = new Logger({ context: 'TinyCli', color: chalk.blueBright, verbose: false })

  // Import config
  let config;
  try {
    const config = require('../tinycli.config.json');
    
  } catch (e) {
    logger.error('%o', e);
  }


  let scriptName = null;
  if (command === 'run') {
    try {
      [, scriptName] = argv;
      logger.start().info(`Importing Module: ${scriptName}`);
      await sleep(1000);
      logger.info('Test');
      await sleep(2000);
      logger.info('Test2');
      await sleep(500);
      logger.stop().error('Error occured: %s', 'Because u suck');

    } catch (e) {
      logger.error(`Error importing Module: ${scriptName}`)
    }
  }
  
  const cli = new Command();

  cli.command('run')
  .argument('<name>', 'name of script to run')
  .action(async (options) => {
    
  })

  // cli = generateOptions(cli, args);

  await cli.parseAsync(argv, { from: 'user' });
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
