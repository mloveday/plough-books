import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {match} from "react-router";
import {ConstantsWithHover} from "../../DataVisualisation/Constants/ConstantsWithHover";
import {WeekPicker} from "../../Nav/WeekPicker";
import {AppState} from "../../redux";
import {Routes} from "../../Routing/Routes";
import {DateFormats} from "../../Util/DateFormats";
import {startOfWeek} from "../../Util/DateUtils";
import {Formatting} from "../../Util/Formatting";
import {validateCash} from "../../Util/Validation";
import {CashUpExternalState} from "../CashUp/State/CashUpExternalState";
import {cashUpFetchWithPrevious} from "../CashUp/State/CashUpRedux";
import {ConstantsExternalState} from "../Constants/State/ConstantsExternalState";
import {constantsFetch} from "../Constants/State/ConstantsRedux";
import {Constants} from "../Rota/State/Constants";
import {RotaEntity} from "../Rota/State/RotaEntity";
import {RotaExternalState} from "../Rota/State/RotaExternalState";
import {rotaDataEntry, rotaFetchWithPrevious, weeklyRotasCreate} from "../Rota/State/RotaRedux";
import {RotasForWeek} from "../Rota/State/RotasForWeek";
import {PriorWeekOverview} from "./PriorWeekOverview";
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
  cashUpExternalState: CashUpExternalState,
  rotaLocalStates: RotasForWeek,
}

const mapStateToProps = (state: AppState, ownProps: WeeklyPlanningOwnProps): WeeklyPlanningStateProps => {
  return {
    constantsExternalState: state.constantsExternalState,
    rotaExternalState: state.rotaExternalState,
    cashUpExternalState: state.cashUpExternalState,
    rotaLocalStates: state.rotaLocalStates,
  }
};

interface WeeklyPlanningDispatchProps {
  fetchConstants: () => void,
  fetchRotas: (date: moment.Moment) => void,
  fetchCashUps: (date: moment.Moment) => void,
  updateRotas: (rotas: RotaEntity[]) => void,
  weeklyOverviewCreate: (rotas: RotaEntity[]) => void,
}

const mapDispatchToProps = (dispatch: any, ownProps: WeeklyPlanningOwnProps): WeeklyPlanningDispatchProps => {
  return {
    fetchConstants: () => dispatch(constantsFetch()),
    fetchRotas: date => dispatch(rotaFetchWithPrevious(date)),
    fetchCashUps: date => dispatch(cashUpFetchWithPrevious(date)),
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
    const startOfTheWeek = startOfWeek(Number(this.props.match.params.year), Number(this.props.match.params.weekNumber));
    return (
      <div className="weekly-planning-data-entry">
        <WeekPicker week={parseInt(this.props.match.params.weekNumber, 10)}
                    year={parseInt(this.props.match.params.year, 10)}
                    urlFromDate={date => Routes.weeklyPlanningUrl(date)}/>
        <h2>Weekly planning</h2>
        <div className="planning-form">
          <div className="planning-rota">
            <div className="planning-rota-item">Date</div>
            <div className="planning-rota-item">Forecast (£)</div>
            <div className="planning-rota-item">Labour (%)</div>
            <div className="planning-rota-item">Constants</div>
          </div>
          {this.props.rotaLocalStates.getRotasForWeek(startOfTheWeek).map((rota, rotaKey) => (
            <div className="planning-rota" key={rotaKey}>
              <div className="planning-rota-item">{rota.date.format(DateFormats.READABLE_NO_YEAR)} ({rota.getReadableStatus()})</div>
              <input className="planning-rota-item" type='number' value={rota.forecastRevenue} onChange={ev => this.updateRota(rota.with({forecastRevenue: validateCash(ev.target.value, rota.forecastRevenue)}))} />
              <input className="planning-rota-item" type='number' value={rota.targetLabourRate * 100} onChange={ev => this.updateRota(rota.with({targetLabourRate: validateCash(ev.target.value, rota.targetLabourRate) / 100}))} />
              <ConstantsWithHover constants={rota.constants}>
              <select className="planning-rota-item" value={rota.constants.id} onChange={ev => this.updateRota(rota.with({constants: this.props.constantsExternalState.externalState.entities.find(constants => constants.id === Number(ev.target.value))}))}>
                {this.props.constantsExternalState.externalState.entities.map((constants, cKey) => (
                  <option key={cKey} value={constants.id}>{constants.date.format(DateFormats.READABLE_WITH_YEAR)}</option>
                ))}
              </select>
              </ConstantsWithHover>
            </div>
          ))}
          <div>
            <div>Forecast revenue: {Formatting.formatCash(this.props.rotaLocalStates.getTotalForecastRevenue(startOfTheWeek))}</div>
            <div>Forecast labour rate: {Formatting.formatPercent(this.props.rotaLocalStates.getTargetLabourRateForWeek(startOfTheWeek))}</div>
          </div>
          <div><button type="button" onClick={() => this.saveRotas()}>Save</button></div>
          <PriorWeekOverview dayInPriorWeek={startOfTheWeek.clone().subtract(1, "year")} title={`Last year`} />
          {[1,2,3,4].map(weeksAgo =>
            <PriorWeekOverview key={weeksAgo} dayInPriorWeek={startOfTheWeek.clone().subtract(weeksAgo, "week")} title={`${weeksAgo} ${weeksAgo === 1 ? 'Week' : 'Weeks'} Ago`} />
          )}
        </div>
      </div>
    )
  }

  private saveRotas() {
    const startOfTheWeek = startOfWeek(Number(this.props.match.params.year), Number(this.props.match.params.weekNumber));
    this.props.weeklyOverviewCreate(this.props.rotaLocalStates.getRotasForWeek(startOfTheWeek));
  }

  private updateRota(updatedRota: RotaEntity) {
    this.props.updateRotas([updatedRota]);
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
    if (this.props.cashUpExternalState.shouldLoadForDate(date)) {
      this.props.fetchCashUps(date);
      return;
    }
    if (this.props.constantsExternalState.isLoaded() && this.props.rotaExternalState.isLoaded()) {
      this.props.rotaLocalStates.getRotasForWeek(date).forEach(r => {
        if (!r.constants.id) {
          this.updateRota(r.with({constants: this.props.constantsExternalState.externalState.entities.length > 0 ? this.props.constantsExternalState.externalState.entities.slice(0,1)[0] : Constants.default()}));
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