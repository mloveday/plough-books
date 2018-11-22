import {FetchStatus} from "../../../Enum/FetchStatus";
import {ExternalState} from "../../../State/ExternalState";
import {CashUpLocalState} from "./CashUpLocalState";

export class CashUpExternalState extends ExternalState {
    public readonly cashUpExternalState: CashUpLocalState|undefined;
    public readonly id: string;

    constructor(state: FetchStatus, cashUpExternalState?: CashUpLocalState) {
        super(state);
        this.cashUpExternalState = cashUpExternalState;
        this.id = cashUpExternalState ? cashUpExternalState.date.format('YMMDD') : '0';
    }
}