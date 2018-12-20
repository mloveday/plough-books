import {FetchStatus} from "../Enum/FetchStatus";

export abstract class ExternalState {
  protected readonly state: FetchStatus;
  protected readonly fetchKeys: string[] = [];

  protected constructor(state: FetchStatus, fetchKeys: string[] = []) {
    if (state === FetchStatus.OK && fetchKeys.length > 0) {
      this.state = FetchStatus.STARTED;
    } else {
      this.state = state;
    }
    this.fetchKeys = fetchKeys;
  }

  public isLoaded() {
    return this.state === FetchStatus.OK && this.fetchKeys.length === 0;
  }
  public isEmpty() {
    return this.state === FetchStatus.EMPTY;
  }

  public getFetchKeys(newState: FetchStatus, newFetchKey: string): string[] {
    if (newState === FetchStatus.OK) {
      const fetchedKeyIndex = this.fetchKeys.indexOf(newFetchKey);
      if (fetchedKeyIndex > 0) {
        this.fetchKeys.splice(fetchedKeyIndex, 1);
        return this.fetchKeys;
      }
    } else if (newState === FetchStatus.STARTED) {
      this.fetchKeys.push(newFetchKey);
      return this.fetchKeys;
    }
    return this.fetchKeys;
  }
}