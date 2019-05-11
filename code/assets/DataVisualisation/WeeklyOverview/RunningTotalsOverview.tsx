import * as React from "react";
import {connect} from "react-redux";
import {AppState} from "../../redux";
import {CostRateCompare} from "../ForecastVsActual/CostRateCompare";
import {CostsCompare} from "../ForecastVsActual/CostsCompare";
import {RevenueCompare} from "../ForecastVsActual/RevenueCompare";
import {DailyOverviews} from "./State/DailyOverviews";

interface RunningTotalsOverviewOwnProps {
  dailyOverviews: DailyOverviews;
}

interface RunningTotalsOverviewStateProps {
}

const mapStateToProps = (state: AppState, ownProps: RunningTotalsOverviewOwnProps): RunningTotalsOverviewStateProps => {
  return {}
};

interface RunningTotalsOverviewDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: RunningTotalsOverviewOwnProps): RunningTotalsOverviewDispatchProps => {
  return {};
};

type RunningTotalsOverviewProps = RunningTotalsOverviewOwnProps & RunningTotalsOverviewStateProps & RunningTotalsOverviewDispatchProps;

class RunningTotalsOverviewComponent extends React.Component<RunningTotalsOverviewProps, {}> {
  public render() {
    const dailyOverviews = this.props.dailyOverviews;
    return (
      <div className="overview-rota-group">
        <div className="overview-stat-title">Running Revenue</div>
        <div className="overview-stat week-total">
          <RevenueCompare label="Running revenue" showLabel={false}
                          forecast={dailyOverviews.forecastRevenue}
                          actual={dailyOverviews.runningRevenueForecast} />
        </div>
        {dailyOverviews.overviews.map((overview, key) => (
          <div key={key} className="overview-stat">
            <RevenueCompare label="Revenue" showLabel={false}
                            forecast={overview.rota.forecastRevenue}
                            actual={overview.getTotalRevenueOrForecast()} />
          </div>
        ))}

        <div className="overview-stat-title">Running Labour Cost</div>
        <div className="overview-stat week-total">
          <CostsCompare label="Running labour cost" showLabel={false}
                        forecast={dailyOverviews.getCombinedForecastLabour()}
                        actual={dailyOverviews.getCombinedRunningLabour()} />
        </div>
        {dailyOverviews.overviews.map((overview, key) => (
          <div className="overview-stat" key={key}>
            <CostsCompare label="Running labour cost" showLabel={false}
                             forecast={overview.rota.getCombinedTargetLabourCost()}
                             actual={overview.getRunningLabourCost(dailyOverviews.runningRevenueForecast)} />
          </div>
        ))}

        <div className="overview-stat-title">Running Labour Rate</div>
        <div className="overview-stat week-total">
          <CostRateCompare label="Running labour rate" showLabel={false}
                           forecast={dailyOverviews.getCombinedForecastLabourRate()}
                           actual={dailyOverviews.getCombinedRunningLabourRate()} />
        </div>
        {dailyOverviews.overviews.map((overview, key) => (
          <div className="overview-stat" key={key}>
            <CostRateCompare label="Running labour rate" showLabel={false}
                             forecast={overview.rota.getCombinedPredictedLabourRate(dailyOverviews.runningRevenueForecast)}
                             actual={overview.rota.getCombinedRunningLabourRate(overview.getRunningRevenue(), dailyOverviews.runningRevenueForecast)} />
          </div>
        ))}
      </div>
    )
  }
}

export const RunningTotalsOverview = connect<RunningTotalsOverviewStateProps, RunningTotalsOverviewDispatchProps, RunningTotalsOverviewOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(RunningTotalsOverviewComponent);