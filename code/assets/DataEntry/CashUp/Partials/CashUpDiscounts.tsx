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
        <div className="label-and-input comps_wet">
          <label htmlFor="comps_wet">Wet Comps</label>
          <input id="comps_wet" type="text" pattern={currencyPattern}
                 value={this.props.cashUp.inputs.compsWet}
                 onChange={ev => this.props.formUpdate({compsWet: ev.target.value})}/>
        </div>
        <div className="label-and-input d_staff_dry">
          <label htmlFor="d_staff_dry">Discount staff dry</label>
          <input id="d_staff_dry" type="text" pattern={currencyPattern}
                 value={this.props.cashUp.inputs.dStaffDry}
                 onChange={ev => this.props.formUpdate({dStaffDry: ev.target.value})}/>
        </div>
        <div className="label-and-input d_customers_wet">
          <label htmlFor="d_customers_wet">Discount customers wet</label>
          <input id="d_customers_wet" type="text" pattern={currencyPattern}
                 value={this.props.cashUp.inputs.dCustomersWet}
                 onChange={ev => this.props.formUpdate({dCustomersWet: ev.target.value})}/>
        </div>
        <div className="label-and-input d_customers_dry">
          <label htmlFor="d_customers_dry">Discount customers dry</label>
          <input id="d_customers_dry" type="text" pattern={currencyPattern}
                 value={this.props.cashUp.inputs.dCustomersDry}
                 onChange={ev => this.props.formUpdate({dCustomersDry: ev.target.value})}/>
        </div>
        <div className="label-and-input d_customers_coffee">
          <label htmlFor="d_customers_coffee">Discount customer coffee</label>
          <input id="d_customers_coffee" type="text" pattern={currencyPattern}
                 value={this.props.cashUp.inputs.dCustomersCoffee}
                 onChange={ev => this.props.formUpdate({dCustomersCoffee: ev.target.value})}/>
        </div>
        <div className="label-and-input fwt_wet">
          <label htmlFor="fwt_wet">FWT wet</label>
          <input id="fwt_wet" type="text" pattern={currencyPattern}
                 value={this.props.cashUp.inputs.fwtWet}
                 onChange={ev => this.props.formUpdate({fwtWet: ev.target.value})}/>
        </div>
        <div className="label-and-input como_in_drawer">
          <label htmlFor="como_in_drawer">COMO in drawer</label>
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
