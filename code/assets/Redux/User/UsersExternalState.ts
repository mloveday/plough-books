import {FetchStatus} from "../../Model/Enum/FetchStatus";
import {ExternalState} from "../ExternalState";
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