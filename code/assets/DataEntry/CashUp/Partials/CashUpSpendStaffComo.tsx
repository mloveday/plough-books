import * as React from "react";
import {connect} from "react-redux";
import {CashUpEntity} from "../../../Model/CashUp/CashUpEntity";
import {CashUpEntityUpdateType} from "../../../Model/CashUp/CashUpEntityTypes";
import {AppState} from "../../../redux";
import {currencyPattern} from "../../../Util/Validation";

interface CashUpSpendStaffComoOwnProps {
  cashUp: CashUpEntity;
  formUpdate: (obj: CashUpEntityUpdateType) => void;
}

interface CashUpSpendStaffComoStateProps {
}

const mapStateToProps = (state: AppState, ownProps: CashUpSpendStaffComoOwnProps): CashUpSpendStaffComoStateProps => {
  return {}
};

interface CashUpSpendStaffComoDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: CashUpSpendStaffComoOwnProps): CashUpSpendStaffComoDispatchProps => {
  return {};
};

type CashUpSpendStaffComoProps =
  CashUpSpendStaffComoOwnProps
  & CashUpSpendStaffComoStateProps
  & CashUpSpendStaffComoDispatchProps;

class CashUpSpendStaffComoComponent extends React.Component<CashUpSpendStaffComoProps, {}> {
  public render() {
    return (
      <div className="form-group">
        <div className="label-and-input spend_staff_pts">
          <label htmlFor="spend_staff_points">Spend & staff points</label>
          <input id="spend_staff_points" type="text" pattern={currencyPattern}
                 value={this.props.cashUp.inputs.spendStaffPts}
                 onChange={ev => this.props.formUpdate({spendStaffPts: ev.target.value})}/>
        </div>
        <div className="label-and-input como_disc_asset">
          <label htmlFor="como_disc_asset">COMO Discount asset</label>
          <input id="como_disc_asset" type="text" pattern={currencyPattern}
                 value={this.props.cashUp.inputs.comoDiscAsset}
                 onChange={ev => this.props.formUpdate({comoDiscAsset: ev.target.value})}/>
        </div>
      </div>
    )
  }
}

export const CashUpSpendStaffComo = connect<CashUpSpendStaffComoStateProps, CashUpSpendStaffComoDispatchProps, CashUpSpendStaffComoOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(CashUpSpendStaffComoComponent);
