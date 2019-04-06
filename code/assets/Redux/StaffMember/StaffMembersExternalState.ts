import {FetchStatus} from "../../Model/Enum/FetchStatus";
import {ExternalState} from "../ExternalState";
import {StaffMembersLocalState} from "./StaffMembersLocalState";

export class StaffMembersExternalState extends ExternalState {
  public readonly externalState: StaffMembersLocalState = StaffMembersLocalState.default();

  public with(entities: StaffMembersLocalState, states: Map<string, FetchStatus>) {
    return Object.assign(
      new StaffMembersExternalState(),
      this,
      {
        externalState: entities,
        states
      }
    );
  }
}