import {FetchStatus} from "../Model/Enum/FetchStatus";

export type FetchMethod = 'post'|'get';

export class FetchProgressStatus {
  public readonly key: string;
  public readonly method: FetchMethod;
  public readonly fetchStatus: FetchStatus;

  constructor(key: string,
              method: FetchMethod = 'get',
              fetchStatus: FetchStatus) {
    this.key = key;
    this.method = method;
    this.fetchStatus = fetchStatus;
  }
}