import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {match} from "react-router";
import {WeekPicker} from "../../Common/Nav/WeekPicker";
import {Routes} from "../../Common/Routing/Routes";
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
import {AppState} from "../../redux";
import {uiUpdate} from "../../State/UiRedux";
import {UiState} from "../../State/UiState";
import {DateFormats} from "../../Util/DateFormats";
import {startOfWeek} from "../../Util/DateUtils";
import {LabourCostOverview} from "./LabourCostOverview";
import {LabourRateOverview} from "./LabourRateOverview";
import {RevenueOverview} from "./RevenueOverview";
import {DailyOverviews} from "./State/DailyOverviews";
import {SummaryOverview} from "./SummaryOverview";
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
  uiState: UiState;
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
    uiState: state.uiState,
  }
};

interface WeeklyOverviewDispatchProps {
  fetchCashUps: (date: moment.Moment) => void,
  fetchConstants: () => void,
  fetchRotaForDate: (date: moment.Moment) => void,
  fetchStaffMembers: () => void,
  fetchStaffRoles: () => void,
  updateUi: (state: UiState) => void;
}

const mapDispatchToProps = (dispatch: any, ownProps: WeeklyOverviewOwnProps): WeeklyOverviewDispatchProps => {
  return {
    fetchCashUps: date => dispatch(cashUpFetch(date)),
    fetchConstants: () => dispatch(constantsFetch()),
    fetchRotaForDate: (date: moment.Moment) => dispatch(rotaFetch(date)),
    fetchStaffMembers: () => dispatch(staffMembersFetch()),
    fetchStaffRoles: () => dispatch(staffRolesFetch()),
    updateUi: (state: UiState) => dispatch(uiUpdate(state)),
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
        <SummaryOverview dailyOverviews={dailyOverviews} options={{status:true, constants:true, notes: true}} />
        <RevenueOverview dailyOverviews={dailyOverviews} />
        <LabourCostOverview dailyOverviews={dailyOverviews} />
        <LabourRateOverview dailyOverviews={dailyOverviews} />
      </div>)
  }

  private getStartOfWeek() {
    return startOfWeek(Number(this.props.match.params.year), Number(this.props.match.params.weekNumber))
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

export const WeeklyOverview = connect<WeeklyOverviewStateProps, WeeklyOverviewDispatchProps, WeeklyOverviewOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(WeeklyOverviewComponent);