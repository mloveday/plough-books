import {FetchStatus} from "../../../Model/Enum/FetchStatus";
import {FetchMethod} from "../../../Redux/FetchProgressStatus";

export class StatusItem {
  public readonly method: FetchMethod;
  public readonly state: string;
  public readonly key: string;
  public readonly status: FetchStatus;

  constructor(state: string, key: string, status: FetchStatus, method: FetchMethod) {
    this.state = state;
    this.key = key;
    this.status = status;
    this.method = method;
  }
}