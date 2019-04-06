import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {LabourCostOverview} from "../../DataVisualisation/WeeklyOverview/LabourCostOverview";
import {LabourRateOverview} from "../../DataVisualisation/WeeklyOverview/LabourRateOverview";
import {RevenueOverview} from "../../DataVisualisation/WeeklyOverview/RevenueOverview";
import {DailyOverviews} from "../../DataVisualisation/WeeklyOverview/State/DailyOverviews";
import {SummaryOverview} from "../../DataVisualisation/WeeklyOverview/SummaryOverview";
import {AppState} from "../../redux";
import {CashUpExternalState} from "../../Redux/CashUp/CashUpExternalState";
import {RotaExternalState} from "../../Redux/Rota/RotaExternalState";
import "./PriorWeekOverview.scss";

interface PriorWeekOverviewOwnProps {
  dayInPriorWeek: moment.Moment;
  title: string;
}

interface PriorWeekOverviewStateProps {
  rotaExternalState: RotaExternalState,
  cashUpExternalState: CashUpExternalState,
}

const mapStateToProps = (state: AppState, ownProps: PriorWeekOverviewOwnProps): PriorWeekOverviewStateProps => {
  return {
    rotaExternalState: state.rotaExternalState,
    cashUpExternalState: state.cashUpExternalState,
  }
};

interface PriorWeekOverviewDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: PriorWeekOverviewOwnProps): PriorWeekOverviewDispatchProps => {
  return {};
};

type PriorWeekOverviewProps = PriorWeekOverviewOwnProps & PriorWeekOverviewStateProps & PriorWeekOverviewDispatchProps;

class PriorWeekOverviewComponent extends React.Component<PriorWeekOverviewProps, {}> {
  public render() {
    if (!this.props.rotaExternalState.isLoaded() && !this.props.cashUpExternalState.isLoaded()) {
      return null;
    }
    const startOfPriorWeek = this.props.dayInPriorWeek.clone().startOf('isoWeek');
    const dailyOverviews = new DailyOverviews(startOfPriorWeek, this.props.rotaExternalState.rotasForWeek, this.props.cashUpExternalState.cashUpsForWeek);
    if (dailyOverviews.overviews.length === 0) {
      return (
        <div className="prior-week-overview">
          <div className="prior-week-title">{this.props.title}</div>
          <div className="weekly-overview">No data for this week</div>
        </div>
      )
    }
    return (
      <div className="prior-week-overview">
        <div className="prior-week-title">{this.props.title}</div>
        <div className="weekly-overview">
          <SummaryOverview dailyOverviews={dailyOverviews} options={{status:false, constants:false, notes: true}} />
          <RevenueOverview dailyOverviews={dailyOverviews} />
          <LabourCostOverview dailyOverviews={dailyOverviews} />
          <LabourRateOverview dailyOverviews={dailyOverviews} />
        </div>
      </div>
    )
  }
}

export const PriorWeekOverview = connect<PriorWeekOverviewStateProps, PriorWeekOverviewDispatchProps, PriorWeekOverviewOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(PriorWeekOverviewComponent);