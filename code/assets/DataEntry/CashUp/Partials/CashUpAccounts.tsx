import * as React from "react";
import {connect} from "react-redux";
import {CashUpEntity} from "../../../Model/CashUp/CashUpEntity";
import {CashUpEntityUpdateType} from "../../../Model/CashUp/CashUpEntityTypes";
import {Receipt} from "../../../Model/Receipt/Receipt";
import {AppState} from "../../../redux";
import {currencyPattern, positiveCurrencyPattern} from "../../../Util/Validation";

interface CashUpAccountsOwnProps {
  cashUp: CashUpEntity;
  formUpdate: (obj: CashUpEntityUpdateType) => void;
}

interface CashUpAccountsStateProps {
}

const mapStateToProps = (state: AppState, ownProps: CashUpAccountsOwnProps): CashUpAccountsStateProps => {
  return {}
};

interface CashUpAccountsDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: CashUpAccountsOwnProps): CashUpAccountsDispatchProps => {
  return {};
};

type CashUpAccountsProps = CashUpAccountsOwnProps & CashUpAccountsStateProps & CashUpAccountsDispatchProps;

class CashUpAccountsComponent extends React.Component<CashUpAccountsProps, {}> {
  public render() {
    return (
      <div className="form-group receipts">
        <h3 className="group-title receipts_label">Accounts</h3>
        <button className='receipt_add_button' type='button' onClick={ev => {
          this.props.formUpdate({
            accounts: this.props.cashUp.accounts
              .map(r => r.clone())
              .concat([Receipt.default()])
          });
        }}>+
        </button>
        {this.props.cashUp.accounts.map(account => this.accountInput(account))}
        <div className="form-row deprecated">
          <div className="label-and-input charge_to_ac">
            <label htmlFor="charge_to_ac">Charge to account (deprecated)</label>
            <input id="charge_to_ac" type="text" pattern={currencyPattern}
                   value={this.props.cashUp.inputs.chargeToAccount}
                   onChange={ev => this.props.formUpdate({chargeToAccount: ev.target.value})}/>
          </div>
        </div>
      </div>
    )
  }

  private accountInput(account: Receipt) {
    const identifier = account.id ? account.id : account.timestamp;
    return (
      <div className={`receipt${account.inputs.isOutgoing ? ' outgoing' : ' incoming'}`} key={identifier}>
        <div className="label-and-input receipt_desc">
          <label htmlFor={`account_desc_${identifier}`}>Description</label>
          <input id={`account_desc_${identifier}`} type="text"
                 value={account.inputs.description}
                 onChange={ev => this.updateAccount(account.with({description: ev.target.value}))}/>
        </div>
        <div className="label-and-input receipt_amnt">
          <label htmlFor={`account_amnt_${identifier}`}>Amount</label>
          <input id={`account_amnt_${identifier}`} type="text" pattern={positiveCurrencyPattern}
                 value={account.inputs.amount}
                 onChange={ev => this.updateAccount(account.with({amount: ev.target.value}))}/>
        </div>
        <div className="label-and-input receipt_amnt">
          <label htmlFor={`account_outgoing_${identifier}_outgoing`}>Account charged</label>
          <input id={`account_outgoing_${identifier}_outgoing`} type="radio" name={`account_outgoing_${identifier}`}
                 checked={account.inputs.isOutgoing} value={'outgoing'}
                 onChange={ev => {this.updateAccount(account.with({isOutgoing: ev.target.value === 'outgoing'}))}}/>
          <label htmlFor={`account_outgoing_${identifier}_incoming`}>Account paid</label>
          <input id={`account_outgoing_${identifier}_incoming`} type="radio" name={`account_outgoing_${identifier}`}
                 checked={!account.inputs.isOutgoing} value={'incoming'}
                 onChange={ev => {this.updateAccount(account.with({isOutgoing: ev.target.value === 'outgoing'}))}}/>
        </div>
      </div>
    )
  }

  private updateAccount(account: Receipt) {
    const clonedAccounts = this.props.cashUp.accounts
      .map(existingAccount => (account.id ? (existingAccount.id === account.id) : existingAccount.timestamp === account.timestamp) ? account : existingAccount.clone());
    this.props.formUpdate({accounts: clonedAccounts});
  }
}

export const CashUpAccounts = connect<CashUpAccountsStateProps, CashUpAccountsDispatchProps, CashUpAccountsOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(CashUpAccountsComponent);
