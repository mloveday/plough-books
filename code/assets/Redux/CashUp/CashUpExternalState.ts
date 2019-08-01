import * as moment from "moment";
import {CashUpsForWeek} from "../../Model/CashUp/CashUpsForWeek";
import {DateFormats} from "../../Util/DateFormats";
import {ExternalState} from "../ExternalState";
import {FetchProgressStatus} from "../FetchProgressStatus";

export class CashUpExternalState extends ExternalState {
  public readonly cashUpsForWeek: CashUpsForWeek = CashUpsForWeek.default();

  constructor(cashUpsForWeek: CashUpsForWeek = CashUpsForWeek.default(),
              fetchStates: FetchProgressStatus[] = []) {
    super(fetchStates);
    this.cashUpsForWeek = cashUpsForWeek;
  }

  public shouldLoadForDate(date: moment.Moment) {
    return this.isEmpty()
      || (this.isLoaded() && !this.cashUpsForWeek.cashUps.find(
        cashUp => date.format(DateFormats.API_DATE) === cashUp.date));
  }
}