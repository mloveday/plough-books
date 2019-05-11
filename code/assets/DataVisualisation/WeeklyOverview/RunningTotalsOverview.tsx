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
      [
        <tr key={0}><td colSpan={9} className="spacer-row"/></tr>,
        <tr key={1}>
          <td className="overview-stat-title">Running Revenue</td>
          <td className="overview-stat week-total">
            <RevenueCompare label="Running revenue" showLabel={false}
                            forecast={dailyOverviews.forecastRevenue}
                            actual={dailyOverviews.runningRevenueForecast} />
          </td>
          {dailyOverviews.overviews.map((overview, key) => (
            <td key={key} className="overview-stat">
              <RevenueCompare label="Revenue" showLabel={false}
                              forecast={overview.rota.forecastRevenue}
                              actual={overview.getTotalRevenueOrForecast()} />
            </td>
          ))}
        </tr>,
        <tr key={2}>
          <td className="overview-stat-title">Running Labour Cost</td>
          <td className="overview-stat week-total">
            <CostsCompare label="Running labour cost" showLabel={false}
                          forecast={dailyOverviews.getCombinedForecastLabour()}
                          actual={dailyOverviews.getCombinedRunningLabour()} />
          </td>
          {dailyOverviews.overviews.map((overview, key) => (
            <td className="overview-stat" key={key}>
              <CostsCompare label="Running labour cost" showLabel={false}
                               forecast={overview.rota.getCombinedTargetLabourCost()}
                               actual={overview.getRunningLabourCost(dailyOverviews.runningRevenueForecast)} />
            </td>
          ))}
        </tr>,
        <tr key={3}>
          <td className="overview-stat-title">Running Labour Rate</td>
          <td className="overview-stat week-total">
            <CostRateCompare label="Running labour rate" showLabel={false}
                             forecast={dailyOverviews.getCombinedForecastLabourRate()}
                             actual={dailyOverviews.getCombinedRunningLabourRate()} />
          </td>
          {dailyOverviews.overviews.map((overview, key) => (
            <td className="overview-stat" key={key}>
              <CostRateCompare label="Running labour rate" showLabel={false}
                               forecast={overview.rota.getCombinedPredictedLabourRate(dailyOverviews.runningRevenueForecast)}
                               actual={overview.rota.getCombinedRunningLabourRate(overview.getRunningRevenue(), dailyOverviews.runningRevenueForecast)} />
            </td>
          ))}
        </tr>,
      ]
    )
  }
}

export const RunningTotalsOverview = connect<RunningTotalsOverviewStateProps, RunningTotalsOverviewDispatchProps, RunningTotalsOverviewOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(RunningTotalsOverviewComponent);