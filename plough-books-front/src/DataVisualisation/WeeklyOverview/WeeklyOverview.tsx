import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {match} from "react-router";
import {CashUpExternalState} from "../../DataEntry/CashUp/State/CashUpExternalState";
import {cashUpFetch} from "../../DataEntry/CashUp/State/CashUpRedux";
import {ConstantsExternalState} from "../../DataEntry/Constants/State/ConstantsExternalState";
import {constantsFetch} from "../../DataEntry/Constants/State/ConstantsRedux";
import {RotaExternalState} from "../../DataEntry/Rota/State/RotaExternalState";
import {rotaFetch} from "../../DataEntry/Rota/State/RotaRedux";
import {RotasForWeek} from "../../DataEntry/Rota/State/RotasForWeek";
import {StaffMembersExternalState} from "../../DataEntry/StaffMembers/State/StaffMembersExternalState";
import {StaffMembersLocalState} from "../../DataEntry/StaffMembers/State/StaffMembersLocalState";
import {staffMembersFetch} from "../../DataEntry/StaffMembers/State/StaffMembersRedux";
import {StaffRolesExternalState} from "../../DataEntry/StaffRoles/State/StaffRolesExternalState";
import {StaffRolesLocalState} from "../../DataEntry/StaffRoles/State/StaffRolesLocalState";
import {staffRolesFetch} from "../../DataEntry/StaffRoles/State/StaffRolesRedux";
import {WorkTypes} from "../../Enum/WorkTypes";
import {AppState} from "../../redux";
import {DateFormats} from "../../Util/DateFormats";
import {startOfWeek} from "../../Util/DateUtils";
import {DailyOverview} from "./State/DailyOverview";
import './WeeklyOverview.css';

interface WeeklyOverviewOwnProps {
  match: match<{
    weekNumber: string,
    year: string,
  }>;
}

interface WeeklyOverviewStateProps {
  cashUpExternalState: CashUpExternalState;
  constantsExternalState: ConstantsExternalState;
  rotaExternalState: RotaExternalState;
  rotaLocalStates: RotasForWeek;
  staffMembersExternalState: StaffMembersExternalState;
  staffMembersLocalState: StaffMembersLocalState;
  staffRolesExternalState: StaffRolesExternalState;
  staffRolesLocalState: StaffRolesLocalState;
}

const mapStateToProps = (state: AppState, ownProps: WeeklyOverviewOwnProps): WeeklyOverviewStateProps => {
  return {
    cashUpExternalState: state.cashUpExternalState,
    constantsExternalState: state.constantsExternalState,
    rotaExternalState: state.rotaExternalState,
    rotaLocalStates: state.rotaLocalStates,
    staffMembersExternalState: state.staffMembersExternalState,
    staffMembersLocalState: state.staffMembersLocalState,
    staffRolesExternalState: state.staffRolesExternalState,
    staffRolesLocalState: state.staffRolesLocalState,
  }
};

interface WeeklyOverviewDispatchProps {
  fetchCashUps: (date: moment.Moment) => void,
  fetchConstants: () => void,
  fetchRotaForDate: (date: moment.Moment) => void,
  fetchStaffMembers: () => void,
  fetchStaffRoles: () => void,
}

const mapDispatchToProps = (dispatch: any, ownProps: WeeklyOverviewOwnProps): WeeklyOverviewDispatchProps => {
  return {
    fetchCashUps: date => dispatch(cashUpFetch(date)),
    fetchConstants: () => dispatch(constantsFetch()),
    fetchRotaForDate: (date: moment.Moment) => dispatch(rotaFetch(date)),
    fetchStaffMembers: () => dispatch(staffMembersFetch()),
    fetchStaffRoles: () => dispatch(staffRolesFetch()),
  };
};

type WeeklyOverviewProps = WeeklyOverviewOwnProps & WeeklyOverviewStateProps & WeeklyOverviewDispatchProps;

class WeeklyOverviewComponent extends React.Component<WeeklyOverviewProps, {}> {
  public componentDidMount() {
    this.maintainStateWithUrl();
  }

  public componentDidUpdate() {
    this.maintainStateWithUrl();
  }

  public render() {
    const startOfThisWeek = this.getStartOfWeek();
    const totalForecastRevenue = this.props.rotaLocalStates.getTotalForecastRevenue();
    const totalActualRevenue = this.props.cashUpExternalState.cashUpsForWeek.getTotalRevenue();

    const totalForecastBarLabour = this.props.rotaLocalStates.getTotalPredictedBarLabour(totalForecastRevenue);
    const totalForecastKitchenLabour = this.props.rotaLocalStates.getTotalPredictedKitchenLabour(totalForecastRevenue);
    const totalForecastLabour = totalForecastBarLabour + totalForecastKitchenLabour;

    const overviews = this.getDailyOverviews();

    const totalActualBarLabour = this.getTotalActualBarLabour(overviews, totalActualRevenue);
    const totalActualKitchenLabour = this.getTotalActualKitchenLabour(overviews, totalActualRevenue);
    const totalActualLabour = totalActualBarLabour + totalActualKitchenLabour;

    const totalVatAdjustedActualRevenue = overviews.reduce((prev, curr) => prev + curr.getVatAdjustedRevenue(), 0);
    const totalVatAdjustedForecastRevenue = this.props.rotaLocalStates.getTotalVatAdjustedForecastRevenue();

    return (
      <div className="weekly-overview">
        <h1 className="overview-title">Weekly overview for {this.props.match.params.year}-{this.props.match.params.weekNumber} ({startOfThisWeek.format(DateFormats.READABLE_WITH_YEAR)})</h1>
        <div className="overview-stats">
          <div className="overview-stat">Bar costs: £{totalForecastBarLabour.toFixed(2)}</div>
          <div className="overview-stat">Kitchen costs: £{totalForecastKitchenLabour.toFixed(2)}</div>
        </div>
        <div className="overview-stats">
          <div className="overview-stat">Total costs: £{totalForecastLabour.toFixed(2)}</div>
          <div className="overview-stat">Total forecast revenue: £{totalForecastRevenue.toFixed(2)}</div>
          <div className="overview-stat">Total revenue: £{totalActualRevenue.toFixed(2)}</div>
        </div>
        <div className="overview-stats">
          <div className="overview-stat">Combined forecast labour rate: {(100*totalForecastLabour/totalVatAdjustedForecastRevenue).toFixed(2)}%</div>
          <div className="overview-stat">Target forecast labour rate: {(100*this.props.rotaLocalStates.getTargetLabourRateForWeek()).toFixed(2)}%</div>
          <div className="overview-stat">Combined actual labour rate: {(100*totalActualLabour/totalVatAdjustedActualRevenue).toFixed(2)}%</div>
        </div>
        <div className="overview-rota-group">
          <div className="overview-day">
            <div className="overview-stat">Date</div>
            <div className="overview-stat">Status</div>
            <div className="overview-stat">Constants from date</div>
            <div className="overview-stat">Forecast revenue</div>
            <div className="overview-stat">Actual revenue</div>
            <div className="overview-stat">Predicted Bar wage cost</div>
            <div className="overview-stat">Predicted Kitchen wage cost</div>
            <div className="overview-stat">Actual Bar wage cost</div>
            <div className="overview-stat">Actual Kitchen wage cost</div>
            <div className="overview-stat">Target labour rate</div>
            <div className="overview-stat">Predicted Bar labour rate</div>
            <div className="overview-stat">Actual Bar labour rate</div>
            <div className="overview-stat">Predicted Kitchen labour rate</div>
            <div className="overview-stat">Actual Kitchen labour rate</div>
          </div>
          {overviews.map((overview, key) => (
            <div className={`overview-day ${overview.date.format('ddd').toLowerCase()}`} key={key}>
              <div className="overview-stat">{overview.date.format(DateFormats.READABLE_NO_YEAR)}</div>
              <div className="overview-stat">{overview.rota.status}</div>
              <div className="overview-stat">{overview.rota.constants.date.format(DateFormats.DMY_SLASHES)}</div>
              <div className="overview-stat">£{overview.rota.forecastRevenue.toFixed(2)}</div>
              <div className="overview-stat">£{overview.cashUp.getTotalRevenue().toFixed(2)}</div>
              <div className="overview-stat">£{overview.rota.getTotalPredictedLabourCost(totalForecastRevenue, WorkTypes.BAR).toFixed(2)}</div>
              <div className="overview-stat">£{overview.rota.getTotalPredictedLabourCost(totalForecastRevenue, WorkTypes.KITCHEN).toFixed(2)}</div>
              <div className="overview-stat">£{overview.rota.getTotalActualLabourCost(overview.cashUp.getTotalRevenue(), totalActualRevenue, WorkTypes.BAR).toFixed(2)}</div>
              <div className="overview-stat">£{overview.rota.getTotalActualLabourCost(overview.cashUp.getTotalRevenue(), totalActualRevenue, WorkTypes.KITCHEN).toFixed(2)}</div>
              <div className="overview-stat">{(overview.rota.targetLabourRate * 100).toFixed(2)}%</div>
              <div className="overview-stat">{(overview.rota.getPredictedLabourRate(totalForecastRevenue, WorkTypes.BAR) * 100).toFixed(2)}%</div>
              <div className="overview-stat">{(overview.rota.getActualLabourRate(overview.cashUp.getTotalRevenue(), totalActualRevenue, WorkTypes.BAR) * 100).toFixed(2)}%</div>
              <div className="overview-stat">{(overview.rota.getPredictedLabourRate(totalForecastRevenue, WorkTypes.KITCHEN) * 100).toFixed(2)}%</div>
              <div className="overview-stat">{(overview.rota.getActualLabourRate(overview.cashUp.getTotalRevenue(), totalActualRevenue, WorkTypes.KITCHEN) * 100).toFixed(2)}%</div>
            </div>
          ))}
        </div>
        <div className="temp-todo">
          <h2>TODO</h2>
          <div>Display stats for whole week</div>
          <div>Fill in blank days</div>
        </div>
      </div>)
  }

  private getTotalActualBarLabour(overviews: DailyOverview[], totalActualRevenue: number): number {
    return overviews.reduce((prev, curr) => curr.rota.getTotalActualLabourCost(curr.cashUp.getTotalRevenue(), totalActualRevenue, WorkTypes.BAR) + prev, 0);
  }

  private getTotalActualKitchenLabour(overviews: DailyOverview[], totalActualRevenue: number): number {
    return overviews.reduce((prev, curr) => curr.rota.getTotalActualLabourCost(curr.cashUp.getTotalRevenue(), totalActualRevenue, WorkTypes.KITCHEN) + prev, 0);
  }

  private getStartOfWeek() {
    return startOfWeek(Number(this.props.match.params.year), Number(this.props.match.params.weekNumber))
  }

  private getDailyOverviews(): DailyOverview[] {
    const date = this.getStartOfWeek();
    const days = [
      date.clone().add(0, 'days'),
      date.clone().add(1, 'days'),
      date.clone().add(2, 'days'),
      date.clone().add(3, 'days'),
      date.clone().add(4, 'days'),
      date.clone().add(5, 'days'),
      date.clone().add(6, 'days'),
    ];
    const overviews: DailyOverview[] = [];
    days.forEach(day => {
      const cashUp = this.props.cashUpExternalState.cashUpsForWeek.cashUps.get(day.format(DateFormats.API));
      const rota = this.props.rotaExternalState.rotasForWeek.rotas.get(day.format(DateFormats.API));
      if (cashUp && rota) {
        overviews.push(new DailyOverview(
          cashUp,
          rota,
          day
        ))
      }
    });
    return overviews;
  }

  private maintainStateWithUrl() {
    const paramDate = this.getStartOfWeek();
    if (this.props.staffRolesExternalState.isEmpty()) {
      this.props.fetchStaffRoles();
      return;
    }
    if (this.props.staffMembersExternalState.isEmpty()) {
      this.props.fetchStaffMembers();
      return;
    }
    if (this.props.constantsExternalState.isEmpty()) {
      this.props.fetchConstants();
      return;
    }
    if (this.props.rotaExternalState.shouldLoadForDate(paramDate)) {
      this.props.fetchRotaForDate(moment(paramDate));
      return;
    }
    if (this.props.cashUpExternalState.shouldLoadForDate(paramDate)) {
      this.props.fetchCashUps(paramDate);
    }
  }
}

export const WeeklyOverview = connect<WeeklyOverviewStateProps, WeeklyOverviewDispatchProps, WeeklyOverviewOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(WeeklyOverviewComponent);