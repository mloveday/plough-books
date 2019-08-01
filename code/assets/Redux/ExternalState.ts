import {FetchStatus} from "../Model/Enum/FetchStatus";
import {FetchProgressStatus} from "./FetchProgressStatus";

export abstract class ExternalState {
  public static DEFAULT_KEY = 'default';
  public readonly fetchStates: FetchProgressStatus[] = [];

  constructor(fetchStates: FetchProgressStatus[]) {
    this.fetchStates = fetchStates;
  }

  public updatedState(state: FetchStatus, key: string = ExternalState.DEFAULT_KEY): FetchProgressStatus[] {
    if (this.fetchStates.find(fs => fs.key === key) === undefined) {
      const newStates = this.fetchStates.map(fs => fs);
      newStates.push(new FetchProgressStatus(key, 'get', state));
      return newStates;
    }
    return this.fetchStates.map(fs => fs.key === key ? new FetchProgressStatus(key, fs.fetchType, state) : fs);
  }

  public isLoaded() {
    return !this.isEmpty() && this.fetchStates.reduce((prev, curr) => prev && (curr.fetchStatus === FetchStatus.OK), true);
  }
  public isEmpty() {
    return this.fetchStates.length === 0;
  }
}