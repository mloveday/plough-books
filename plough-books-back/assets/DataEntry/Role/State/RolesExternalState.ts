import {FetchStatus} from "../../../Enum/FetchStatus";
import {ExternalState} from "../../../State/ExternalState";
import {RolesLocalState} from "./RolesLocalState";

export class RolesExternalState extends ExternalState {
  public readonly externalState: RolesLocalState;
  public readonly id: number = 0;

  constructor(state: FetchStatus, externalState: RolesLocalState = RolesLocalState.default()) {
    super(state);
    this.externalState = externalState;
  }
}