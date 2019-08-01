import {ExternalState} from "../ExternalState";
import {FetchProgressStatus} from "../FetchProgressStatus";
import {ConstantsLocalState} from "./ConstantsLocalState";

export class ConstantsExternalState extends ExternalState {
  public readonly externalState: ConstantsLocalState = ConstantsLocalState.default();

  constructor(externalState: ConstantsLocalState = ConstantsLocalState.default(),
              fetchStates: FetchProgressStatus[] = []) {
    super(fetchStates);
    this.externalState = externalState;
  }
}