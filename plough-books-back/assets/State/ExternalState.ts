import {FetchStatus} from "../Enum/FetchStatus";

export abstract class ExternalState {
  protected readonly state: FetchStatus;

  protected constructor(state: FetchStatus) {
    this.state = state;
  }

  public isLoaded() {
    return this.state === FetchStatus.OK;
  }
  public isEmpty() {
    return this.state === FetchStatus.EMPTY;
  }
}