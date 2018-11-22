import {FetchStatus} from "../../../Enum/FetchStatus";
import {ExternalState} from "../../../State/ExternalState";
import {StaffRolesLocalState} from "./StaffRolesLocalState";

export class StaffRolesExternalState extends ExternalState {
  public readonly rotaExternalState: StaffRolesLocalState | undefined;
  public readonly id: number = 0;

  constructor(state: FetchStatus, rotaExternalState?: StaffRolesLocalState) {
    super(state);
    this.rotaExternalState = rotaExternalState;
  }
}