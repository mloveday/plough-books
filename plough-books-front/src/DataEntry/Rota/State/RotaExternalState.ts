import * as moment from "moment";
import {FetchStatus} from "../../../Enum/FetchStatus";
import {ExternalState} from "../../../State/ExternalState";
import {DateFormats} from "../../../Util/DateFormats";
import {RotasForWeek} from "./RotasForWeek";

export class RotaExternalState extends ExternalState {
    public readonly rotasForWeek: RotasForWeek|undefined;

    constructor(state: FetchStatus, rotasForWeek?: RotasForWeek) {
        super(state);
        this.rotasForWeek = rotasForWeek;
    }

    public shouldLoadForDate(date: moment.Moment) {
      return this.isEmpty()
        || (this.rotasForWeek && this.isLoaded() && !this.rotasForWeek.rotas.has(date.format(DateFormats.API)));
    }
}