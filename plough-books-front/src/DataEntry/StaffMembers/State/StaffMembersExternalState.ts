import {FetchStatus} from "../../../Enum/FetchStatus";
import {ExternalState} from "../../../State/ExternalState";
import {StaffMembersLocalState} from "./StaffMembersLocalState";

export class StaffMembersExternalState extends ExternalState {
  public readonly rotaExternalState: StaffMembersLocalState | undefined;
  public readonly id: number = 0;

  constructor(state: FetchStatus, rotaExternalState?: StaffMembersLocalState) {
    super(state);
    this.rotaExternalState = rotaExternalState;
  }
}