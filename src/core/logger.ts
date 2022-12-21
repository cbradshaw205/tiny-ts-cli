import chalk from "chalk";
import { Ora } from "ora-classic";

export class Logger {
  private spinner: Ora;

  constructor(ora?: Ora) {
    this.spinner = ora;
  };

  public info(message) {
    this.log(message, 'info');
  }

  public success(message) {
    this.log(message, 'success');
  }

  public error(message) {
    this.log(message, 'error');
  }

  private log(message, status?) {
    const output = `[${chalk.gray(this.getDate())}] [${this.getStatus(status)}] ${message}`
    
    if (this.spinner?.isSpinning) {
      this.spinner.stop()
      console.log(output);
      this.spinner.start();
    } else {
      console.log(output);
    }
  }

  private getDate(): string {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}:${now.getMilliseconds()}`
  }

  private getStatus(status: string) {
    switch (status) {
      case 'error':
        return chalk.red('error');
      case 'success':
        return chalk.green('success');
      default:
        return chalk.grey('info');
    }
  }
}