import chalk, { Chalk } from "chalk";
import { DateTime } from "luxon";
import { Status } from "../enums/status.enum.js";
import util from "util";
import { Service } from "typedi";
import ora, { Ora } from "ora";

export interface LoggerOptions {
  context?: string;
  color?: Chalk;
  textColor?: Chalk;
  verbose?: boolean;
}
@Service()
export class Logger {
  private spinner: Ora;
  private color: Chalk;
  private textColor: Chalk;
  private spinnerStatus: Status;
  private verbose: boolean;
  public context: string;

  constructor(options?: LoggerOptions) {
    this.context = options?.context;
    this.color = options?.color;
    this.textColor = options?.textColor;
    this.spinnerStatus = Status.idle;
    this.spinner = ora({ stream: process.stdout });
    this.verbose = !!options?.verbose;
  };

  public setOptions(options: LoggerOptions) {
    this.context = options.context;
    this.color = options.color;
    this.textColor = options.textColor;
    this.verbose = !!options.verbose;
  }

  public info(message, ...args: any[]) {
    this.log(message, Status.info, args);
  }

  public success(message, ...args: any[]) {
    this.log(message, Status.success, args);
  }

  public error(message, ...args: any[]) {
    this.log(message, Status.error, args);
  }

  public warn(message, ...args: any[]) {
    this.log(message, Status.warn, args);
  }

  public start() {
    this.spinnerStatus = Status.started;
    return this;
  }

  public stop() {
    this.spinnerStatus = Status.stopped;
    return this;
  }

  private log(message: string, logStatus: Status, args: any[]) {
    const prefix = `[${chalk.gray(this.getTime())}] ${this.context ? `(${this.getColor(this.context)}) ` : ''}[${this.getStatus(logStatus)}]`;
    const output = util.format(`${this.getTextColor(message)}`, ...args);

    if (this.spinnerStatus !== Status.idle) {
      this.logWithSpinner(prefix, output);
    } else {
      console.log(`${prefix} ${output}`);
    }
  }

  private logWithSpinner(prefix: string, output: string) {
    const previousLog = `${this.spinner.prefixText} ${this.spinner.text}`;

    // Set prefix
    this.spinner.prefixText = prefix;

    if (this.spinnerStatus === Status.started) {
      this.spinner.start(output);
      this.spinnerStatus = Status.loading;
      return;
    }
  
    if (this.verbose) {
      this.spinner.stop();
      console.log(previousLog);
      this.spinner.start(output);
    } else {
      this.spinner.text = output;
    }

    if (this.spinnerStatus === Status.stopped) {
      this.spinner.stop()
      this.spinnerStatus = Status.idle;
      console.log(`${prefix} ${output}`);
      return;
    }
  }

  private getTime(): string {
    return DateTime.now().toFormat('hh:mm:ss:SSS');
  }

  private getStatus(status: Status) {
    switch (status) {
      case Status.error:
        return chalk.red('error');
      case Status.success:
        return chalk.green('success');
      case Status.info:
        return chalk.blue('info')
      case Status.warn:
        return chalk.yellow('warn');
    }
  }

  private getColor(str: string) {
    return this.color ? this.color(str) : str;
  }

  private getTextColor(str: string) {
    return this.textColor ? this.textColor(str) : str;
  }
}