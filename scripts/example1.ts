import chalk from "chalk";
import { Service } from "typedi";
import { Logger } from "../src/core/logger.js";
import { Tasks } from "../src/core/tasks.js";
import { sleep } from "../src/core/utils.js";
import { Colors } from "../src/enums/colors.enum.js";

export const args = [
  {
    name: 'arg1',
    type: 'string',
    required: true
  }
];

@Service()
export class Script {
  constructor(private logger: Logger, private tasks: Tasks) {
    logger.setOptions({ context: 'ExampleScript', color: Colors.magentaBright, verbose: false });
  }

  async run() {
    this.logger.start().info('Loading some stuff...');
    await sleep(1500);
    this.logger.info('Still loading...');
    await sleep(1500);
    this.logger.stop().success('Finally');

    await this.tasks.exec({
      group: 'Test Group #1',
      withConcurrency: false,
      tasks: [
        {
          name: 'task1',
          promise: sleep(1000),
        },
        {
          name: 'task2',
          promise: sleep(1000),
        },
        {
          name: 'task3',
          promise: sleep(1000),
        },
        {
          name: 'task4',
          promise: sleep(1000),
        }
      ]
    });
    
    await this.tasks.exec({
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

    this.logger.success('Done Process.');
  }
}