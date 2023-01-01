import chalk from "chalk";
// import ora from "ora-classic";
import { Status } from "../enums/status.enum.js";
import { Task } from "../models/task.model.js";
import { Logger } from "./logger.js";
import { sleep } from "./utils.js";
import * as readline from 'readline';
import { Service } from "typedi";
import ora from "ora";

export interface TaskOptions {
  tasks: {
    name: string,
    promise: Promise<any>
  }[];
  group?: string;
  withConcurrency?: boolean;
  withLogger?: boolean;
}

@Service()
export class Tasks {
  private stream: NodeJS.WriteStream;
  private tasks: Task[];
  private position: number; // Position in the terminal
  private numTasks: number;
  private intervalId: NodeJS.Timer;
  private animationSpeed = 100;

  constructor() {
    this.stream = process.stdout;
  };

  public async exec(options: TaskOptions) {
    const { tasks, group, withConcurrency } = options;

    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      return;
    }

    // Setup state
    this.numTasks = tasks.length;
    this.tasks = tasks.map((t, index) => {
      return {
        name: t.name,
        promise: t.promise,
        spinner: ora({ 
          stream: this.stream, 
          text: t.name, 
          prefixText: this.getPrefix(index),
          discardStdin: false
        }),
        status: Status.idle,
        finalRender: false,
        idleRender: false
      }
    });
    this.position = 0;

    // Group label
    if (group) {
      console.log(`${chalk.grey('[')} ${chalk.blueBright(group)} ${chalk.grey(']')}`)
    }

    // Render multi spinners
    this.intervalId = setInterval(this.renderMultiSpinner.bind(this), this.animationSpeed);

    const results = await this.invokeTasks(!!withConcurrency);

    return [];
  }

  private async invokeTasks(withConcurrency: boolean): Promise<any[]> {
    let results = [];

    if (withConcurrency) {
      const promises = this.tasks.map(task => this.invokeTask(task));
      results = await Promise.all(promises);
    } else {
      for await (const task of this.tasks) {
        const result = await this.invokeTask(task);
        results.push(result);
      }
    }

    // Wait 1 cycle for render to complete, then clear the interval
    await sleep(100) 
    clearInterval(this.intervalId);

    return results;
  }

  private async invokeTask(task): Promise<{
    status: Status,
    name: string,
    data?: any,
    reason?: any
  }> {
    try {
      task.status = Status.loading;
      const result = await task.promise;
      task.status = Status.success
      return { 
        status: task.status, 
        name: task.name, 
        data: result 
      }          
    } catch (e) {
      task.status = Status.error;
      return { 
        status: task.status, 
        name: task.name, 
        reason: e
      }
    }
  }

  private renderMultiSpinner() {
    if (this.position !== 0) {
      this.stream.moveCursor(0, -this.numTasks);
      this.position = 0;
    }

    for (const [index, task] of this.tasks.entries()) { 
      this.position = index;
      
      // Move to the position of the spinner, assume task1 = 0th position
      this.stream.moveCursor(0, index);
      this.stream.cursorTo(0);

      // Render spinner based on status
      if (task.status === Status.loading) {
        task.spinner.render();
      } else if (task.status === Status.success && !task.finalRender) {
        task.spinner.succeed();
        task.finalRender = true;
        this.position += 1;
      } else if (task.status === Status.error && !task.finalRender) {
        task.spinner.fail();
        task.finalRender = true;
        this.position += 1;
      } else if (task.status === Status.idle) {
        task.spinner.stopAndPersist({ symbol: '*' });
        task.idleRender = true;
        this.position += 1;
      }

      // Go back to the top of the group
      this.stream.moveCursor(0, -this.position);
    }

    // After render, move cursor to normal position
    this.stream.moveCursor(0, this.numTasks);
    this.stream.cursorTo(0);
  }

  private getPrefix(index: number): string {
    let prefix = index === 0 ? '┌─' : index === this.numTasks - 1 ? '└─' : '├─';
    return chalk.grey(prefix);
  };

}