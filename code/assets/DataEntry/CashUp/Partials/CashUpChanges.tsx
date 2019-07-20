import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as React from "react";
import {connect} from "react-redux";
import {CashUpEntity} from "../../../Model/CashUp/CashUpEntity";
import {CashUpEntityUpdateType} from "../../../Model/CashUp/CashUpEntityTypes";
import {Change} from "../../../Model/Change/Change";
import {AppState} from "../../../redux";
import {positiveCurrencyPattern} from "../../../Util/Validation";

interface CashUpChangesOwnProps {
  cashUp: CashUpEntity;
  formUpdate: (obj: CashUpEntityUpdateType) => void;
}

interface CashUpChangesStateProps {
}

const mapStateToProps = (state: AppState, ownProps: CashUpChangesOwnProps): CashUpChangesStateProps => {
  return {}
};

interface CashUpChangesDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: CashUpChangesOwnProps): CashUpChangesDispatchProps => {
  return {};
};

type CashUpChangesProps = CashUpChangesOwnProps & CashUpChangesStateProps & CashUpChangesDispatchProps;

class CashUpChangesComponent extends React.Component<CashUpChangesProps, {}> {
  public render() {
    return (
      <div className="form-group changes">
        <h3 className="group-title changes_label">Change</h3>
        <button className='change_add_button' type='button' onClick={ev => {
          this.props.formUpdate({
            changes: this.props.cashUp.changes
              .map(r => r.clone())
              .concat([Change.default()])
          });
        }}>+
        </button>
        {this.props.cashUp.changes.map(change => this.changeInput(change))}
      </div>
    )
  }

  private changeInput(change: Change) {
    const identifier = change.id ? change.id : change.timestamp;
    return (
      <div className={`change`} key={identifier}>
        <button className={`delete-item`} onClick={() => this.deleteChange(change)}>
          <FontAwesomeIcon icon="trash"/>
        </button>
        <div className="label-and-input change_amnt">
          <label htmlFor={`change_amnt_${identifier}`}>Amount</label>
          <input id={`change_amnt_${identifier}`} type="text" pattern={positiveCurrencyPattern}
                 value={change.inputs.amount}
                 onChange={ev => this.updateChange(change.with({amount: ev.target.value}))}/>
        </div>
        <div className="label-and-input change_initials">
          <label htmlFor={`change_initials_${identifier}`}>Initials</label>
          <input id={`change_initials_${identifier}`} type="text"
                 value={change.inputs.initials}
                 onChange={ev => this.updateChange(change.with({initials: ev.target.value}))}/>
        </div>
        <div className="label-and-input change_witness">
          <label htmlFor={`change_witness_${identifier}`}>Witness initials</label>
          <input id={`change_witness_${identifier}`} type="text"
                 value={change.inputs.witness}
                 onChange={ev => this.updateChange(change.with({witness: ev.target.value}))}/>
        </div>
      </div>
    )
  }

  private updateChange(change: Change) {
    const clonedChanges = this.props.cashUp.changes
      .map(existingChange => (change.id ? (existingChange.id === change.id) : existingChange.timestamp === change.timestamp) ? change : existingChange.clone());
    this.props.formUpdate({changes: clonedChanges});
  }

  private deleteChange(change: Change) {
    const clonedChanges = this.props.cashUp.changes
      .filter(existingChange => (change.id ? (existingChange.id !== change.id) : existingChange.timestamp !== change.timestamp));
    this.props.formUpdate({changes: clonedChanges});
  }
}

export const CashUpChanges = connect<CashUpChangesStateProps, CashUpChangesDispatchProps, CashUpChangesOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(CashUpChangesComponent);
