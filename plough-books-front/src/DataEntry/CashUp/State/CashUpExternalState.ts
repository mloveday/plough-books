import {CashUpLocalState} from "./CashUpLocalState";

export class CashUpExternalState {
    public readonly cashUpExternalState: CashUpLocalState|undefined;
    public readonly state: string;
    public readonly id: string;

    constructor(state: string, cashUpExternalState?: CashUpLocalState) {
        this.cashUpExternalState = cashUpExternalState;
        this.state = state;
        this.id = cashUpExternalState ? cashUpExternalState.date.format('YMMDD') : '0';
    }
}