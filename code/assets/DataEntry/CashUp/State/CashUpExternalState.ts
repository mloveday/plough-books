import * as moment from "moment";
import {FetchStatus} from "../../../Enum/FetchStatus";
import {ExternalState} from "../../../State/ExternalState";
import {CashUpsForWeek} from "../../../Model/CashUp/CashUpsForWeek";

export class CashUpExternalState extends ExternalState {
    public readonly cashUpsForWeek: CashUpsForWeek = CashUpsForWeek.default();

    public with(entities: CashUpsForWeek, states: Map<string, FetchStatus>) {
        return Object.assign(
          new CashUpExternalState(),
          this,
          {
              cashUpsForWeek: entities,
              states
          }
        );
    }

    public shouldLoadForDate(date: moment.Moment) {
    return this.isEmpty()
      || (this.isLoaded() && !this.cashUpsForWeek.cashUps.find(cashUp => date.isSame(cashUp.date, 'day')));
  }
}