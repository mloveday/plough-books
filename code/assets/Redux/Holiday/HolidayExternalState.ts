import {ExternalState} from "../ExternalState";
import {FetchProgressStatus} from "../FetchProgressStatus";
import {HolidayLocalState} from "./HolidayLocalState";

export class HolidayExternalState extends ExternalState {
  public readonly externalState: HolidayLocalState = HolidayLocalState.default();

  constructor(externalState: HolidayLocalState = HolidayLocalState.default(),
              fetchStates: FetchProgressStatus[] = []) {
    super(fetchStates);
    this.externalState = externalState;
  }
}