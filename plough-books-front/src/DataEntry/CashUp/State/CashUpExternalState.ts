import {FetchStatus} from "../../../Enum/FetchStatus";
import {ExternalState} from "../../../State/ExternalState";
import {CashUpLocalState} from "./CashUpLocalState";

export class CashUpExternalState extends ExternalState {
    public readonly cashUpExternalState: CashUpLocalState|undefined;

    constructor(state: FetchStatus, cashUpExternalState?: CashUpLocalState) {
        super(state);
        this.cashUpExternalState = cashUpExternalState;
    }
}