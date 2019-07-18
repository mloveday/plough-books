import * as React from "react";
import {connect} from "react-redux";
import {SafeFloatDenominations} from "../../../Model/Denominations/SafeFloatDenominations";
import {AppState} from "../../../redux";
import {currencyPattern} from "../../../Util/Validation";

interface SafeFloatDenomOwnProps {
  cashUpPropName: string;
  safeFloatObj: SafeFloatDenominations;
  totalFloatInTills: number;
  formUpdate: (obj: {}) => void;
  friendlyTimeName: string;
}

interface SafeFloatDenomStateProps {
}

const mapStateToProps = (state: AppState, ownProps: SafeFloatDenomOwnProps): SafeFloatDenomStateProps => {
  return {}
};

interface SafeFloatDenomDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: SafeFloatDenomOwnProps): SafeFloatDenomDispatchProps => {
  return {};
};

type SafeFloatDenomProps = SafeFloatDenomOwnProps & SafeFloatDenomStateProps & SafeFloatDenomDispatchProps;

class SafeFloatDenomComponent extends React.Component<SafeFloatDenomProps, {}> {
  public render() {
    return (
      <div className={"safe_float_"+this.props.friendlyTimeName.toLowerCase()}>
        <h4 className="group-label">{this.props.friendlyTimeName}</h4>
        {this.sfdInput('fiftyPounds', '£50')}
        {this.sfdInput('twentyPounds', '£20')}
        {this.sfdInput('tenPounds', '£10')}
        {this.sfdInput('fivePounds', '£5')}
        {this.sfdInput('pounds', '£1 & £2')}
        {this.sfdInput('fiftyPence', '50p')}
        {this.sfdInput('twentyPence', '20p')}
        {this.sfdInput('tenPence', '10p')}
        {this.sfdInput('fivePence', '5p')}
        <div className="label-and-input">
          <label htmlFor={"sfd_"+this.props.friendlyTimeName.toLowerCase()+"_initial"}>Initial</label>
          <input id={"sfd_"+this.props.friendlyTimeName.toLowerCase()+"_initial"} type="text" pattern={"\\w+"}
                 value={this.props.safeFloatObj.initials}
                 onChange={ev => this.props.formUpdate({[this.props.cashUpPropName]: this.props.safeFloatObj.with({initials: ev.target.value})})} />
        </div>
        <div className="label-and-input">
          <label htmlFor={`sfd_total_safe_${this.props.cashUpPropName}`}>Total in safe</label>
          <input disabled={true} id={`sfd_total_safe_${this.props.cashUpPropName}`} type="text" pattern={currencyPattern}
                 value={this.props.safeFloatObj.getTotal()} />
        </div>
        <div className="label-and-input">
          <label htmlFor={`sfd_total_tills_${this.props.cashUpPropName}`}>Total in tills</label>
          <input disabled={true} id={`sfd_total_tills_${this.props.cashUpPropName}`} type="text" pattern={currencyPattern}
                 value={this.props.totalFloatInTills} />
        </div>
        <div className="label-and-input">
          <label htmlFor={`sfd_total_${this.props.cashUpPropName}`}>Total float</label>
          <input disabled={true} id={`sfd_total_${this.props.cashUpPropName}`} type="text" pattern={currencyPattern}
                 value={this.props.safeFloatObj.getTotal() + this.props.totalFloatInTills} />
        </div>
      </div>
    )
  }

  private sfdInput(property: string, friendlyName: string) {
    const id = this.props.cashUpPropName + '_' + property;
    return <div className="label-and-input">
      <label htmlFor={id}>{friendlyName}</label>
      <input id={id} type="text" pattern={currencyPattern}
             value={this.props.safeFloatObj.inputs[property]}
             onChange={ev => this.props.formUpdate({[this.props.cashUpPropName]: this.props.safeFloatObj.with({[property]: ev.target.value})})} />
    </div>
  }
}

export const SafeFloatDenom = connect<SafeFloatDenomStateProps, SafeFloatDenomDispatchProps, SafeFloatDenomOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(SafeFloatDenomComponent);
