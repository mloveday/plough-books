import {FetchStatus} from "../Model/Enum/FetchStatus";
import {FetchMethod, FetchProgressStatus} from "./FetchProgressStatus";

export abstract class ExternalState {
  public static DEFAULT_KEY = 'default';
  public readonly fetchStates: FetchProgressStatus[] = [];

  protected constructor(fetchStates: FetchProgressStatus[]) {
    this.fetchStates = fetchStates;
  }

  public updatedState(state: FetchStatus,
                      method: FetchMethod = 'get',
                      key: string = ExternalState.DEFAULT_KEY): FetchProgressStatus[] {
    if (this.fetchStates.find(fs => fs.key === key && fs.method === method) === undefined) {
      const newStates = this.fetchStates.map(fs => fs);
      newStates.push(new FetchProgressStatus(key, method, state));
      return newStates;
    }
    return this.fetchStates.map(fs => fs.key === key && fs.method === method ? new FetchProgressStatus(key, method, state) : fs);
  }

  public isLoaded() {
    return !this.isEmpty() && this.fetchStates.reduce((prev, curr) => prev && (curr.fetchStatus === FetchStatus.OK), true);
  }
  public isEmpty() {
    return this.fetchStates.length === 0;
  }
}