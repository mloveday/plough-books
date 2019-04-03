import {FetchStatus} from "../../../Enum/FetchStatus";
import {ExternalState} from "../../../State/ExternalState";
import {RolesLocalState} from "./RolesLocalState";

export class RolesExternalState extends ExternalState {
  public readonly externalState: RolesLocalState = RolesLocalState.default();

  public with(entities: RolesLocalState, states: Map<string, FetchStatus>) {
    return Object.assign(
      new RolesExternalState(),
      this,
      {
        externalState: entities,
        states
      }
    );
  }
}