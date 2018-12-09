import * as moment from "moment";
import {FetchStatus} from "../../../Enum/FetchStatus";
import {ExternalState} from "../../../State/ExternalState";
import {DateFormats} from "../../../Util/DateFormats";
import {CashUpsForWeek} from "./CashUpsForWeek";

export class CashUpExternalState extends ExternalState {
    public readonly cashUpsForWeek: CashUpsForWeek;

    constructor(state: FetchStatus, cashUpsForWeek: CashUpsForWeek = CashUpsForWeek.default()) {
        super(state);
        this.cashUpsForWeek = cashUpsForWeek;
    }

    public shouldLoadForDate(date: moment.Moment) {
    return this.isEmpty()
      || (this.isLoaded() && !this.cashUpsForWeek.cashUps.has(date.format(DateFormats.API)));
  }
}