import {FetchStatus} from "../../Model/Enum/FetchStatus";
import {ExternalState} from "../ExternalState";
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