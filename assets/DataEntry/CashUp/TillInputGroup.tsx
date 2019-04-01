import * as React from "react";
import {connect} from "react-redux";
import {AppState} from "../../redux";
import {currencyPattern} from "../../Util/Validation";
import {ICashUpEntityUpdateObject} from "./State/CashUpEntity";
import {TillDenominations} from "./State/Denominations/TillDenominations";

interface TillInputGroupOwnProps {
  tills: TillDenominations[];
  tillProperty: string;
  friendlyName: string;
  formUpdate: (obj: ICashUpEntityUpdateObject) => void;
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
      </div>
    )
  }

  private tillInput(index: number) {
    const id = this.props.tillProperty+'_'+index;
    return (
      <div className="till-label-and-input" key={index}>
        <label htmlFor={id}>{this.props.friendlyName} {index+1}</label>
        <input id={id} type="tel" pattern={currencyPattern}
               value={this.props.tills[index].inputs[this.props.tillProperty]}
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
