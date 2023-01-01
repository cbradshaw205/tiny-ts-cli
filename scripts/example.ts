import chalk from "chalk";
import { sleep } from "../src/core/utils.js";

export const script = async (context) => {
  const { logger, spinner, tasks, options } = context;

  logger.setOptions({ context: 'Example', color: chalk.green });

  logger.start().info('Loading some stuff...');
  await sleep(1500);
  logger.info('Still loading...');
  await sleep(1500);
  logger.stop().success('Finally');

  await tasks.exec({
    group: 'Test Group #1',
    withConcurrency: false,
    tasks: [
      {
        name: 'task1',
        promise: sleep(1000),
      },
      {
        name: 'task2',
        promise: sleep(2000),
      },
      {
        name: 'task3',
        promise: sleep(3000),
      },
      {
        name: 'task4',
        promise: sleep(4000),
      }
    ]
  });
  
  await tasks.exec({
    group: 'Test Group #2',
    withConcurrency: true,
    tasks: [
      {
        name: 'task1',
        promise: sleep(1000),
      },
      {
        name: 'task2',
        promise: sleep(3000),
      },
      {
        name: 'task3',
        promise: sleep(1000),
      },
      {
        name: 'task4',
        promise: sleep(4000),
      }
    ]
  });

  spinner.start('Test');
  await sleep(1000);
  spinner.succeed();

  logger.info('TEST');
}

export const args = [
  {
    name: 'arg1',
    type: 'string',
    required: true
  }
];