import {ExternalState} from "../ExternalState";
import {FetchProgressStatus} from "../FetchProgressStatus";
import {UsersLocalState} from "./UsersLocalState";

export class UsersExternalState extends ExternalState {
  public readonly externalState: UsersLocalState = UsersLocalState.default();

  constructor(externalState: UsersLocalState = UsersLocalState.default(),
              fetchStates: FetchProgressStatus[] = []) {
    super(fetchStates);
    this.externalState = externalState;
  }
}