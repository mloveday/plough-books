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
          <label htmlFor="paid_out_amnt">Float transfer</label>
          <input id="paid_out_amnt" type="text" pattern={currencyPattern}
                 value={this.props.cashUp.inputs.paidOutAmount}
                 onChange={ev => this.props.formUpdate({paidOutAmount: ev.target.value})}/>
        </div>
        <div className="label-and-input banked">
          <label htmlFor="banked">Banked (1)</label>
          <input id="banked" type="text" pattern={currencyPattern}
                 value={this.props.cashUp.inputs.banked}
                 onChange={ev => this.props.formUpdate({banked: ev.target.value})}/>
        </div>
        <div className="label-and-input cash_advantage_bag">
          <label htmlFor="cash_advantage_bag">Cash advantage bag (1)</label>
          <input id="cash_advantage_bag" type="text"
                 value={this.props.cashUp.cashAdvantageBag}
                 onChange={ev => this.props.formUpdate({cashAdvantageBag: ev.target.value})}/>
        </div>
        <div className="label-and-input cash_advantage_bag_seen_by">
          <label htmlFor="cash_advantage_bag_seen_by">Seen by (1)</label>
          <input id="cash_advantage_bag_seen_by" type="text"
                 value={this.props.cashUp.cashAdvantageBagSeenBy}
                 onChange={ev => this.props.formUpdate({cashAdvantageBagSeenBy: ev.target.value})}/>
        </div>
        <div className="label-and-input banked_2">
          <label htmlFor="banked_2">Banked (2)</label>
          <input id="banked_2" type="text" pattern={currencyPattern}
                 value={this.props.cashUp.inputs.bankedPm}
                 onChange={ev => this.props.formUpdate({bankedPm: ev.target.value})}/>
        </div>
        <div className="label-and-input cash_advantage_bag_2">
          <label htmlFor="cash_advantage_bag_2">Cash advantage bag (2)</label>
          <input id="cash_advantage_bag_2" type="text"
                 value={this.props.cashUp.cashAdvantageBagPm}
                 onChange={ev => this.props.formUpdate({cashAdvantageBagPm: ev.target.value})}/>
        </div>
        <div className="label-and-input cash_advantage_bag_seen_by_2">
          <label htmlFor="cash_advantage_bag_seen_by_2">Seen by (2)</label>
          <input id="cash_advantage_bag_seen_by_2" type="text"
                 value={this.props.cashUp.cashAdvantageBagSeenByPm}
                 onChange={ev => this.props.formUpdate({cashAdvantageBagSeenByPm: ev.target.value})}/>
        </div>
        <div className="label-and-input paypal deprecated">
          <label htmlFor="paypal">Paypal</label>
          <input id="paypal" type="text" pattern={currencyPattern}
                 value={this.props.cashUp.inputs.paypal}
                 onChange={ev => this.props.formUpdate({paypal: ev.target.value})}/>
        </div>
        <div className="label-and-input deliveroo deprecated">
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
