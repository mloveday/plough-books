import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {Constants} from "../../Model/Constants/Constants";
import {AppState} from "../../redux";
import {DateFormats} from "../../Util/DateFormats";
import {momentFromDate} from "../../Util/DateUtils";
import {Formatting} from "../../Util/Formatting";
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
          {this.props.children ? this.props.children : momentFromDate(this.props.constants.date).format(DateFormats.DMY_SLASHES)}
        </div>
        <div className="constants-hover">
          <div>Created: {moment.utc(this.props.constants.date).format(DateFormats.DMY_SLASHES)}</div>
          <div>Fixed costs: {Formatting.formatCashForDisplay(this.props.constants.fixedCosts)}</div>
          <div>Labour rate: {Formatting.formatPercent(this.props.constants.labourRate)}</div>
          <div>VAT multiplier: {Formatting.formatPercent(this.props.constants.vatMultiplier)}</div>
          <div>Bar proportion: {Formatting.formatPercent(this.props.constants.barProportionOfRevenue)}</div>
          <div>Hrs per short break: {this.props.constants.hoursPerShortBreak} hours</div>
          <div>Short break duration: {this.props.constants.shortBreakDuration} hours</div>
          <div>Hrs per long break: {this.props.constants.hoursPerLongBreak} hours</div>
          <div>Long break duration: {this.props.constants.longBreakDuration} hours</div>
          <div>ERS threshold: {Formatting.formatCashForDisplay(this.props.constants.ersThreshold)}</div>
          <div>ERS rate above threshold: {Formatting.formatPercent(this.props.constants.ersPercentAboveThreshold)}</div>
          <div>Holiday rate: {Formatting.formatPercent(this.props.constants.holidayLinearPercent)}</div>
          <div>Pension rate: {Formatting.formatPercent(this.props.constants.pensionLinearPercent)}</div>
        </div>
      </div>
    )
  }
}

export const ConstantsWithHover = connect<ConstantsWithHoverStateProps, ConstantsWithHoverDispatchProps, ConstantsWithHoverOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(ConstantsWithHoverComponent);