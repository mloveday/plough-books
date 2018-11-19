import {StaffRolesLocalState} from "./StaffRolesLocalState";

export class StaffRolesExternalState {
  public readonly rotaExternalState: StaffRolesLocalState | undefined;
  public readonly state: string;
  public readonly id: number = 0;

  constructor(state: string, rotaExternalState?: StaffRolesLocalState) {
    this.rotaExternalState = rotaExternalState;
    this.state = state;
  }
}