import {ExternalState} from "../ExternalState";
import {FetchProgressStatus} from "../FetchProgressStatus";
import {UserRolesLocalState} from "./UserRolesLocalState";

export class UserRolesExternalState extends ExternalState {
  public readonly externalState: UserRolesLocalState = UserRolesLocalState.default();

  constructor(externalState: UserRolesLocalState = UserRolesLocalState.default(),
              fetchStates: FetchProgressStatus[] = []) {
    super(fetchStates);
    this.externalState = externalState;
  }
}