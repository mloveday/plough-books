import {FetchStatus} from "../../Model/Enum/FetchStatus";
import {ExternalState} from "../ExternalState";
import {HolidayLocalState} from "./HolidayLocalState";

export class HolidayExternalState extends ExternalState {
  public readonly externalState: HolidayLocalState = HolidayLocalState.default();

  public with(entities: HolidayLocalState, states: Map<string, FetchStatus>) {
    return Object.assign(
      new HolidayExternalState(),
      this,
      {
        externalState: entities,
        states
      }
    );
  }
}