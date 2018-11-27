import {FetchStatus} from "../../../Enum/FetchStatus";
import {ExternalState} from "../../../State/ExternalState";
import {StaffRolesLocalState} from "./StaffRolesLocalState";

export class StaffRolesExternalState extends ExternalState {
  public readonly externalState: StaffRolesLocalState;
  public readonly id: number = 0;

  constructor(state: FetchStatus, externalState?: StaffRolesLocalState) {
    super(state);
    this.externalState = externalState ? externalState : StaffRolesLocalState.default();
  }
}