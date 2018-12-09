import {FetchStatus} from "../../../Enum/FetchStatus";
import {ExternalState} from "../../../State/ExternalState";
import {ConstantsLocalState} from "./ConstantsLocalState";

export class ConstantsExternalState extends ExternalState {
  public readonly externalState: ConstantsLocalState;

  constructor(state: FetchStatus, constantsLocalState: ConstantsLocalState = ConstantsLocalState.default()) {
    super(state);
    this.externalState = constantsLocalState;
  }
}