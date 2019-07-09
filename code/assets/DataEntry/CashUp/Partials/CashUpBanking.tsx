import * as React from "react";
import {connect} from "react-redux";
import {CashUpEntity} from "../../../Model/CashUp/CashUpEntity";
import {CashUpEntityUpdateType} from "../../../Model/CashUp/CashUpEntityTypes";
import {AppState} from "../../../redux";
import {currencyPattern} from "../../../Util/Validation";

interface CashUpBankingOwnProps {
  cashUp: CashUpEntity;
  formUpdate: (obj: CashUpEntityUpdateType) => void;
}

interface CashUpBankingStateProps {
}

const mapStateToProps = (state: AppState, ownProps: CashUpBankingOwnProps): CashUpBankingStateProps => {
  return {}
};

interface CashUpBankingDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: CashUpBankingOwnProps): CashUpBankingDispatchProps => {
  return {};
};

type CashUpBankingProps = CashUpBankingOwnProps & CashUpBankingStateProps & CashUpBankingDispatchProps;

class CashUpBankingComponent extends React.Component<CashUpBankingProps, {}> {
  public render() {
    return (
      <div className="form-group">
        <h3 className="group-title banking_label">Banking</h3>
        <div className="label-and-input paid_out_amnt">
          <label htmlFor="paid_out_amnt">Paid out</label>
          <input id="paid_out_amnt" type="text" pattern={currencyPattern}
                 value={this.props.cashUp.inputs.paidOutAmount}
                 onChange={ev => this.props.formUpdate({paidOutAmount: ev.target.value})}/>
        </div>
        <div className="label-and-input paid_out_to">
          <label htmlFor="paid_out_to">Paid out to</label>
          <input id="paid_out_to" type="text"
                 value={this.props.cashUp.paidOutTo}
                 onChange={ev => this.props.formUpdate({paidOutTo: ev.target.value})}/>
        </div>
        <div className="label-and-input banked">
          <label htmlFor="banked">Banked</label>
          <input id="banked" type="text" pattern={currencyPattern}
                 value={this.props.cashUp.inputs.banked}
                 onChange={ev => this.props.formUpdate({banked: ev.target.value})}/>
        </div>
        <div className="label-and-input cash_advantage_bag">
          <label htmlFor="cash_advantage_bag">Cash advantage bag</label>
          <input id="cash_advantage_bag" type="text"
                 value={this.props.cashUp.cashAdvantageBag}
                 onChange={ev => this.props.formUpdate({cashAdvantageBag: ev.target.value})}/>
        </div>
        <div className="label-and-input cash_advantage_bag_seen_by">
          <label htmlFor="cash_advantage_bag_seen_by">Seen by</label>
          <input id="cash_advantage_bag_seen_by" type="text"
                 value={this.props.cashUp.cashAdvantageBagSeenBy}
                 onChange={ev => this.props.formUpdate({cashAdvantageBagSeenBy: ev.target.value})}/>
        </div>
        <div className="label-and-input paypal">
          <label htmlFor="paypal">Paypal</label>
          <input id="paypal" type="text" pattern={currencyPattern}
                 value={this.props.cashUp.inputs.paypal}
                 onChange={ev => this.props.formUpdate({paypal: ev.target.value})}/>
        </div>
        <div className="label-and-input deliveroo">
          <label htmlFor="deliveroo">Deliveroo</label>
          <input id="deliveroo" type="text" pattern={currencyPattern}
                 value={this.props.cashUp.inputs.deliveroo}
                 onChange={ev => this.props.formUpdate({deliveroo: ev.target.value})}/>
        </div>
      </div>
    )
  }
}

export const CashUpBanking = connect<CashUpBankingStateProps, CashUpBankingDispatchProps, CashUpBankingOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(CashUpBankingComponent);
