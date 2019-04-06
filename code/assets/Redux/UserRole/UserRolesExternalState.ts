import {FetchStatus} from "../../Enum/FetchStatus";
import {ExternalState} from "../../State/ExternalState";
import {UserRolesLocalState} from "./UserRolesLocalState";

export class UserRolesExternalState extends ExternalState {
  public readonly externalState: UserRolesLocalState = UserRolesLocalState.default();

  public with(entities: UserRolesLocalState, states: Map<string, FetchStatus>) {
    return Object.assign(
      new UserRolesExternalState(),
      this,
      {
        externalState: entities,
        states
      }
    );
  }
}