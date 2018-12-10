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
import {WeekPicker} from "../../Nav/WeekPicker";
import {AppState} from "../../redux";
import {Routes} from "../../Routing/Routes";
import {DateFormats} from "../../Util/DateFormats";
import {startOfWeek} from "../../Util/DateUtils";
import {ConstantsWithHover} from "../Constants/ConstantsWithHover";
import {DailyOverviews} from "./State/DailyOverviews";
import './WeeklyOverview.scss';

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
    const dailyOverviews = new DailyOverviews(this.getStartOfWeek(), this.props.rotaExternalState.rotasForWeek, this.props.cashUpExternalState.cashUpsForWeek);
    return (
      <div className="weekly-overview">
        <WeekPicker week={parseInt(this.props.match.params.weekNumber, 10)}
                    year={parseInt(this.props.match.params.year, 10)}
                    urlFromDate={date => Routes.weeklyOverviewUrl(date)}/>
        <h1 className="overview-title">Weekly overview for {this.props.match.params.year}-{this.props.match.params.weekNumber} ({dailyOverviews.startOfWeek.format(DateFormats.READABLE_WITH_YEAR)})</h1>
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
          <div className="overview-stat">Target forecast labour rate: {(100*this.props.rotaLocalStates.getTargetLabourRateForWeek()).toFixed(2)}%</div>
          <div className="overview-stat">Combined forecast labour rate: {(100*dailyOverviews.getCombinedForecastLabourRate()).toFixed(2)}%</div>
          <div className="overview-stat">Combined actual labour rate: {(100*dailyOverviews.getCombinedActualLabourRate()).toFixed(2)}%</div>
        </div>
        <div className="overview-rota-group">
          <div className="overview-stat-title">Date</div>
          {dailyOverviews.overviews.map((overview, key) => (
            <div className="overview-stat" key={key}>{overview.date.format(DateFormats.READABLE_NO_YEAR)}</div>
          ))}
          <div className="overview-stat-title">Status</div>
          {dailyOverviews.overviews.map((overview, key) => (
            <div className="overview-stat" key={key}>{overview.rota.status}</div>
          ))}
          <div className="overview-stat-title">Constants from date</div>
          {dailyOverviews.overviews.map((overview, key) => (
            <ConstantsWithHover constants={overview.rota.constants} key={key} />
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
      </div>)
  }

  private getStartOfWeek() {
    return startOfWeek(Number(this.props.match.params.year), Number(this.props.match.params.weekNumber))
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