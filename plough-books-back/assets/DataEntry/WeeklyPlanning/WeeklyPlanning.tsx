import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {match} from "react-router";
import {ConstantsWithHover} from "../../DataVisualisation/Constants/ConstantsWithHover";
import {AppState} from "../../redux";
import {DateFormats} from "../../Util/DateFormats";
import {startOfWeek} from "../../Util/DateUtils";
import {validateCash} from "../../Util/Validation";
import {ConstantsExternalState} from "../Constants/State/ConstantsExternalState";
import {constantsFetch} from "../Constants/State/ConstantsRedux";
import {Constants} from "../Rota/State/Constants";
import {RotaEntity} from "../Rota/State/RotaEntity";
import {RotaExternalState} from "../Rota/State/RotaExternalState";
import {rotaDataEntry, rotaFetch, weeklyRotasCreate} from "../Rota/State/RotaRedux";
import {RotasForWeek} from "../Rota/State/RotasForWeek";
import './WeeklyPlanning.scss';

interface WeeklyPlanningOwnProps {
  match: match<{
    weekNumber: string,
    year: string,
  }>;
}

interface WeeklyPlanningStateProps {
  constantsExternalState: ConstantsExternalState,
  rotaExternalState: RotaExternalState,
  rotaLocalStates: RotasForWeek,
}

const mapStateToProps = (state: AppState, ownProps: WeeklyPlanningOwnProps): WeeklyPlanningStateProps => {
  return {
    constantsExternalState: state.constantsExternalState,
    rotaExternalState: state.rotaExternalState,
    rotaLocalStates: state.rotaLocalStates,
  }
};

interface WeeklyPlanningDispatchProps {
  fetchConstants: () => void,
  fetchRotas: (date: moment.Moment) => void,
  updateRotas: (rotas: RotaEntity[]) => void,
  weeklyOverviewCreate: (rotas: RotaEntity[]) => void,
}

const mapDispatchToProps = (dispatch: any, ownProps: WeeklyPlanningOwnProps): WeeklyPlanningDispatchProps => {
  return {
    fetchConstants: () => dispatch(constantsFetch()),
    fetchRotas: date => dispatch(rotaFetch(date)),
    updateRotas: rotas => dispatch(rotaDataEntry(rotas)),
    weeklyOverviewCreate: rotas  => dispatch(weeklyRotasCreate(rotas)),
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
        <div className="planning-form">
          <div className="planning-rota">
            <div className="planning-rota-item">Date</div>
            <div className="planning-rota-item">Forecast (£)</div>
            <div className="planning-rota-item">Labour (%)</div>
            <div className="planning-rota-item">Constants</div>
          </div>
          {Array.from(this.props.rotaLocalStates.rotas.values()).map((rota, rotaKey) => (
            <div className="planning-rota" key={rotaKey}>
              <div className="planning-rota-item">{rota.date.format(DateFormats.READABLE_NO_YEAR)} ({rota.status})</div>
              <input className="planning-rota-item" type='number' value={rota.forecastRevenue} onChange={ev => this.updateRota(rota.with({forecastRevenue: validateCash(ev.target.value, rota.forecastRevenue)}))} />
              <input className="planning-rota-item" type='number' value={rota.targetLabourRate * 100} onChange={ev => this.updateRota(rota.with({targetLabourRate: validateCash(ev.target.value, rota.targetLabourRate) / 100}))} />
              <ConstantsWithHover constants={rota.constants}>
              <select className="planning-rota-item" value={rota.constants.id} onChange={ev => this.updateRota(rota.with({constants: this.props.constantsExternalState.externalState.constants.find(constants => constants.id === Number(ev.target.value))}))}>
                {this.props.constantsExternalState.externalState.constants.map((constants, cKey) => (
                  <option key={cKey} value={constants.id}>{constants.date.format(DateFormats.READABLE_WITH_YEAR)}</option>
                ))}
              </select>
              </ConstantsWithHover>
            </div>
          ))}
        </div>
        <div>
          <div>Forecast revenue: £{this.props.rotaLocalStates.getTotalForecastRevenue()}</div>
          <div>Forecast labour rate: {(100*this.props.rotaLocalStates.getTargetLabourRateForWeek()).toFixed(2)}%</div>
        </div>
        <div><button type="button" onClick={() => this.saveRotas()}>Save</button></div>
        <div>
          <h3>TODO</h3>
          <div>Styling</div>
          <div>Date selector</div>
        </div>
      </div>
    )
  }

  private saveRotas() {
    this.props.weeklyOverviewCreate(Array.from(this.props.rotaLocalStates.rotas.values()));
  }

  private updateRota(updatedRota: RotaEntity) {
    this.props.updateRotas(Array.from(this.props.rotaLocalStates.rotas.values()).map(rota => rota.id === updatedRota.id ? updatedRota : rota.with({})));
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
    if (this.props.constantsExternalState.isLoaded() && this.props.rotaExternalState.isLoaded()) {
      Array.from(this.props.rotaLocalStates.rotas.values()).forEach(r => {
        if (!r.constants.id) {
          this.updateRota(r.with({constants: this.props.constantsExternalState.externalState.constants.length > 0 ? this.props.constantsExternalState.externalState.constants.slice(0,1)[0] : Constants.default()}));
          return;
        }
      });
    }
  }
}

export const WeeklyPlanning = connect<WeeklyPlanningStateProps, WeeklyPlanningDispatchProps, WeeklyPlanningOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(WeeklyPlanningComponent);