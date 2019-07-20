import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as React from "react";
import {connect} from "react-redux";
import {CashUpEntity} from "../../../Model/CashUp/CashUpEntity";
import {CashUpEntityUpdateType} from "../../../Model/CashUp/CashUpEntityTypes";
import {Skim} from "../../../Model/Skim/Skim";
import {AppState} from "../../../redux";
import {positiveCurrencyPattern} from "../../../Util/Validation";

interface CashUpSkimsOwnProps {
  cashUp: CashUpEntity;
  formUpdate: (obj: CashUpEntityUpdateType) => void;
}

interface CashUpSkimsStateProps {
}

const mapStateToProps = (state: AppState, ownProps: CashUpSkimsOwnProps): CashUpSkimsStateProps => {
  return {}
};

interface CashUpSkimsDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: CashUpSkimsOwnProps): CashUpSkimsDispatchProps => {
  return {};
};

type CashUpSkimsProps = CashUpSkimsOwnProps & CashUpSkimsStateProps & CashUpSkimsDispatchProps;

class CashUpSkimsComponent extends React.Component<CashUpSkimsProps, {}> {
  public render() {
    return (
      <div className="form-group skims">
        <h3 className="group-title skims_label">Skim</h3>
        <button className='skim_add_button' type='button' onClick={ev => {
          this.props.formUpdate({
            skims: this.props.cashUp.skims
              .map(r => r.clone())
              .concat([Skim.default()])
          });
        }}>+
        </button>
        {this.props.cashUp.skims.map(skim => this.skimInput(skim))}
      </div>
    )
  }

  private skimInput(skim: Skim) {
    const identifier = skim.id ? skim.id : skim.timestamp;
    return (
      <div className={`skim`} key={identifier}>
        <button className={`delete-item`} onClick={() => this.deleteSkim(skim)}>
          <FontAwesomeIcon icon="trash"/>
        </button>
        <div className="label-and-input skim_amnt">
          <label htmlFor={`skim_amnt_${identifier}`}>Amount</label>
          <input id={`skim_amnt_${identifier}`} type="text" pattern={positiveCurrencyPattern}
                 value={skim.inputs.amount}
                 onChange={ev => this.updateSkim(skim.with({amount: ev.target.value}))}/>
        </div>
        <div className="label-and-input skim_initials">
          <label htmlFor={`skim_initials_${identifier}`}>Initials</label>
          <input id={`skim_initials_${identifier}`} type="text"
                 value={skim.inputs.initials}
                 onChange={ev => this.updateSkim(skim.with({initials: ev.target.value}))}/>
        </div>
        <div className="label-and-input skim_witness">
          <label htmlFor={`skim_witness_${identifier}`}>Witness initials</label>
          <input id={`skim_witness_${identifier}`} type="text"
                 value={skim.inputs.witness}
                 onChange={ev => this.updateSkim(skim.with({witness: ev.target.value}))}/>
        </div>
      </div>
    )
  }

  private updateSkim(skim: Skim) {
    const clonedSkims = this.props.cashUp.skims
      .map(existingSkim => (skim.id ? (existingSkim.id === skim.id) : existingSkim.timestamp === skim.timestamp) ? skim : existingSkim.clone());
    this.props.formUpdate({skims: clonedSkims});
  }

  private deleteSkim(skim: Skim) {
    const clonedSkims = this.props.cashUp.skims
      .filter(existingSkim => (skim.id ? (existingSkim.id !== skim.id) : existingSkim.timestamp !== skim.timestamp));
    this.props.formUpdate({skims: clonedSkims});
  }
}

export const CashUpSkims = connect<CashUpSkimsStateProps, CashUpSkimsDispatchProps, CashUpSkimsOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(CashUpSkimsComponent);
