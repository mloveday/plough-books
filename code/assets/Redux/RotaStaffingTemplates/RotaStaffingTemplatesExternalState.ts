import {FetchStatus} from "../../Model/Enum/FetchStatus";
import {ExternalState} from "../ExternalState";
import {RotaStaffingTemplatesLocalState} from "./RotaStaffingTemplatesLocalState";

export class RotaStaffingTemplatesExternalState extends ExternalState {
  public readonly externalState: RotaStaffingTemplatesLocalState = RotaStaffingTemplatesLocalState.default();

  public with(entities: RotaStaffingTemplatesLocalState, states: Map<string, FetchStatus>) {
    return Object.assign(
      new RotaStaffingTemplatesExternalState(),
      this,
      {
        externalState: entities,
        states
      }
    );
  }
}