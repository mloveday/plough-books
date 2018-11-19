import {StaffMembersLocalState} from "./StaffMembersLocalState";

export class StaffMembersExternalState {
  public readonly rotaExternalState: StaffMembersLocalState | undefined;
  public readonly state: string;
  public readonly id: number = 0;

  constructor(state: string, rotaExternalState?: StaffMembersLocalState) {
    this.rotaExternalState = rotaExternalState;
    this.state = state;
  }
}