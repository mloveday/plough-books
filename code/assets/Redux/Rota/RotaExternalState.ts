import * as moment from "moment";
import {FetchStatus} from "../../Model/Enum/FetchStatus";
import {RotasForWeek} from "../../Model/Rota/RotasForWeek";
import {weeksDataKey} from "../../Util/DateUtils";
import {ExternalState} from "../ExternalState";

export class RotaExternalState extends ExternalState {
  public readonly rotasForWeek: RotasForWeek = RotasForWeek.default();

  public with(entities: RotasForWeek, states: Map<string, FetchStatus>) {
    return Object.assign(
      this.clone(),
      {
        rotasForWeek: entities,
        states
      }
    );
  }

  public withStateChange(states: Map<string, FetchStatus>) {
    return Object.assign(
      this.clone(),
      {states}
    );
  }

  public shouldLoadForDate(date: moment.Moment) {
    return this.isEmpty()
      || (this.rotasForWeek && !this.states.has(weeksDataKey(date)) && !this.rotasForWeek.hasRotaForDate(date));
  }

  private clone() {
    return Object.assign(
      new RotaExternalState(),
      this,
      {
        rotasForWeek: this.rotasForWeek.update([])
      }
    );
  }
}