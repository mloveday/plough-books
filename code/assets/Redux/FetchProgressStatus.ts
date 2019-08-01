import {FetchStatus} from "../Model/Enum/FetchStatus";

type FetchType = 'post'|'get';

export class FetchProgressStatus {
  public readonly key: string;
  public readonly fetchType: FetchType;
  public readonly fetchStatus: FetchStatus;

  constructor(key: string,
              fetchType: FetchType = 'get',
              fetchStatus: FetchStatus) {
    this.key = key;
    this.fetchType = fetchType;
    this.fetchStatus = fetchStatus;
  }
}