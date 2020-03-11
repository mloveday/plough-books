import * as React from "react";
import {connect} from "react-redux";
import {WorkTypes} from "../../../Model/Enum/WorkTypes";
import {AppState} from "../../../redux";
import {CostRateCompare} from "../../ForecastVsActual/CostRateCompare";
import {DailyOverviews} from "../State/DailyOverviews";

interface LabourRateOverviewOwnProps {
  dailyOverviews: DailyOverviews;
}

interface LabourRateOverviewStateProps {
}

const mapStateToProps = (state: AppState, ownProps: LabourRateOverviewOwnProps): LabourRateOverviewStateProps => {
  return {}
};

interface LabourRateOverviewDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: LabourRateOverviewOwnProps): LabourRateOverviewDispatchProps => {
  return {};
};

type LabourRateOverviewProps = LabourRateOverviewOwnProps & LabourRateOverviewStateProps & LabourRateOverviewDispatchProps;

class LabourRateOverviewComponent extends React.Component<LabourRateOverviewProps, {}> {
  public render() {
    const dailyOverviews = this.props.dailyOverviews;
    return (
      [
        <tr key={0}><td colSpan={9} className="spacer-row"/></tr>,
        <tr key={1}>
          <td className="overview-stat-title">Labour rate</td>
          <td className="overview-stat week-total"><CostRateCompare label="Combined labour rate" showLabel={false} forecast={dailyOverviews.getCombinedForecastLabourRate()} actual={dailyOverviews.getCombinedActualLabourRate()} /></td>
          {dailyOverviews.overviews.map((overview, key) => (
            <td className="overview-stat" key={key}>
              <CostRateCompare label="Combined labour rate" showLabel={false}
                               forecast={overview.rota.targetLabourRate}
                               actual={overview.rota.getCombinedActualLabourRate(overview.cashUp.getTotalRevenue(), dailyOverviews.actualRevenue, overview.getActualWeeklyGrossPayForUser)} />
            </td>
          ))}
        </tr>,
        <tr key={2}>
          <td className="overview-stat-title">Running Labour rate</td>
          <td className="overview-stat week-total"><CostRateCompare label="Running labour rate" showLabel={false} forecast={dailyOverviews.getCombinedForecastLabourRate()} actual={dailyOverviews.getCombinedRunningLabourRate()} /></td>
          {dailyOverviews.overviews.map((overview, key) => (
            <td className="overview-stat" key={key}>
              <CostRateCompare label="Running labour rate" showLabel={false}
                               forecast={overview.rota.getCombinedPredictedLabourRate(dailyOverviews.runningRevenueForecast, overview.getRunningWeeklyGrossPayForUser)}
                               actual={overview.rota.getCombinedRunningLabourRate(overview.cashUp.getTotalRevenue() === 0 ? overview.rota.forecastRevenue : overview.cashUp.getTotalRevenue(), dailyOverviews.runningRevenueForecast, overview.getRunningWeeklyGrossPayForUser)} />
            </td>
          ))}
        </tr>,
        <tr key={3}>
          <td className="overview-stat-title">Bar labour rate</td>
          <td className="overview-stat week-total"><CostRateCompare label="Bar labour rate" showLabel={false} forecast={dailyOverviews.getForecastBarLabourRate()} actual={dailyOverviews.getActualBarLabourRate()} /></td>
          {dailyOverviews.overviews.map((overview, key) => (
            <td key={key} className="overview-stat">
              <CostRateCompare label="Bar labour rate" showLabel={false}
                               forecast={overview.rota.getPredictedLabourRate(dailyOverviews.forecastRevenue, WorkTypes.BAR, overview.getActualWeeklyGrossPayForUser)}
                               actual={overview.rota.getActualLabourRate(overview.cashUp.getTotalRevenue(), dailyOverviews.actualRevenue, WorkTypes.BAR, overview.getActualWeeklyGrossPayForUser)} />
            </td>
          ))}
        </tr>,
        <tr key={4}>
          <td className="overview-stat-title">Kitchen labour rate</td>
          <td className="overview-stat week-total"><CostRateCompare label="Kitchen labour rate" showLabel={false} forecast={dailyOverviews.getForecastKitchenLabourRate()} actual={dailyOverviews.getActualKitchenLabourRate()} /></td>
          {dailyOverviews.overviews.map((overview, key) => (
            <td key={key} className="overview-stat">
              <CostRateCompare label="Kitchen labour rate" showLabel={false}
                               forecast={overview.rota.getPredictedLabourRate(dailyOverviews.forecastRevenue, WorkTypes.KITCHEN, overview.getActualWeeklyGrossPayForUser)}
                               actual={overview.rota.getActualLabourRate(overview.cashUp.getTotalRevenue(), dailyOverviews.actualRevenue, WorkTypes.KITCHEN, overview.getActualWeeklyGrossPayForUser)} />
            </td>
          ))}
        </tr>
      ]
    )
  }
}

export const LabourRateOverview = connect<LabourRateOverviewStateProps, LabourRateOverviewDispatchProps, LabourRateOverviewOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(LabourRateOverviewComponent);