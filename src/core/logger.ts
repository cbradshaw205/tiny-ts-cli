import chalk, { Chalk } from "chalk";
import ora, { Ora } from "ora-classic";
import { DateTime } from "luxon";
import { Status } from "../enums/status.enum";
import util from "util";

export interface LoggerOptions {
  context?: string;
  color?: Chalk;
  textColor?: Chalk;
  verbose?: boolean;
}

export class Logger {
  private spinner: Ora;
  private context: string;
  private color: Chalk;
  private textColor: Chalk;
  private spinnerStatus: Status;
  private verbose: boolean;

  constructor(options?: LoggerOptions) {
    this.context = options?.context;
    this.color = options?.color;
    this.textColor = options?.textColor;
    this.spinnerStatus = Status.idle;
    this.spinner = ora({ stream: process.stdout });
    this.verbose = !!options?.verbose;
  };

  public info(message, ...args: any[]) {
    this.log(message, Status.info, args);
  }

  public success(message, ...args: any[]) {
    this.log(message, Status.success, args);
  }

  public error(message, ...args: any[]) {
    this.log(message, Status.error, args);
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
    }
  }

  private getColor(str: string) {
    return this.color ? this.color(str) : str;
  }

  private getTextColor(str: string) {
    return this.textColor ? this.textColor(str) : str;
  }

  private getResultType(status: Status) {
    switch (status) {
      case Status.success:
        return this.spinner.succeed.bind(this.spinner)
      case Status.error:
        return this.spinner.fail.bind(this.spinner);
      case Status.info:
        return this.spinner.info.bind(this.spinner);
    }
  }
}