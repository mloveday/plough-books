import * as React from "react";
import {connect} from "react-redux";
import {AppState} from "../../../redux";
import {uiUpdate} from "../../../Redux/UI/UiRedux";
import {UiState} from "../../../Redux/UI/UiState";
import {DateFormats} from "../../../Util/DateFormats";
import {getTimePeriods} from "../../../Util/DateUtils";

interface RotaHeaderOwnProps {
  date: string;
}

interface RotaHeaderStateProps {
  uiState: UiState;
}

const mapStateToProps = (state: AppState, ownProps: RotaHeaderOwnProps): RotaHeaderStateProps => {
  return {
    uiState: state.uiState,
  }
};

interface RotaHeaderDispatchProps {
  updateUi: (state: UiState) => void;
}

const mapDispatchToProps = (dispatch: any, ownProps: RotaHeaderOwnProps): RotaHeaderDispatchProps => {
  return {
    updateUi: (state: UiState) => dispatch(uiUpdate(state)),
  };
};

type RotaHeaderProps = RotaHeaderOwnProps & RotaHeaderStateProps & RotaHeaderDispatchProps;

class RotaHeaderComponent extends React.Component<RotaHeaderProps, {}> {
  public render() {
    const timePeriods = getTimePeriods(this.props.date);
    return (
      <div className="rota-times">
        <div className="rota-header rota-staff-name">Name</div>
        <div className="rota-header rota-remove-shift"/>
        <div className="rota-header rota-off-floor"/>
        <div className="rota-header rota-start-time">Start</div>
        <div className="rota-header rota-end-time">End</div>
        <div className="rota-header rota-breaks">Breaks</div>
        <div className="rota-header rota-rate"><input type="checkbox" checked={this.props.uiState.rotaShowRates} onChange={ev => this.props.updateUi(this.props.uiState.withShouldShowRotaRates(ev.target.checked))}/>Rate</div>
        {timePeriods.map((timePeriod, timeKey) => (
          <div className="rota-time" key={timeKey}>{timePeriod.minutes() === 0 && timePeriod.format(DateFormats.TIME_NO_LEADING_ZERO)}</div>
        ))}
      </div>
    )
  }
}

export const RotaHeader = connect<RotaHeaderStateProps, RotaHeaderDispatchProps, RotaHeaderOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(RotaHeaderComponent);
