import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {RotasForWeek} from "../../Model/Rota/RotasForWeek";
import {AppState} from "../../redux";
import {CashUpExternalState} from "../../Redux/CashUp/CashUpExternalState";
import {cashUpFetch} from "../../Redux/CashUp/CashUpRedux";
import {ConstantsExternalState} from "../../Redux/Constants/ConstantsExternalState";
import {constantsFetch} from "../../Redux/Constants/ConstantsRedux";
import {RotaExternalState} from "../../Redux/Rota/RotaExternalState";
import {rotaFetch} from "../../Redux/Rota/RotaRedux";
import {StaffMembersExternalState} from "../../Redux/StaffMember/StaffMembersExternalState";
import {StaffMembersLocalState} from "../../Redux/StaffMember/StaffMembersLocalState";
import {staffMembersFetch} from "../../Redux/StaffMember/StaffMembersRedux";
import {StaffRolesExternalState} from "../../Redux/StaffRole/StaffRolesExternalState";
import {StaffRolesLocalState} from "../../Redux/StaffRole/StaffRolesLocalState";
import {staffRolesFetch} from "../../Redux/StaffRole/StaffRolesRedux";
import {uiUpdate} from "../../Redux/UI/UiRedux";
import {UiState} from "../../Redux/UI/UiState";
import {DateFormats} from "../../Util/DateFormats";
import {accountingYearString} from "../../Util/DateUtils";
import {RunningTotalsOverview} from "./Partials/RunningTotalsOverview";
import {SummaryOverview} from "./Partials/SummaryOverview";
import {DailyOverviews} from "./State/DailyOverviews";
import './WeeklyOverview.scss';

interface WeeklyRunningOverviewOwnProps {
}

interface WeeklyRunningOverviewStateProps {
  cashUpExternalState: CashUpExternalState;
  constantsExternalState: ConstantsExternalState;
  rotaExternalState: RotaExternalState;
  rotaLocalStates: RotasForWeek;
  staffMembersExternalState: StaffMembersExternalState;
  staffMembersLocalState: StaffMembersLocalState;
  staffRolesExternalState: StaffRolesExternalState;
  staffRolesLocalState: StaffRolesLocalState;
  uiState: UiState;
}

const mapStateToProps = (state: AppState, ownProps: WeeklyRunningOverviewOwnProps): WeeklyRunningOverviewStateProps => {
  return {
    cashUpExternalState: state.cashUpExternalState,
    constantsExternalState: state.constantsExternalState,
    rotaExternalState: state.rotaExternalState,
    rotaLocalStates: state.rotaLocalStates,
    staffMembersExternalState: state.staffMembersExternalState,
    staffMembersLocalState: state.staffMembersLocalState,
    staffRolesExternalState: state.staffRolesExternalState,
    staffRolesLocalState: state.staffRolesLocalState,
    uiState: state.uiState,
  }
};

interface WeeklyRunningOverviewDispatchProps {
  fetchCashUps: (date: moment.Moment) => void,
  fetchConstants: () => void,
  fetchRotaForDate: (date: moment.Moment) => void,
  fetchStaffMembers: () => void,
  fetchStaffRoles: () => void,
  updateUi: (state: UiState) => void;
}

const mapDispatchToProps = (dispatch: any, ownProps: WeeklyRunningOverviewOwnProps): WeeklyRunningOverviewDispatchProps => {
  return {
    fetchCashUps: date => dispatch(cashUpFetch(date)),
    fetchConstants: () => dispatch(constantsFetch()),
    fetchRotaForDate: (date: moment.Moment) => dispatch(rotaFetch(date)),
    fetchStaffMembers: () => dispatch(staffMembersFetch()),
    fetchStaffRoles: () => dispatch(staffRolesFetch()),
    updateUi: (state: UiState) => dispatch(uiUpdate(state)),
  };
};

type WeeklyRunningOverviewProps = WeeklyRunningOverviewOwnProps & WeeklyRunningOverviewStateProps & WeeklyRunningOverviewDispatchProps;

class WeeklyRunningOverviewComponent extends React.Component<WeeklyRunningOverviewProps, {}> {
  public componentDidMount() {
    this.maintainStateWithUrl();
  }

  public componentDidUpdate() {
    this.maintainStateWithUrl();
  }

  public render() {
    if (!this.props.staffRolesExternalState.isLoaded() || !this.props.staffMembersExternalState.isLoaded() || !this.props.constantsExternalState.isLoaded() || !this.props.rotaExternalState.isLoaded() || !this.props.cashUpExternalState.isLoaded()) {
      return null;
    }
    const dailyOverviews = new DailyOverviews(this.getStartOfWeek(), this.props.rotaExternalState.rotasForWeek, this.props.cashUpExternalState.cashUpsForWeek);
    const date = this.getStartOfWeek();
    return (
      <div className="weekly-overview">
        <h1 className="overview-title">Weekly overview for {accountingYearString(date)} ({date.format(DateFormats.READABLE_WITH_YEAR)})</h1>
        <table className="overview-rota-group">
          <thead>
            <SummaryOverview dailyOverviews={dailyOverviews} options={{status:true, constants:true, notes: true}} />
          </thead>
          <tbody>
            <RunningTotalsOverview dailyOverviews={dailyOverviews} />
          </tbody>
        </table>
      </div>)
  }

  private getStartOfWeek() {
    return moment.utc().startOf('isoWeek');
  }

  private maintainStateWithUrl() {
    const paramDate = this.getStartOfWeek();
    if (this.props.uiState.isCurrentDateSameAs(paramDate)) {
      this.props.updateUi(this.props.uiState.withCurrentDate(paramDate));
      return;
    }
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
      this.props.fetchRotaForDate(moment.utc(paramDate));
      return;
    }
    if (this.props.cashUpExternalState.shouldLoadForDate(paramDate)) {
      this.props.fetchCashUps(paramDate);
    }
  }
}

export const WeeklyRunningOverview = connect<WeeklyRunningOverviewStateProps, WeeklyRunningOverviewDispatchProps, WeeklyRunningOverviewOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(WeeklyRunningOverviewComponent);