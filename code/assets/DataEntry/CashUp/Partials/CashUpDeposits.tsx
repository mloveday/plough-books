import * as React from "react";
import {connect} from "react-redux";
import {CashUpEntity} from "../../../Model/CashUp/CashUpEntity";
import {CashUpEntityUpdateType} from "../../../Model/CashUp/CashUpEntityTypes";
import {Receipt} from "../../../Model/Receipt/Receipt";
import {AppState} from "../../../redux";
import {positiveCurrencyPattern} from "../../../Util/Validation";

interface CashUpDepositsOwnProps {
  cashUp: CashUpEntity;
  formUpdate: (obj: CashUpEntityUpdateType) => void;
}

interface CashUpDepositsStateProps {
}

const mapStateToProps = (state: AppState, ownProps: CashUpDepositsOwnProps): CashUpDepositsStateProps => {
  return {}
};

interface CashUpDepositsDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: CashUpDepositsOwnProps): CashUpDepositsDispatchProps => {
  return {};
};

type CashUpDepositsProps = CashUpDepositsOwnProps & CashUpDepositsStateProps & CashUpDepositsDispatchProps;

class CashUpDepositsComponent extends React.Component<CashUpDepositsProps, {}> {
  public render() {
    return (
      <div className="form-group receipts">
        <h3 className="group-title receipts_label">Deposits</h3>
        <button className='receipt_add_button' type='button' onClick={ev => {
          this.props.formUpdate({
            deposits: this.props.cashUp.deposits
              .map(r => r.clone())
              .concat([Receipt.default()])
          });
        }}>+
        </button>
        {this.props.cashUp.deposits.map(deposit => this.depositInput(deposit))}
      </div>
    )
  }

  private depositInput(deposit: Receipt) {
    const identifier = deposit.id ? deposit.id : deposit.timestamp;
    return (
      <div className={`receipt${deposit.inputs.isOutgoing ? ' outgoing' : ' incoming'}`} key={identifier}>
        <div className="label-and-input receipt_desc">
          <label htmlFor={`deposit_desc_${identifier}`}>Description</label>
          <input id={`deposit_desc_${identifier}`} type="text"
                 value={deposit.inputs.description}
                 onChange={ev => this.updateDeposit(deposit.with({description: ev.target.value}))}/>
        </div>
        <div className="label-and-input receipt_amnt">
          <label htmlFor={`deposit_amnt_${identifier}`}>Amount</label>
          <input id={`deposit_amnt_${identifier}`} type="text" pattern={positiveCurrencyPattern}
                 value={deposit.inputs.amount}
                 onChange={ev => this.updateDeposit(deposit.with({amount: ev.target.value}))}/>
        </div>
        <div className="label-and-input receipt_amnt">
          <label htmlFor={`deposit_outgoing_${identifier}_outgoing`}>Deposit redeemed</label>
          <input id={`deposit_outgoing_${identifier}_outgoing`} type="radio" name={`deposit_outgoing_${identifier}`}
                 checked={deposit.inputs.isOutgoing} value={'outgoing'}
                 onChange={ev => {this.updateDeposit(deposit.with({isOutgoing: ev.target.value === 'outgoing'}))}}/>
          <label htmlFor={`deposit_outgoing_${identifier}_incoming`}>Deposit paid</label>
          <input id={`deposit_outgoing_${identifier}_incoming`} type="radio" name={`deposit_outgoing_${identifier}`}
                 checked={!deposit.inputs.isOutgoing} value={'incoming'}
                 onChange={ev => {this.updateDeposit(deposit.with({isOutgoing: ev.target.value === 'outgoing'}))}}/>
        </div>
      </div>
    )
  }

  private updateDeposit(deposit: Receipt) {
    const clonedDeposits = this.props.cashUp.deposits
      .map(existingDeposit => (deposit.id ? (existingDeposit.id === deposit.id) : existingDeposit.timestamp === deposit.timestamp) ? deposit : existingDeposit.clone());
    this.props.formUpdate({deposits: clonedDeposits});
  }
}

export const CashUpDeposits = connect<CashUpDepositsStateProps, CashUpDepositsDispatchProps, CashUpDepositsOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(CashUpDepositsComponent);
