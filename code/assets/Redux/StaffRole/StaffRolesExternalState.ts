import {ExternalState} from "../ExternalState";
import {FetchProgressStatus} from "../FetchProgressStatus";
import {StaffRolesLocalState} from "./StaffRolesLocalState";

export class StaffRolesExternalState extends ExternalState {
  public readonly externalState: StaffRolesLocalState = StaffRolesLocalState.default();

  constructor(externalState: StaffRolesLocalState = StaffRolesLocalState.default(),
              fetchStates: FetchProgressStatus[] = []) {
    super(fetchStates);
    this.externalState = externalState;
  }
}