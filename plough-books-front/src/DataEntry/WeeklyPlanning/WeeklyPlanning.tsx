import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {match} from "react-router";
import {AppState} from "../../redux";
import {DateFormats} from "../../Util/DateFormats";
import {startOfWeek} from "../../Util/DateUtils";
import {RotaExternalState} from "../Rota/State/RotaExternalState";
import {rotaFetch} from "../Rota/State/RotaRedux";
import {RotasForWeek} from "../Rota/State/RotasForWeek";

interface WeeklyPlanningOwnProps {
  match: match<{
    weekNumber: string,
    year: string,
  }>;
}

interface WeeklyPlanningStateProps {
  rotaExternalState: RotaExternalState,
  rotasForWeek: RotasForWeek,
}

const mapStateToProps = (state: AppState, ownProps: WeeklyPlanningOwnProps): WeeklyPlanningStateProps => {
  return {
    rotaExternalState: state.rotaExternalState,
    rotasForWeek: state.rotaLocalStates,
  }
};

interface WeeklyPlanningDispatchProps {
  fetchRotas: (date: moment.Moment) => void,
}

const mapDispatchToProps = (dispatch: any, ownProps: WeeklyPlanningOwnProps): WeeklyPlanningDispatchProps => {
  return {
    fetchRotas: date => dispatch(rotaFetch(date))
  };
};

type WeeklyPlanningProps = WeeklyPlanningOwnProps & WeeklyPlanningStateProps & WeeklyPlanningDispatchProps;

class WeeklyPlanningComponent extends React.Component<WeeklyPlanningProps, {}> {
  public componentDidMount() {
    this.maintainState();
  }

  public componentDidUpdate() {
    this.maintainState();
  }

  public render() {
    return (
      <div>
        <h2>Weekly planning</h2>
        <div>
          {Array.from(this.props.rotasForWeek.rotas.values()).map((rota, rotaKey) => (
            <div key={rotaKey}>
              <div>{rota.date.format(DateFormats.READABLE_NO_YEAR)}</div>
              <div>{rota.forecastRevenue}</div>
              <div>{rota.targetLabourRate}</div>
              <div>{rota.constants.date.format(DateFormats.READABLE_WITH_YEAR)}</div>
              <div>{rota.status}</div>
            </div>
          ))}
        </div>
        <div>
          <h3>TODO</h3>
          <div>Edit data</div>
          <div>Save data in one call</div>
          <div>Styling</div>
          <div>Date selector</div>
        </div>
      </div>
    )
  }

  private maintainState() {
    const date = startOfWeek(Number(this.props.match.params.year), Number(this.props.match.params.weekNumber));
    if (this.props.rotaExternalState.shouldLoadForDate(date)) {
      this.props.fetchRotas(date);
    }
  }
}

export const WeeklyPlanning = connect<WeeklyPlanningStateProps, WeeklyPlanningDispatchProps, WeeklyPlanningOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(WeeklyPlanningComponent);