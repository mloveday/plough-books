import * as React from "react";
import {connect} from "react-redux";
import {CashUpEntity} from "../../../Model/CashUp/CashUpEntity";
import {CashUpEntityUpdateType} from "../../../Model/CashUp/CashUpEntityTypes";
import {AppState} from "../../../redux";
import {currencyPattern} from "../../../Util/Validation";

interface CashUpDiscountsOwnProps {
  cashUp: CashUpEntity;
  formUpdate: (obj: CashUpEntityUpdateType) => void;
}

interface CashUpDiscountsStateProps {
}

const mapStateToProps = (state: AppState, ownProps: CashUpDiscountsOwnProps): CashUpDiscountsStateProps => {
  return {}
};

interface CashUpDiscountsDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: CashUpDiscountsOwnProps): CashUpDiscountsDispatchProps => {
  return {};
};

type CashUpDiscountsProps = CashUpDiscountsOwnProps & CashUpDiscountsStateProps & CashUpDiscountsDispatchProps;

class CashUpDiscountsComponent extends React.Component<CashUpDiscountsProps, {}> {
  public render() {
    return (
      <div className="form-group">
        <h3 className="group-title discounts_label">Discounts</h3>
        <div className="label-and-input voucher_wet">
          <label htmlFor="voucher_wet">Vouchers wet</label>
          <input id="voucher_wet" type="text" pattern={currencyPattern}
                 value={this.props.cashUp.inputs.takeVouchersWet}
                 onChange={ev => this.props.formUpdate({takeVouchersWet: ev.target.value})}/>
        </div>
        <div className="label-and-input voucher_dry">
          <label htmlFor="voucher_dry">Vouchers dry</label>
          <input id="voucher_dry" type="text" pattern={currencyPattern}
                 value={this.props.cashUp.inputs.takeVouchersDry}
                 onChange={ev => this.props.formUpdate({takeVouchersDry: ev.target.value})}/>
        </div>
        <div className="label-and-input voucher_hot">
          <label htmlFor="voucher_hot">Vouchers hot</label>
          <input id="voucher_hot" type="text" pattern={currencyPattern}
                 value={this.props.cashUp.inputs.takeVouchersHot}
                 onChange={ev => this.props.formUpdate({takeVouchersHot: ev.target.value})}/>
        </div>
        <div className="label-and-input como_in_drawer">
          <label htmlFor="como_in_drawer">COMO with budget (dry)</label>
          <input id="como_in_drawer" type="text" pattern={currencyPattern}
                 value={this.props.cashUp.inputs.comoInDrawer}
                 onChange={ev => this.props.formUpdate({comoInDrawer: ev.target.value})}/>
        </div>
      </div>
    )
  }
}

export const CashUpDiscounts = connect<CashUpDiscountsStateProps, CashUpDiscountsDispatchProps, CashUpDiscountsOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(CashUpDiscountsComponent);
