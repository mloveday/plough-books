import * as React from "react";
import {connect} from "react-redux";
import {CashUpEntity} from "../../../Model/CashUp/CashUpEntity";
import {CashUpEntityUpdateType} from "../../../Model/CashUp/CashUpEntityTypes";
import {AppState} from "../../../redux";
import {SafeFloatDenom} from "./SafeFloatDenom";

interface CashUpSafeFloatOwnProps {
  cashUp: CashUpEntity;
  formUpdate: (obj: CashUpEntityUpdateType) => void;
}

interface CashUpSafeFloatStateProps {
}

const mapStateToProps = (state: AppState, ownProps: CashUpSafeFloatOwnProps): CashUpSafeFloatStateProps => {
  return {}
};

interface CashUpSafeFloatDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: CashUpSafeFloatOwnProps): CashUpSafeFloatDispatchProps => {
  return {};
};

type CashUpSafeFloatProps = CashUpSafeFloatOwnProps & CashUpSafeFloatStateProps & CashUpSafeFloatDispatchProps;

class CashUpSafeFloatComponent extends React.Component<CashUpSafeFloatProps, {}> {
  public render() {
    const floatInTills = this.props.cashUp.tills.reduce((prev, curr) => prev + curr.float_amnt, 0);
    return (
      <div className="form-group safe-float">
        <h3 className="group-title safe_float_label">Safe float denom</h3>
        <SafeFloatDenom cashUpPropName='sfdAm' formUpdate={obj => this.props.formUpdate(obj)} friendlyTimeName="AM"
                        safeFloatObj={this.props.cashUp.sfdAm} totalFloatInTills={floatInTills}/>
        <SafeFloatDenom cashUpPropName='sfdPm' formUpdate={obj => this.props.formUpdate(obj)} friendlyTimeName="PM"
                        safeFloatObj={this.props.cashUp.sfdPm} totalFloatInTills={floatInTills}/>
        <div className="label-and-input safe_float_notes">
          <label htmlFor="sfd_notes">Notes</label>
          <input id="sfd_notes" type="text"
                 value={this.props.cashUp.sfdNotes}
                 onChange={ev => this.props.formUpdate({sfdNotes: ev.target.value})}/>
        </div>
      </div>
    )
  }
}

export const CashUpSafeFloat = connect<CashUpSafeFloatStateProps, CashUpSafeFloatDispatchProps, CashUpSafeFloatOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(CashUpSafeFloatComponent);
