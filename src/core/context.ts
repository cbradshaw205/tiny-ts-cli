import ora, { Ora } from "ora-classic";
import { Logger } from "./logger";

export class Context {
  public options: any;
  public logger: Logger
  public spinner: Ora;

  constructor(options) {
    this.options = options;
    this.spinner = ora();
    this.logger = new Logger(this.spinner)
  }
}