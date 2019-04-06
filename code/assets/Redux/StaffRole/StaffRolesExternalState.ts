import {FetchStatus} from "../../Model/Enum/FetchStatus";
import {ExternalState} from "../ExternalState";
import {StaffRolesLocalState} from "./StaffRolesLocalState";

export class StaffRolesExternalState extends ExternalState {
  public readonly externalState: StaffRolesLocalState = StaffRolesLocalState.default();

  public with(entities: StaffRolesLocalState, states: Map<string, FetchStatus>) {
    return Object.assign(
      new StaffRolesExternalState(),
      this,
      {
        externalState: entities,
        states
      }
    );
  }
}