import * as React from "react";
import {connect} from "react-redux";
import {CashUpEntity} from "../../../Model/CashUp/CashUpEntity";
import {CashUpEntityUpdateType} from "../../../Model/CashUp/CashUpEntityTypes";
import {AppState} from "../../../redux";
import {currencyPattern} from "../../../Util/Validation";

interface CashUpNettTakesOwnProps {
  cashUp: CashUpEntity;
  formUpdate: (obj: CashUpEntityUpdateType) => void;
}

interface CashUpNettTakesStateProps {
}

const mapStateToProps = (state: AppState, ownProps: CashUpNettTakesOwnProps): CashUpNettTakesStateProps => {
  return {}
};

interface CashUpNettTakesDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: CashUpNettTakesOwnProps): CashUpNettTakesDispatchProps => {
  return {};
};

type CashUpNettTakesProps = CashUpNettTakesOwnProps & CashUpNettTakesStateProps & CashUpNettTakesDispatchProps;

class CashUpNettTakesComponent extends React.Component<CashUpNettTakesProps, {}> {
  public render() {
    return (
      <div className="form-group">
        <h3 className="group-title nett_takes_label">Nett takes</h3>
        <div className="label-and-input take_dry">
          <label htmlFor="take_dry">Dry</label>
          <input id="take_dry" type="text" pattern={currencyPattern}
                 value={this.props.cashUp.inputs.takeDry}
                 onChange={ev => this.props.formUpdate({takeDry: ev.target.value})}/>
        </div>
        <div className="label-and-input take_coffee">
          <label htmlFor="take_coffee">Coffee</label>
          <input id="take_coffee" type="text" pattern={currencyPattern}
                 value={this.props.cashUp.inputs.takeCoffee}
                 onChange={ev => this.props.formUpdate({takeCoffee: ev.target.value})}/>
        </div>
        <div className="label-and-input take_vouchers_wet">
          <label htmlFor="take_gift_card">Vouchers Wet</label>
          <input id="take_gift_card" type="text" pattern={currencyPattern}
                 value={this.props.cashUp.inputs.takeVouchersWet}
                 onChange={ev => this.props.formUpdate({takeVouchersWet: ev.target.value})}/>
        </div>
        <div className="label-and-input take_vouchers_dry">
          <label htmlFor="take_gift_card">Vouchers Dry</label>
          <input id="take_gift_card" type="text" pattern={currencyPattern}
                 value={this.props.cashUp.inputs.takeVouchersDry}
                 onChange={ev => this.props.formUpdate({takeVouchersDry: ev.target.value})}/>
        </div>
        <div className="label-and-input take_vouchers_hot">
          <label htmlFor="take_gift_card">Vouchers Hot</label>
          <input id="take_gift_card" type="text" pattern={currencyPattern}
                 value={this.props.cashUp.inputs.takeVouchersHot}
                 onChange={ev => this.props.formUpdate({takeVouchersHot: ev.target.value})}/>
        </div>
        <div className="label-and-input take_deposit_paid">
          <label htmlFor="take_deposit_paid">Deposit paid</label>
          <input id="take_deposit_paid" type="text" pattern={currencyPattern}
                 value={this.props.cashUp.inputs.takeDepositPaid}
                 onChange={ev => this.props.formUpdate({takeDepositPaid: ev.target.value})}/>
        </div>
      </div>
    )
  }
}

export const CashUpNettTakes = connect<CashUpNettTakesStateProps, CashUpNettTakesDispatchProps, CashUpNettTakesOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(CashUpNettTakesComponent);
