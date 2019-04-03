import {FetchStatus} from "../Enum/FetchStatus";

export abstract class ExternalState {
  public readonly states: Map<string, FetchStatus> = new Map();

  public updatedState(state: FetchStatus, key: string = 'default') {
    return new Map(this.states.set(key, state));
  }

  public isLoaded() {
    return !this.isEmpty() && Array.from(this.states.values()).reduce((prev, curr) => prev && (curr === FetchStatus.OK), true);
  }
  public isEmpty() {
    return this.states.size === 0;
  }
}