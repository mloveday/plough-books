import * as moment from "moment";
import {RotasForWeek} from "../../Model/Rota/RotasForWeek";
import {weeksDataKey} from "../../Util/DateUtils";
import {ExternalState} from "../ExternalState";
import {FetchProgressStatus} from "../FetchProgressStatus";

export class RotaExternalState extends ExternalState {
  public readonly rotasForWeek: RotasForWeek = RotasForWeek.default();

  constructor(rotasForWeek: RotasForWeek = RotasForWeek.default(),
              fetchStates: FetchProgressStatus[] = []) {
    super(fetchStates);
    this.rotasForWeek = rotasForWeek;
  }

  public withStateChange(states: FetchProgressStatus[]) {
    return new RotaExternalState(this.rotasForWeek.update([]), states);
  }

  public shouldLoadForDate(date: moment.Moment) {
    return this.isEmpty()
      || (this.rotasForWeek && this.fetchStates.find(fs => fs.key === weeksDataKey(date)) === undefined && !this.rotasForWeek.hasRotaForDate(date));
  }
}