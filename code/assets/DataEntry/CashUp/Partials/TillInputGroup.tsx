import * as React from "react";
import {connect} from "react-redux";
import {CashUpEntityUpdateType} from "../../../Model/CashUp/CashUpEntityTypes";
import {TillDenominations} from "../../../Model/Denominations/TillDenominations";
import {AppState} from "../../../redux";
import {Formatting} from "../../../Util/Formatting";
import {currencyPattern} from "../../../Util/Validation";
import {TillRefInputs, TillRefProperty} from "./CashUpTills";

interface TillInputGroupOwnProps {
  tills: TillDenominations[];
  tillRefs: TillRefInputs[];
  keyPressHandler: (ev: React.KeyboardEvent<HTMLInputElement>, tillIndex: number, tillProperty: string) => void;
  tillProperty: TillRefProperty;
  friendlyName: string;
  formUpdate: (obj: CashUpEntityUpdateType) => void;
  groupIdentifier: string;
}

interface TillInputGroupStateProps {
}

const mapStateToProps = (state: AppState, ownProps: TillInputGroupOwnProps): TillInputGroupStateProps => {
  return {}
};

interface TillInputGroupDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: TillInputGroupOwnProps): TillInputGroupDispatchProps => {
  return {};
};

type TillInputGroupProps = TillInputGroupOwnProps & TillInputGroupStateProps & TillInputGroupDispatchProps;

class TillInputGroupComponent extends React.Component<TillInputGroupProps, {}> {
  public render() {
    const tills = [0,1,2,3,4,5,6];
    return (
      <div className={`per-till ${this.props.groupIdentifier}`}>
        {tills.map(index => this.tillInput(index))}

        <div className="till-total">
          <div>{Formatting.formatCashForDisplay(tills.reduce((prev, curr) => prev + this.props.tills[curr][this.props.tillProperty],0))}</div>
        </div>
      </div>
    )
  }

  private tillInput(index: number) {
    const id = this.props.tillProperty+'_'+index;
    return (
      <div className="till-label-and-input" key={index}>
        <label htmlFor={id}>{this.props.friendlyName} {index+1}</label>
        <input id={id} type="tel" pattern={currencyPattern} ref={this.props.tillRefs[index][this.props.tillProperty]}
               value={this.props.tills[index].inputs[this.props.tillProperty]}
               onKeyDown={ev => this.props.keyPressHandler(ev, index, this.props.tillProperty)}
               onChange={ev => this.updateTill(index, this.props.tills[index].with({[this.props.tillProperty]: ev.target.value}))}/>
      </div>
    );
  }

  private updateTill(tillNo: number, denoms: TillDenominations) {
    this.props.formUpdate({
      tills: this.props.tills.map((till, index) => index === tillNo ? denoms : till.clone())
    });
  }
}

export const TillInputGroup = connect<TillInputGroupStateProps, TillInputGroupDispatchProps, TillInputGroupOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(TillInputGroupComponent);
