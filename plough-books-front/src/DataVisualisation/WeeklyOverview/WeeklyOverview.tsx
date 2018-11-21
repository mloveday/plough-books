import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {match} from "react-router";
import {ConstantsExternalState} from "../../DataEntry/Constants/State/ConstantsExternalState";
import {constantsFetch} from "../../DataEntry/Constants/State/ConstantsRedux";
import {RotaExternalState} from "../../DataEntry/Rota/State/RotaExternalState";
import {RotaLocalStates} from "../../DataEntry/Rota/State/RotaLocalStates";
import {rotaFetch} from "../../DataEntry/Rota/State/RotaRedux";
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
  rotaLocalStates: RotaLocalStates;
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
  fetchRotaForDate: (date: moment.Moment, type: string) => void;
  fetchStaffMembers: () => void;
  fetchStaffRoles: () => void;
}

const mapDispatchToProps = (dispatch: any, ownProps: WeeklyOverviewOwnProps): WeeklyOverviewDispatchProps => {
  return {
    fetchConstants: () => dispatch(constantsFetch()),
    fetchRotaForDate: (date: moment.Moment, type: string) => dispatch(rotaFetch(date, type)),
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
    const totalForecastBarRevenue = this.props.rotaLocalStates.getTotalForecastBarRevenue();
    const totalForecastKitchenRevenue = this.props.rotaLocalStates.getTotalForecastKitchenRevenue();
    const totalForecastRevenue = (totalForecastBarRevenue + totalForecastKitchenRevenue)/2; // TODO this should be equal in theory

    const totalVatAdjustedForecastBarRevenue = this.props.rotaLocalStates.getTotalVatAdjustedForecastBarRevenue();
    const totalVatAdjustedForecastKitchenRevenue = this.props.rotaLocalStates.getTotalVatAdjustedForecastKitchenRevenue();
    const totalVatAdjustedForecastRevenue = (totalVatAdjustedForecastBarRevenue + totalVatAdjustedForecastKitchenRevenue)/2; // TODO this should be equal in theory

    const totalForecastBarLabour = this.props.rotaLocalStates.getTotalBarLabour(totalForecastBarRevenue);
    const totalForecastKitchenLabour = this.props.rotaLocalStates.getTotalKitchenLabour(totalForecastKitchenRevenue);
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
          <div className="overview-stat">Bar revenue: £{totalForecastBarRevenue.toFixed(2)}</div>
          <div className="overview-stat">Kitchen revenue: £{totalForecastKitchenRevenue.toFixed(2)}</div>
          <div className="overview-stat">Total revenue: £{totalForecastRevenue.toFixed(2)}</div>
        </div>
        <div className="overview-stats">
          <div className="overview-stat">Combined labour rate: {(100*totalForecastLabour/totalVatAdjustedForecastRevenue).toFixed(2)}%</div>
        </div>
        <div className="overview-rota-group">
        {Array.from(this.props.rotaLocalStates.bar.values()).map((rota, key) => (
          <div className="overview-day" key={key}>
            <div className="overview-stat">{rota.type} Rota {rota.date.format('ddd D MMM Y')}</div>
            <div className="overview-stat">Status: {rota.status}</div>
            <div className="overview-stat">Constants: {rota.constants.date.format('YYYY-MM-DD')}</div>
            <div className="overview-stat">Forecast revenue: {rota.forecastRevenue}</div>
            <div className="overview-stat">Total wage cost: £{rota.getTotalLabourCost(totalForecastBarRevenue).toFixed(2)}</div>
            <div className="overview-stat">Labour rate: {(rota.getLabourRate(totalForecastBarRevenue) * 100).toFixed(2)}% (aiming for &lt; {(rota.targetLabourRate * 100).toFixed(2)}%)</div>
          </div>
        ))}
        </div>
        <div className="overview-rota-group">
        {Array.from(this.props.rotaLocalStates.kitchen.values()).map((rota, key) => (
          <div className={`overview-day ${rota.date.format('ddd').toLowerCase()}`} key={key}>
            <div className="overview-stat">{rota.type} Rota {rota.date.format('ddd D MMM Y')}</div>
            <div className="overview-stat">Status: {rota.status}</div>
            <div className="overview-stat">Constants: {rota.constants.date.format('YYYY-MM-DD')}</div>
            <div className="overview-stat">Forecast revenue: {rota.forecastRevenue}</div>
            <div className="overview-stat">Total wage cost: £{rota.getTotalLabourCost(totalForecastKitchenRevenue).toFixed(2)}</div>
            <div className="overview-stat">Labour rate: {(rota.getLabourRate(totalForecastKitchenRevenue) * 100).toFixed(2)}% (aiming for &lt; {(rota.targetLabourRate * 100).toFixed(2)}%)</div>
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
      || (this.props.rotaExternalState.rotaExternalState && this.props.rotaExternalState.state === 'OK' && !this.props.rotaExternalState.rotaExternalState.bar.has(paramDate.format('YYYY-MM-DD')))
    ) {
      this.props.fetchRotaForDate(moment(paramDate), 'all');
      return;
    }
  }
}

export const WeeklyOverview = connect<WeeklyOverviewStateProps, WeeklyOverviewDispatchProps, WeeklyOverviewOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(WeeklyOverviewComponent);