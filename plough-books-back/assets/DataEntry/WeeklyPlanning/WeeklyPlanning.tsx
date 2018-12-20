import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {match} from "react-router";
import {ConstantsWithHover} from "../../DataVisualisation/Constants/ConstantsWithHover";
import {DailyOverviews} from "../../DataVisualisation/WeeklyOverview/State/DailyOverviews";
import {WorkTypes} from "../../Enum/WorkTypes";
import {WeekPicker} from "../../Nav/WeekPicker";
import {AppState} from "../../redux";
import {Routes} from "../../Routing/Routes";
import {DateFormats} from "../../Util/DateFormats";
import {startOfWeek} from "../../Util/DateUtils";
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
              <div className="planning-rota-item">{rota.date.format(DateFormats.READABLE_NO_YEAR)} ({rota.status})</div>
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
            <div>Forecast revenue: £{this.props.rotaLocalStates.getTotalForecastRevenue(startOfTheWeek)}</div>
            <div>Forecast labour rate: {(100*this.props.rotaLocalStates.getTargetLabourRateForWeek(startOfTheWeek)).toFixed(2)}%</div>
          </div>
          <div><button type="button" onClick={() => this.saveRotas()}>Save</button></div>
          {this.renderWeekOverview(startOfTheWeek.clone().subtract(1, "year"), `Last year`)}
          {[1,2,3,4].map(weeksAgo => this.renderWeekOverview(startOfTheWeek.clone().subtract(weeksAgo, "week"), `${weeksAgo} ${weeksAgo === 1 ? 'Week' : 'Weeks'} Ago`))}
        </div>
      </div>
    )
  }

  private renderWeekOverview(dayInPriorWeek: moment.Moment, title: string) {
    if (!this.props.rotaExternalState.isLoaded() && !this.props.cashUpExternalState.isLoaded()) {
      return null;
    }
    const startOfPriorWeek = dayInPriorWeek.clone().startOf('isoWeek');
    const dailyOverviews = new DailyOverviews(startOfPriorWeek, this.props.rotaExternalState.rotasForWeek, this.props.cashUpExternalState.cashUpsForWeek);
    return (
      <div key={startOfPriorWeek.format(DateFormats.API)}>
        <div>{title}</div>
        <div className="weekly-overview">
          <div className="overview-stats">
            <div className="overview-stat">Forecast Bar costs: £{dailyOverviews.forecastBarLabour.toFixed(2)}</div>
            <div className="overview-stat">Actual Bar costs: £{dailyOverviews.actualBarLabour.toFixed(2)}</div>
            <div className="overview-stat">Forecast Kitchen costs: £{dailyOverviews.forecastKitchenLabour.toFixed(2)}</div>
            <div className="overview-stat">Actual Kitchen costs: £{dailyOverviews.actualKitchenLabour.toFixed(2)}</div>
          </div>
          <div className="overview-stats">
            <div className="overview-stat">Forecast combined costs: £{dailyOverviews.getForecastLabour().toFixed(2)}</div>
            <div className="overview-stat">Actual combined costs: £{dailyOverviews.getForecastLabour().toFixed(2)}</div>
          </div>
          <div className="overview-stats">
            <div className="overview-stat">Total forecast revenue: £{dailyOverviews.forecastRevenue.toFixed(2)}</div>
            <div className="overview-stat">Total actual revenue: £{dailyOverviews.actualRevenue.toFixed(2)}</div>
          </div>
          <div className="overview-stats">
            <div className="overview-stat">Target forecast labour rate: {(100*this.props.rotaLocalStates.getTargetLabourRateForWeek(startOfPriorWeek)).toFixed(2)}%</div>
            <div className="overview-stat">Combined forecast labour rate: {(100*dailyOverviews.getCombinedForecastLabourRate()).toFixed(2)}%</div>
            <div className="overview-stat">Combined actual labour rate: {(100*dailyOverviews.getCombinedActualLabourRate()).toFixed(2)}%</div>
          </div>
          <div className="overview-rota-group">
            <div className="overview-stat-title">Date</div>
            {dailyOverviews.overviews.map((overview, key) => (
              <div className="overview-stat" key={key}>{overview.date.format(DateFormats.READABLE_NO_YEAR)}</div>
            ))}
            <div className="overview-stat-title">Notes</div>
            {dailyOverviews.overviews.map((overview, key) => (
              <div className="overview-stat notes" key={key}>{overview.cashUp.dailyNotes.toUpperCase()}</div>
            ))}
          </div>
          <div className="overview-rota-group">
            <div className="overview-stat-title">Forecast revenue</div>
            {dailyOverviews.overviews.map((overview, key) => (
              <div className="overview-stat" key={key}>£{overview.rota.forecastRevenue.toFixed(2)}</div>
            ))}
            <div className="overview-stat-title">Actual revenue</div>
            {dailyOverviews.overviews.map((overview, key) => (
              <div className="overview-stat" key={key}>£{overview.cashUp.getTotalRevenue().toFixed(2)}</div>
            ))}
          </div>
          <div className="overview-rota-group">
            <div className="overview-stat-title">Predicted Bar wage cost</div>
            {dailyOverviews.overviews.map((overview, key) => (
              <div className="overview-stat" key={key}>£{overview.rota.getTotalPredictedLabourCost(dailyOverviews.forecastRevenue, WorkTypes.BAR).toFixed(2)}</div>
            ))}
            <div className="overview-stat-title">Actual Bar wage cost</div>
            {dailyOverviews.overviews.map((overview, key) => (
              <div className="overview-stat" key={key}>£{overview.rota.getTotalActualLabourCost(overview.cashUp.getTotalRevenue(), dailyOverviews.actualRevenue, WorkTypes.BAR).toFixed(2)}</div>
            ))}
            <div className="overview-stat-title">Predicted Kitchen wage cost</div>
            {dailyOverviews.overviews.map((overview, key) => (
              <div className="overview-stat" key={key}>£{overview.rota.getTotalPredictedLabourCost(dailyOverviews.forecastRevenue, WorkTypes.KITCHEN).toFixed(2)}</div>
            ))}
            <div className="overview-stat-title">Actual Kitchen wage cost</div>
            {dailyOverviews.overviews.map((overview, key) => (
              <div className="overview-stat" key={key}>£{overview.rota.getTotalActualLabourCost(overview.cashUp.getTotalRevenue(), dailyOverviews.actualRevenue, WorkTypes.KITCHEN).toFixed(2)}</div>
            ))}
          </div>
          <div className="overview-rota-group">
            <div className="overview-stat-title">Target labour rate</div>
            {dailyOverviews.overviews.map((overview, key) => (
              <div className="overview-stat" key={key}>{(overview.rota.targetLabourRate * 100).toFixed(2)}%</div>
            ))}
            <div className="overview-stat-title">Predicted Bar labour rate</div>
            {dailyOverviews.overviews.map((overview, key) => (
              <div className="overview-stat" key={key}>{(overview.rota.getPredictedLabourRate(dailyOverviews.forecastRevenue, WorkTypes.BAR) * 100).toFixed(2)}%</div>
            ))}
            <div className="overview-stat-title">Actual Bar labour rate</div>
            {dailyOverviews.overviews.map((overview, key) => (
              <div className="overview-stat" key={key}>{(overview.rota.getActualLabourRate(overview.cashUp.getTotalRevenue(), dailyOverviews.actualRevenue, WorkTypes.BAR) * 100).toFixed(2)}%</div>
            ))}
            <div className="overview-stat-title">Predicted Kitchen labour rate</div>
            {dailyOverviews.overviews.map((overview, key) => (
              <div className="overview-stat" key={key}>{(overview.rota.getPredictedLabourRate(dailyOverviews.forecastRevenue, WorkTypes.KITCHEN) * 100).toFixed(2)}%</div>
            ))}
            <div className="overview-stat-title">Actual Kitchen labour rate</div>
            {dailyOverviews.overviews.map((overview, key) => (
              <div className="overview-stat" key={key}>{(overview.rota.getActualLabourRate(overview.cashUp.getTotalRevenue(), dailyOverviews.actualRevenue, WorkTypes.KITCHEN) * 100).toFixed(2)}%</div>
            ))}
          </div>
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