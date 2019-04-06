import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {match} from "react-router";
import {WeekPicker} from "../../Common/Nav/WeekPicker";
import {Routes} from "../../Common/Routing/Routes";
import {ConstantsWithHover} from "../../DataVisualisation/Constants/ConstantsWithHover";
import {AppState} from "../../redux";
import {uiUpdate} from "../../Redux/UI/UiRedux";
import {UiState} from "../../Redux/UI/UiState";
import {DateFormats} from "../../Util/DateFormats";
import {startOfWeek} from "../../Util/DateUtils";
import {Formatting} from "../../Util/Formatting";
import {currencyPattern} from "../../Util/Validation";
import {CashUpExternalState} from "../../Redux/CashUp/CashUpExternalState";
import {cashUpFetchWithPrevious} from "../../Redux/CashUp/CashUpRedux";
import {Constants} from "../../Model/Constants/Constants";
import {ConstantsExternalState} from "../../Redux/Constants/ConstantsExternalState";
import {constantsFetch} from "../../Redux/Constants/ConstantsRedux";
import {RotaEntity} from "../../Model/Rota/RotaEntity";
import {RotaExternalState} from "../../Redux/Rota/RotaExternalState";
import {rotaDataEntry, rotaFetchWithPrevious, weeklyRotasCreate} from "../../Redux/Rota/RotaRedux";
import {RotasForWeek} from "../../Model/Rota/RotasForWeek";
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
  uiState: UiState;
}

const mapStateToProps = (state: AppState, ownProps: WeeklyPlanningOwnProps): WeeklyPlanningStateProps => {
  return {
    constantsExternalState: state.constantsExternalState,
    rotaExternalState: state.rotaExternalState,
    cashUpExternalState: state.cashUpExternalState,
    rotaLocalStates: state.rotaLocalStates,
    uiState: state.uiState,
  }
};

interface WeeklyPlanningDispatchProps {
  fetchConstants: () => void,
  fetchRotas: (date: moment.Moment) => void,
  fetchCashUps: (date: moment.Moment) => void,
  updateRotas: (rotas: RotaEntity[]) => void,
  weeklyOverviewCreate: (rotas: RotaEntity[]) => void,
  updateUi: (state: UiState) => void;
}

const mapDispatchToProps = (dispatch: any, ownProps: WeeklyPlanningOwnProps): WeeklyPlanningDispatchProps => {
  return {
    fetchConstants: () => dispatch(constantsFetch()),
    fetchRotas: date => dispatch(rotaFetchWithPrevious(date)),
    fetchCashUps: date => dispatch(cashUpFetchWithPrevious(date)),
    updateRotas: rotas => dispatch(rotaDataEntry(rotas)),
    weeklyOverviewCreate: rotas  => dispatch(weeklyRotasCreate(rotas)),
    updateUi: (state: UiState) => dispatch(uiUpdate(state)),
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
              <div className="planning-rota-item">{rota.getDate().format(DateFormats.READABLE_NO_YEAR)} ({rota.getReadableStatus()})</div>
              <input className="planning-rota-item" type="text" pattern={currencyPattern} value={rota.inputs.forecastRevenue} onChange={ev => this.updateRota(rota.update({forecastRevenue: ev.target.value}))} />
              <input className="planning-rota-item" type="text" pattern={currencyPattern} value={rota.inputs.targetLabourRate} onChange={ev => this.updateRota(rota.update({targetLabourRate: ev.target.value}))} />
              <ConstantsWithHover constants={rota.constants}>
              <select className="planning-rota-item" value={rota.constants.id} onChange={ev => {
                const c = this.props.constantsExternalState.externalState.entities.find(constants => constants.id === Number(ev.target.value));
                if (c !== undefined) {
                  this.updateRota(rota.update({constants: c}))
                }
              }}>
                {this.props.constantsExternalState.externalState.entities.map((constants, cKey) => (
                  <option key={cKey} value={constants.id}>{moment.utc(constants.date).format(DateFormats.READABLE_WITH_YEAR)}</option>
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
    const date = startOfWeek(Number(this.props.match.params.year), Number(this.props.match.params.weekNumber));
    if (this.props.uiState.isCurrentDateSameAs(date)) {
      this.props.updateUi(this.props.uiState.withCurrentDate(date));
      return;
    }
    if (this.props.constantsExternalState.isEmpty()) {
      this.props.fetchConstants();
      return;
    }
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
          this.updateRota(r.update({constants: this.props.constantsExternalState.externalState.entities.length > 0 ? this.props.constantsExternalState.externalState.entities.slice(0,1)[0] : Constants.default()}));
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