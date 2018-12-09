import {FetchStatus} from "../../../Enum/FetchStatus";
import {ExternalState} from "../../../State/ExternalState";
import {StaffMembersLocalState} from "./StaffMembersLocalState";

export class StaffMembersExternalState extends ExternalState {
  public readonly externalState: StaffMembersLocalState;
  public readonly id: number = 0;

  constructor(state: FetchStatus, externalState?: StaffMembersLocalState) {
    super(state);
    this.externalState = externalState ? externalState : StaffMembersLocalState.default();
  }
}