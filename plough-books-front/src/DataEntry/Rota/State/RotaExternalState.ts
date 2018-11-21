import {RotasForWeek} from "./RotasForWeek";

export class RotaExternalState {
    public readonly rotasForWeek: RotasForWeek|undefined;
    public readonly state: string;

    constructor(state: string, rotasForWeek?: RotasForWeek) {
        this.rotasForWeek = rotasForWeek;
        this.state = state;
    }
}