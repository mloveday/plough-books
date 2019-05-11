import * as React from "react";
import {connect} from "react-redux";
import {AppState} from "../../redux";
import {RevenueCompare} from "../ForecastVsActual/RevenueCompare";
import {DailyOverviews} from "./State/DailyOverviews";

interface RevenueOverviewOwnProps {
  dailyOverviews: DailyOverviews;
}

interface RevenueOverviewStateProps {
}

const mapStateToProps = (state: AppState, ownProps: RevenueOverviewOwnProps): RevenueOverviewStateProps => {
  return {}
};

interface RevenueOverviewDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: RevenueOverviewOwnProps): RevenueOverviewDispatchProps => {
  return {};
};

type RevenueOverviewProps = RevenueOverviewOwnProps & RevenueOverviewStateProps & RevenueOverviewDispatchProps;

class RevenueOverviewComponent extends React.Component<RevenueOverviewProps, {}> {
  public render() {
    const dailyOverviews = this.props.dailyOverviews;
    return (
      [
        <tr key={0}><td colSpan={9} className="spacer-row"/></tr>,
        <tr key={1}>
          <td className="overview-stat-title">Revenue</td>
          <td className="overview-stat week-total">
            <RevenueCompare label="Revenue" showLabel={false}
                            forecast={dailyOverviews.forecastRevenue}
                            actual={dailyOverviews.actualRevenue} />
          </td>
          {dailyOverviews.overviews.map((overview, key) => (
            <td key={key} className="overview-stat">
              <RevenueCompare label="Revenue" showLabel={false}
                              forecast={overview.rota.forecastRevenue}
                              actual={overview.cashUp.getTotalRevenue()} />
            </td>
          ))}
        </tr>,
        <tr key={2}>
          <td className="overview-stat-title">Running revenue</td>
          <td className="overview-stat week-total">
            <RevenueCompare label="Revenue or forecast" showLabel={false}
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
        </tr>
      ]
    )
  }
}

export const RevenueOverview = connect<RevenueOverviewStateProps, RevenueOverviewDispatchProps, RevenueOverviewOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(RevenueOverviewComponent);