import { Ora } from "ora";
import { Status } from "../enums/status.enum.js";

export interface Task {
  name: string;
  spinner: Ora;
  status: Status;
  finalRender: boolean;
  idleRender: boolean;
  promise: Promise<any>
}