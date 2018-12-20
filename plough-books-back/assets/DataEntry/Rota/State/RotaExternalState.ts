import * as moment from "moment";
import {FetchStatus} from "../../../Enum/FetchStatus";
import {ExternalState} from "../../../State/ExternalState";
import {weeksDataKey} from "../../../Util/DateUtils";
import {RotasForWeek} from "./RotasForWeek";

export class RotaExternalState extends ExternalState {
    public readonly rotasForWeek: RotasForWeek = RotasForWeek.default();

    public with(entities: RotasForWeek, states: Map<string, FetchStatus>) {
        return Object.assign(
          new RotaExternalState(),
          this,
          {
              rotasForWeek: entities,
              states
          }
        );
    }

    public shouldLoadForDate(date: moment.Moment) {
      return this.isEmpty()
        || (this.rotasForWeek && !this.states.has(weeksDataKey(date)) && !this.rotasForWeek.hasRotaForDate(date));
    }
}