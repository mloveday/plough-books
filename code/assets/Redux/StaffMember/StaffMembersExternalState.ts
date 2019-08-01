import {ExternalState} from "../ExternalState";
import {FetchProgressStatus} from "../FetchProgressStatus";
import {StaffMembersLocalState} from "./StaffMembersLocalState";

export class StaffMembersExternalState extends ExternalState {
  public readonly externalState: StaffMembersLocalState = StaffMembersLocalState.default();

  constructor(externalState: StaffMembersLocalState = StaffMembersLocalState.default(),
              fetchStates: FetchProgressStatus[] = []) {
    super(fetchStates);
    this.externalState = externalState;
  }
}