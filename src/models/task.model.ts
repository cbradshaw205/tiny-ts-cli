import { Ora } from "ora-classic";
import { Status } from "../enums/status.enum";

export interface Task {
  name: string;
  spinner: Ora;
  status: Status;
  finalRender: boolean;
  idleRender: boolean;
  promise: Promise<any>
}