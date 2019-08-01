import {ExternalState} from "../ExternalState";
import {FetchProgressStatus} from "../FetchProgressStatus";
import {RotaStaffingTemplatesLocalState} from "./RotaStaffingTemplatesLocalState";

export class RotaStaffingTemplatesExternalState extends ExternalState {
  public readonly externalState: RotaStaffingTemplatesLocalState = RotaStaffingTemplatesLocalState.default();

  constructor(externalState: RotaStaffingTemplatesLocalState = RotaStaffingTemplatesLocalState.default(),
              fetchStates: FetchProgressStatus[] = []) {
    super(fetchStates);
    this.externalState = externalState;
  }

  public with(entities: RotaStaffingTemplatesLocalState, states: FetchProgressStatus[]) {
    return new RotaStaffingTemplatesExternalState(entities, states);
  }
}