import * as moment from "moment";
import {FetchStatus} from "../../../Enum/FetchStatus";
import {ExternalState} from "../../../State/ExternalState";
import {RotasForWeek} from "./RotasForWeek";

export class RotaExternalState extends ExternalState {
    public readonly rotasForWeek: RotasForWeek;

    constructor(state: FetchStatus, rotasForWeek: RotasForWeek = RotasForWeek.default(), fetchKeys: string[]) {
        super(state, fetchKeys);
        this.rotasForWeek = rotasForWeek;
    }

    public shouldLoadForDate(date: moment.Moment) {
      return this.isEmpty()
        || (this.rotasForWeek && this.isLoaded() && !this.rotasForWeek.hasRotaForDate(date));
    }
}