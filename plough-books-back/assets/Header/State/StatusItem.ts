import {FetchStatus} from "../../Enum/FetchStatus";

export class StatusItem {
  public readonly state: string;
  public readonly key: string;
  public readonly status: FetchStatus;

  constructor(state: string, key: string, status: FetchStatus) {
    this.state = state;
    this.key = key;
    this.status = status;
  }
}