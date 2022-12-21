import chalk from "chalk";
import ora from "ora-classic";
import { Status } from "../enums/status.enum";
import { Task } from "../models/task.model";
import { Logger } from "./logger";
import { getCursorPos, sleep } from "./utils";

export interface TaskOptions {
  tasks: {
    name: string,
    promise: Promise<any>
  }[];
  group?: string;
  withConcurrency?: boolean
}

export class Tasks {
  private stream: NodeJS.WriteStream;
  private tasks: Task[];
  private position: number; // Position in the terminal
  private numTasks: number;
  private intervalId: NodeJS.Timer;
  
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
    this.position = (await getCursorPos()).rows;

    // Group label
    if (group) {
      console.log(`${chalk.grey('[')} ${chalk.blueBright(group)} ${chalk.grey(']')}`)
    }

    // Render multi spinners
    this.intervalId = setInterval(this.renderMultiSpinner.bind(this), 100)
    
    const results = await this.invokeTasks(!!withConcurrency);

    return results;
  }

  private async invokeTasks(withConcurrency: boolean): Promise<any[]> {
    let results = [];

    if (withConcurrency) {
      const promises = this.tasks.map(task => this.invokeTask(task));
      results = await Promise.all(promises);
    } else {
      for (const task of this.tasks) {
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
    const { tasks, position, stream, numTasks } = this;

    for (const [index, ts] of tasks.entries()) {
      stream.cursorTo(0, position + index);
    
      if (ts.status === Status.loading) {
        ts.spinner.render();
      } else if (ts.status === Status.success && !ts.finalRender) {
        ts.spinner.succeed();
        ts.finalRender = true;
      } else if (ts.status === Status.error && !ts.finalRender) {
        ts.spinner.fail();
        ts.finalRender = true;
      } else if (ts.status === Status.idle && !ts.idleRender) {
        ts.spinner.stopAndPersist({ symbol: '*' });
        ts.idleRender = true;
      }
    }
    stream.cursorTo(0, position + numTasks);

    const status = tasks.map(ts => ts.status);
  }

  private getPrefix(index: number): string {
    let prefix = index === 0 ? '┌─' : index === this.numTasks - 1 ? '└─' : '├─';
    return chalk.grey(prefix);
  };
}