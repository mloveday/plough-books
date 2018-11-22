import {FetchStatus} from "../../../Enum/FetchStatus";
import {ExternalState} from "../../../State/ExternalState";
import {RotasForWeek} from "./RotasForWeek";

export class RotaExternalState extends ExternalState {
    public readonly rotasForWeek: RotasForWeek|undefined;

    constructor(state: FetchStatus, rotasForWeek?: RotasForWeek) {
        super(state);
        this.rotasForWeek = rotasForWeek;
    }
}