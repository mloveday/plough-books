import * as React from "react";
import {connect} from "react-redux";
import {AppState} from "../redux";
import './LandingPage.scss';
import {Routes} from "../Routing/Routes";
import {WorkTypes} from "../Enum/WorkTypes";
import * as moment from "moment";

interface LandingPageOwnProps {
}

interface LandingPageStateProps {
}

const mapStateToProps = (state: AppState, ownProps: LandingPageOwnProps): LandingPageStateProps => {
  return {}
};

interface LandingPageDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: LandingPageOwnProps): LandingPageDispatchProps => {
  return {};
};

type LandingPageProps = LandingPageOwnProps & LandingPageStateProps & LandingPageDispatchProps;

class LandingPageComponent extends React.Component<LandingPageProps, {}> {
  public render() {
    return (
      <div className={'landing-page'}>
        <h2 className={'page-title'}>What are you trying to do?</h2>
        <div className={'query'}>
          <div className={'query-title'}>Create or edit a rota</div>
          <div className={'query-answers'}>
            <div className={'query-answer'}>Go to <a className={'link'} href={Routes.weeklyPlanningUrl(moment.utc())}>weekly planning</a> to input forecasts for revenue and targets for labour rate</div>
            <div className={'query-answer'}>Go to <a className={'link'} href={Routes.rotaUrl(moment.utc(), WorkTypes.BAR)}>Bar rota</a> or <a className={'link'} href={Routes.rotaUrl(moment.utc(), WorkTypes.KITCHEN)}>Kitchen rota</a> to make a rota for a day</div>
            <div className={'query-answer'}>Print the rotas off on the <a className={'link'} href={Routes.weeklyRotaUrl(moment.utc())}>weekly rota page</a> (literally just print the page)</div>
          </div>
          <div className={'query-tip'}>Tip: make sure your staff roles & staff are up to date first</div>
        </div>
        <div className={'query'}>
          <div className={'query-title'}>Fill in a sign in sheet</div>
          <div className={'query-answers'}>
            <div className={'query-answer'}>Go to the <a className={'link'} href={Routes.signInUrl(moment.utc(), WorkTypes.BAR)}>Bar sign in</a> or <a className={'link'} href={Routes.signInUrl(moment.utc(), WorkTypes.KITCHEN)}>Kitchen sign in</a> page</div>
          </div>
          <div className={'query-tip'}>Tip: It can auto-fill based on the hours from an existing rota</div>
        </div>
        <div className={'query'}>
          <div className={'query-title'}>Fill in a cash up</div>
          <div className={'query-answers'}>
            <div className={'query-answer'}>Go to the <a className={'link'} href={Routes.cashUpUrl(moment.utc())}>cash up page</a></div>
          </div>
        </div>
        <div className={'query'}>
          <div className={'query-title'}>See how things are going</div>
          <div className={'query-answers'}>
            <div className={'query-answer'}>Go to the <a className={'link'} href={Routes.weeklyOverviewUrl(moment.utc())}>weekly overview page</a></div>
          </div>
        </div>
        <div className={'query'}>
          <div className={'query-title'}>Update staff details</div>
          <div className={'query-answers'}>
            <div className={'query-answer'}>Go to the <a className={'link'} href={Routes.STAFF_ROLES}>staff roles page</a> to make sure they are up to date first</div>
            <div className={'query-answer'}>Go to the <a className={'link'} href={Routes.STAFF_MEMBERS}>staff members page</a> to manage staff members including changing their roles.</div>
          </div>
          <div className={'query-tip'}>Tip: Don't worry, changing hourly rates or roles will only affect future rotas and sign in sheets</div>
        </div>
        <div className={'query'}>
          <div className={'query-title'}>Change who can access this dashboard</div>
          <div className={'query-answers'}>
            <div className={'query-answer'}>Go to the <a className={'link'} href={Routes.ROLES}>user roles</a> and <a className={'link'} href={Routes.USERS}>users</a> pages. This allows you to let people create rotas, etc.</div>
          </div>
        </div>
      </div>
    )
  }
}

export const LandingPage = connect<LandingPageStateProps, LandingPageDispatchProps, LandingPageOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(LandingPageComponent);
