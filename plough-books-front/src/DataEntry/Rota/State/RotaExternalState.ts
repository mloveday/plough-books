import {RotaLocalStates} from "./RotaLocalStates";

export class RotaExternalState {
    public readonly rotaExternalState: RotaLocalStates|undefined;
    public readonly state: string;

    constructor(state: string, rotaExternalState?: RotaLocalStates) {
        this.rotaExternalState = rotaExternalState;
        this.state = state;
    }
}