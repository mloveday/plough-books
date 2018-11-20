import {ConstantsLocalState} from "./ConstantsLocalState";

export class ConstantsExternalState {
  public readonly externalState: ConstantsLocalState | undefined;
  public readonly state: string;

  constructor(state: string, constantsLocalState?: ConstantsLocalState) {
    this.externalState = constantsLocalState;
    this.state = state;
  }
}