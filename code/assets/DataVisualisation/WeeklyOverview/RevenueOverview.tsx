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
    return (
      <div className="overview-rota-group">
        <div className="overview-stat-title">Revenue</div>
        <div className="overview-stat week-total"><RevenueCompare label="Revenue" showLabel={false} forecast={this.props.dailyOverviews.forecastRevenue} actual={this.props.dailyOverviews.actualRevenue} /></div>
        {this.props.dailyOverviews.overviews.map((overview, key) => (
          <div key={key} className="overview-stat">
            <RevenueCompare label="Revenue" showLabel={false} forecast={overview.rota.forecastRevenue} actual={overview.cashUp.getTotalRevenue()} />
          </div>
        ))}
        <div className="overview-stat-title">Running revenue</div>
        <div className="overview-stat week-total"><RevenueCompare label="Revenue or forecast" showLabel={false} forecast={this.props.dailyOverviews.forecastRevenue} actual={this.props.dailyOverviews.runningRevenueForecast} /></div>
        {this.props.dailyOverviews.overviews.map((overview, key) => (
          <div key={key} className="overview-stat">
            <RevenueCompare label="Revenue" showLabel={false} forecast={overview.rota.forecastRevenue} actual={overview.getTotalRevenueOrForecast()} />
          </div>
        ))}
      </div>
    )
  }
}

export const RevenueOverview = connect<RevenueOverviewStateProps, RevenueOverviewDispatchProps, RevenueOverviewOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(RevenueOverviewComponent);