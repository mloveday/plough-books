import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {match} from "react-router";
import {AppState} from "../../redux";
import {DateFormats} from "../../Util/DateFormats";
import {startOfWeek} from "../../Util/DateUtils";
import {validateCash} from "../../Util/Validation";
import {ConstantsExternalState} from "../Constants/State/ConstantsExternalState";
import {constantsFetch} from "../Constants/State/ConstantsRedux";
import {RotaEntity} from "../Rota/State/RotaEntity";
import {RotaExternalState} from "../Rota/State/RotaExternalState";
import {rotaDataEntry, rotaFetch} from "../Rota/State/RotaRedux";
import {RotasForWeek} from "../Rota/State/RotasForWeek";

interface WeeklyPlanningOwnProps {
  match: match<{
    weekNumber: string,
    year: string,
  }>;
}

interface WeeklyPlanningStateProps {
  constantsExternalState: ConstantsExternalState,
  rotaExternalState: RotaExternalState,
  rotasForWeek: RotasForWeek,
}

const mapStateToProps = (state: AppState, ownProps: WeeklyPlanningOwnProps): WeeklyPlanningStateProps => {
  return {
    constantsExternalState: state.constantsExternalState,
    rotaExternalState: state.rotaExternalState,
    rotasForWeek: state.rotaLocalStates,
  }
};

interface WeeklyPlanningDispatchProps {
  fetchConstants: () => void,
  fetchRotas: (date: moment.Moment) => void,
  updateRotas: (rotas: RotaEntity[]) => void,
}

const mapDispatchToProps = (dispatch: any, ownProps: WeeklyPlanningOwnProps): WeeklyPlanningDispatchProps => {
  return {
    fetchConstants: () => dispatch(constantsFetch()),
    fetchRotas: date => dispatch(rotaFetch(date)),
    updateRotas: rotas => dispatch(rotaDataEntry(rotas)),
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
              <div>{rota.date.format(DateFormats.READABLE_NO_YEAR)} ({rota.status})</div>
              <input type='number' value={rota.forecastRevenue} onChange={ev => this.updateRota(rota.with({forecastRevenue: validateCash(ev.target.value, rota.forecastRevenue)}))} />
              <input type='number' value={rota.targetLabourRate * 100} onChange={ev => this.updateRota(rota.with({targetLabourRate: validateCash(ev.target.value, rota.targetLabourRate) / 100}))} />
              <select value={rota.constants.id} onChange={ev => this.updateRota(rota.with({constants: this.props.constantsExternalState.externalState.constants.find(constants => constants.id === Number(ev.target.value))}))}>
                {this.props.constantsExternalState.externalState.constants.map((constants, cKey) => (
                  <option key={cKey} value={constants.id}>{constants.date.format(DateFormats.READABLE_WITH_YEAR)}</option>
                ))}
              </select>
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

  private updateRota(updatedRota: RotaEntity) {
    this.props.updateRotas(Array.from(this.props.rotasForWeek.rotas.values()).map(rota => rota.id === updatedRota.id ? updatedRota : rota.with({})));
  }

  private maintainState() {
    if (this.props.constantsExternalState.isEmpty()) {
      this.props.fetchConstants();
      return;
    }
    const date = startOfWeek(Number(this.props.match.params.year), Number(this.props.match.params.weekNumber));
    if (this.props.rotaExternalState.shouldLoadForDate(date)) {
      this.props.fetchRotas(date);
      return;
    }
  }
}

export const WeeklyPlanning = connect<WeeklyPlanningStateProps, WeeklyPlanningDispatchProps, WeeklyPlanningOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(WeeklyPlanningComponent);