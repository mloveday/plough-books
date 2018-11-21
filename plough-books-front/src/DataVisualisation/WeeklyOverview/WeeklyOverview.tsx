import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {match} from "react-router";
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
import {AppState} from "../../redux";
import {startOfWeek} from "../../Util/DateUtils";
import './WeeklyOverview.css';

interface WeeklyOverviewOwnProps {
  match: match<{
    weekNumber: string,
    year: string,
  }>;
}

interface WeeklyOverviewStateProps {
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
  fetchConstants: () => void;
  fetchRotaForDate: (date: moment.Moment) => void;
  fetchStaffMembers: () => void;
  fetchStaffRoles: () => void;
}

const mapDispatchToProps = (dispatch: any, ownProps: WeeklyOverviewOwnProps): WeeklyOverviewDispatchProps => {
  return {
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

    const totalVatAdjustedForecastRevenue = this.props.rotaLocalStates.getTotalVatAdjustedForecastRevenue();

    const totalForecastBarLabour = this.props.rotaLocalStates.getTotalBarLabour(totalForecastRevenue);
    const totalForecastKitchenLabour = this.props.rotaLocalStates.getTotalKitchenLabour(totalForecastRevenue);
    const totalForecastLabour = totalForecastBarLabour + totalForecastKitchenLabour;

    return (
      <div className="weekly-overview">
        <h1 className="overview-title">Weekly overview for {this.props.match.params.year}-{this.props.match.params.weekNumber} ({startOfThisWeek.format('ddd D MMM Y')})</h1>
        <div className="overview-stats">
          <div className="overview-stat">Bar costs: £{totalForecastBarLabour.toFixed(2)}</div>
          <div className="overview-stat">Kitchen costs: £{totalForecastKitchenLabour.toFixed(2)}</div>
          <div className="overview-stat">Total costs: £{totalForecastLabour.toFixed(2)}</div>
        </div>
        <div className="overview-stats">
          <div className="overview-stat">Total revenue: £{totalForecastRevenue.toFixed(2)}</div>
        </div>
        <div className="overview-stats">
          <div className="overview-stat">Combined labour rate: {(100*totalForecastLabour/totalVatAdjustedForecastRevenue).toFixed(2)}%</div>
        </div>
        <div className="overview-rota-group">
        {Array.from(this.props.rotaLocalStates.rotas.values()).map((rota, key) => (
          <div className="overview-day" key={key}>
            <div className="overview-stat">Rota {rota.date.format('ddd D MMM Y')}</div>
            <div className="overview-stat">Status: {rota.status}</div>
            <div className="overview-stat">Constants: {rota.constants.date.format('YYYY-MM-DD')}</div>
            <div className="overview-stat">Forecast revenue: {rota.forecastRevenue}</div>
            <div className="overview-stat">Total bar wage cost: £{rota.getTotalLabourCost(totalForecastRevenue, 'bar').toFixed(2)}</div>
            <div className="overview-stat">Bar labour rate: {(rota.getLabourRate(totalForecastRevenue, 'bar') * 100).toFixed(2)}% (aiming for &lt; {(rota.targetLabourRate * 100).toFixed(2)}%)</div>
            <div className="overview-stat">Total kitchen wage cost: £{rota.getTotalLabourCost(totalForecastRevenue, 'kitchen').toFixed(2)}</div>
            <div className="overview-stat">Kitchen labour rate: {(rota.getLabourRate(totalForecastRevenue, 'kitchen') * 100).toFixed(2)}% (aiming for &lt; {(rota.targetLabourRate * 100).toFixed(2)}%)</div>
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

  private getStartOfWeek() {
    return startOfWeek(Number(this.props.match.params.year), Number(this.props.match.params.weekNumber))
  }

  private maintainStateWithUrl() {
    const paramDate = this.getStartOfWeek();
    if (this.props.staffRolesExternalState.state === 'EMPTY') {
      this.props.fetchStaffRoles();
      return;
    }
    if (this.props.staffMembersExternalState.state === 'EMPTY') {
      this.props.fetchStaffMembers();
      return;
    }
    if (this.props.constantsExternalState.state === 'EMPTY') {
      this.props.fetchConstants();
      return;
    }
    if (this.props.rotaExternalState.state === 'EMPTY'
      || (this.props.rotaExternalState.rotasForWeek && this.props.rotaExternalState.state === 'OK' && !this.props.rotaExternalState.rotasForWeek.rotas.has(paramDate.format('YYYY-MM-DD')))
    ) {
      this.props.fetchRotaForDate(moment(paramDate));
      return;
    }
  }
}

export const WeeklyOverview = connect<WeeklyOverviewStateProps, WeeklyOverviewDispatchProps, WeeklyOverviewOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(WeeklyOverviewComponent);