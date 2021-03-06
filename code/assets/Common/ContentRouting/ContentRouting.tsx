import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {Redirect, Route, Switch} from "react-router";
import {CashUp} from "../../DataEntry/CashUp/CashUp";
import {ConstantsDataEntry} from "../../DataEntry/Constants/Constants";
import {HolidayDataEntry} from "../../DataEntry/Holidays/Holidays";
import {Roles} from "../../DataEntry/Role/Roles";
import {Rota} from "../../DataEntry/Rota/Rota";
import {SignIn} from "../../DataEntry/Rota/SignIn";
import {RotaStaffingTemplatesDataEntry} from "../../DataEntry/RotaStaffingTemplates/RotaStaffingTemplates";
import {StaffMembers} from "../../DataEntry/StaffMembers/StaffMembers";
import {StaffRoles} from "../../DataEntry/StaffRoles/StaffRoles";
import {Users} from "../../DataEntry/User/Users";
import {WeeklyPlanning} from "../../DataEntry/WeeklyPlanning/WeeklyPlanning";
import {MonthlyFigures} from "../../DataVisualisation/MonthlyFigures/MonthlyFigures";
import {TestCoverageComponent} from "../../DataVisualisation/Tests/TestCoverage";
import {TestResultsComponent} from "../../DataVisualisation/Tests/TestResults";
import {WeeklyOverview} from "../../DataVisualisation/WeeklyOverview/WeeklyOverview";
import {WeeklyRota} from "../../DataVisualisation/WeeklyRota/WeeklyRota";
import {CashUpPage} from "../../Model/Enum/CashUpPage";
import {ShiftRecordingTypes} from "../../Model/Enum/ShiftRecordingType";
import {WorkTypes} from "../../Model/Enum/WorkTypes";
import {AppState} from "../../redux";
import {AuthState} from "../../Redux/Auth/AuthState";
import {LandingPage} from "../LandingPage/LandingPage";
import {Routes} from "../Routing/Routes";
import {PageNotFound} from "./PageNotFound";
import {RouteWithAuth} from "./RouteWithAuth";

interface ContentRoutingOwnProps {
}

interface ContentRoutingStateProps {
  authState: AuthState;
}

const mapStateToProps = (state: AppState, ownProps: ContentRoutingOwnProps): ContentRoutingStateProps => {
  return {
    authState: state.authState,
  }
};

interface ContentRoutingDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: ContentRoutingOwnProps): ContentRoutingDispatchProps => {
  return {};
};

type ContentRoutingProps = ContentRoutingOwnProps & ContentRoutingStateProps & ContentRoutingDispatchProps;

class ContentRoutingComponent extends React.Component<ContentRoutingProps, {}> {
  public render() {
    return (
      <div className="App-content-container">
        {/*Do not show any content unless authorised*/}
        {this.props.authState.isSignedInAndAuthorised() &&
          <Switch>
            <RouteWithAuth exact={true} path={Routes.cashUpRoute()} component={CashUp}/>
            <RouteWithAuth exact={true} path={Routes.rotaRoute()} component={Rota}/>
            <RouteWithAuth exact={true} path={Routes.signInRoute()} component={SignIn}/>
            <RouteWithAuth exact={true} path={Routes.weeklyOverviewRoute()} component={WeeklyOverview}/>
            <RouteWithAuth exact={true} path={Routes.weeklyPlanningRoute()} component={WeeklyPlanning}/>
            <RouteWithAuth exact={true} path={Routes.weeklyRotaRoute()} render={props => <WeeklyRota {...props} shiftRecordingType={ShiftRecordingTypes.ROTA}/>} />
            <RouteWithAuth exact={true} path={Routes.weeklySignInRoute()} render={props => <WeeklyRota {...props} shiftRecordingType={ShiftRecordingTypes.SIGN_IN}/>}/>
            <RouteWithAuth exact={true} path={Routes.STAFF_MEMBERS} component={StaffMembers}/>
            <RouteWithAuth exact={true} path={Routes.STAFF_ROLES} component={StaffRoles}/>
            <RouteWithAuth exact={true} path={Routes.CONSTANTS} component={ConstantsDataEntry}/>
            <RouteWithAuth exact={true} path={Routes.holidayRoute()} component={HolidayDataEntry}/>
            <RouteWithAuth exact={true} path={Routes.ROTA_STAFFING_TEMPLATES} component={RotaStaffingTemplatesDataEntry}/>
            <RouteWithAuth exact={true} path={Routes.USERS} component={Users}/>
            <RouteWithAuth exact={true} path={Routes.ROLES} component={Roles}/>
            <RouteWithAuth exact={true} path={Routes.TEST_RESULTS} component={TestResultsComponent}/>
            <RouteWithAuth exact={true} path={Routes.TEST_COVERAGE} component={TestCoverageComponent}/>
            <RouteWithAuth exact={true} path={Routes.MONTHLY_FIGURES} component={MonthlyFigures}/>
            <Redirect to={Routes.weeklyPlanningUrl(moment.utc())} exact={false} path={Routes.WEEKLY_PLANNING} />
            <Redirect to={Routes.weeklySignInUrl(moment.utc())} exact={false} path={Routes.WEEKLY_SIGN_IN} />
            <Redirect to={Routes.weeklyRotaUrl(moment.utc())} exact={false} path={Routes.WEEKLY_ROTA} />
            <Redirect to={Routes.weeklyOverviewUrl(moment.utc())} exact={false} path={Routes.WEEKLY_OVERVIEW} />
            <Redirect to={Routes.cashUpUrl(moment.utc(), CashUpPage.TILLS)} exact={false} path={Routes.CASH_UP} />
            <Redirect to={Routes.rotaUrl(moment.utc(), WorkTypes.BAR)} exact={false} path={Routes.ROTA} />
            <Redirect to={Routes.signInUrl(moment.utc(), WorkTypes.BAR)} exact={false} path={Routes.SIGN_IN_SHEET} />
            <Route exact={true} path={'/'} component={LandingPage}/>
            <Route component={PageNotFound}/>
          </Switch>
        }
      </div>
    )
  }
}

export const ContentRouting = connect<ContentRoutingStateProps, ContentRoutingDispatchProps, ContentRoutingOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(ContentRoutingComponent);
