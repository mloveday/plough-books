import {FetchStatus} from "../../../Enum/FetchStatus";
import {ExternalState} from "../../../State/ExternalState";
import {ConstantsLocalState} from "./ConstantsLocalState";

export class ConstantsExternalState extends ExternalState {
  public readonly externalState: ConstantsLocalState = ConstantsLocalState.default();

  public with(entities: ConstantsLocalState, states: Map<string, FetchStatus>) {
    return Object.assign(
      new ConstantsExternalState(),
      this,
      {
        externalState: entities,
        states
      }
    );
  }
}