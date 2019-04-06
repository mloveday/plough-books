import {FetchStatus} from "../../Enum/FetchStatus";
import {ExternalState} from "../../State/ExternalState";
import {UsersLocalState} from "./UsersLocalState";

export class UsersExternalState extends ExternalState {
  public readonly externalState: UsersLocalState = UsersLocalState.default();

  public with(entities: UsersLocalState, states: Map<string, FetchStatus>) {
    return Object.assign(
      new UsersExternalState(),
      this,
      {
        externalState: entities,
        states
      }
    );
  }
}