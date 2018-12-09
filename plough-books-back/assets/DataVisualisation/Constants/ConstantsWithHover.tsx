import * as React from "react";
import {connect} from "react-redux";
import {Constants} from "../../DataEntry/Rota/State/Constants";
import {AppState} from "../../redux";
import {DateFormats} from "../../Util/DateFormats";
import './Constants.scss';

interface ConstantsWithHoverOwnProps {
  constants: Constants,
}

interface ConstantsWithHoverStateProps {
}

const mapStateToProps = (state: AppState, ownProps: ConstantsWithHoverOwnProps): ConstantsWithHoverStateProps => {
  return {}
};

interface ConstantsWithHoverDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: ConstantsWithHoverOwnProps): ConstantsWithHoverDispatchProps => {
  return {};
};

type ConstantsWithHoverProps = ConstantsWithHoverOwnProps & ConstantsWithHoverStateProps & ConstantsWithHoverDispatchProps;

class ConstantsWithHoverComponent extends React.Component<ConstantsWithHoverProps, {}> {
  public render() {
    return (
      <div>
        <div className="constants-identifier">
          {this.props.children ? this.props.children : this.props.constants.date.format(DateFormats.DMY_SLASHES)}
        </div>
        <div className="constants-hover">
          <div>Created: {this.props.constants.date.format(DateFormats.DMY_SLASHES)}</div>
          <div>Fixed costs: £{this.props.constants.fixedCosts}</div>
          <div>Labour rate: {(100*this.props.constants.labourRate).toFixed(2)}%</div>
          <div>VAT multiplier: {(100*this.props.constants.vatMultiplier).toFixed(2)}%</div>
          <div>Bar proportion: {(100*this.props.constants.barProportionOfRevenue).toFixed(2)}%</div>
          <div>Hrs per short break: {this.props.constants.hoursPerShortBreak} hours</div>
          <div>Short break duration: {this.props.constants.shortBreakDuration} hours</div>
          <div>Hrs per long break: {this.props.constants.hoursPerLongBreak} hours</div>
          <div>Long break duration: {this.props.constants.longBreakDuration} hours</div>
          <div>ERS threshold: £{this.props.constants.ersThreshold}</div>
          <div>ERS rate above threshold: {(100*this.props.constants.ersPercentAboveThreshold).toFixed(2)}%</div>
          <div>Holiday rate: {(100*this.props.constants.holidayLinearPercent).toFixed(2)}%</div>
          <div>Pension rate: {(100*this.props.constants.pensionLinearPercent).toFixed(2)}%</div>
        </div>
      </div>
    )
  }
}

export const ConstantsWithHover = connect<ConstantsWithHoverStateProps, ConstantsWithHoverDispatchProps, ConstantsWithHoverOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(ConstantsWithHoverComponent);