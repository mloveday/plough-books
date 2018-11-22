import {FetchStatus} from "../../../Enum/FetchStatus";
import {ExternalState} from "../../../State/ExternalState";
import {ConstantsLocalState} from "./ConstantsLocalState";

export class ConstantsExternalState extends ExternalState {
  public readonly externalState: ConstantsLocalState | undefined;

  constructor(state: FetchStatus, constantsLocalState?: ConstantsLocalState) {
    super(state);
    this.externalState = constantsLocalState;
  }
}