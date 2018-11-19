import {RotaLocalState} from "./RotaLocalState";

export class RotaExternalState {
    public readonly rotaExternalState: RotaLocalState|undefined;
    public readonly state: string;
    public readonly id: string;

    constructor(state: string, rotaExternalState?: RotaLocalState) {
        this.rotaExternalState = rotaExternalState;
        this.state = state;
        this.id = rotaExternalState ? rotaExternalState.date.format('YMMDD') : '0';
    }
}