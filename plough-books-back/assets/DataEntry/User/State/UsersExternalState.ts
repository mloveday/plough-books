import {FetchStatus} from "../../../Enum/FetchStatus";
import {ExternalState} from "../../../State/ExternalState";
import {UsersLocalState} from "./UsersLocalState";

export class UsersExternalState extends ExternalState {
  public readonly externalState: UsersLocalState;
  public readonly id: number = 0;

  constructor(state: FetchStatus, externalState: UsersLocalState = UsersLocalState.default()) {
    super(state);
    this.externalState = externalState;
  }
}