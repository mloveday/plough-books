import * as React from "react";
import {connect} from "react-redux";
import {WorkTypes} from "../../Enum/WorkTypes";
import {AppState} from "../../redux";
import {CostRateCompare} from "../ForecastVsActual/CostRateCompare";
import {DailyOverviews} from "./State/DailyOverviews";

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
      <div className="overview-rota-group">
        <div className="overview-stat-title">Labour rate</div>
        <div className="overview-stat"><CostRateCompare label="Combined labour rate" showLabel={false} forecast={dailyOverviews.getCombinedForecastLabourRate()} actual={dailyOverviews.getCombinedActualLabourRate()} /></div>
        {dailyOverviews.overviews.map((overview, key) => (
          <div className="overview-stat" key={key}>
            <CostRateCompare label="Bar labour rate" showLabel={false}
                             forecast={overview.rota.targetLabourRate}
                             actual={overview.rota.getCombinedActualLabourRate(overview.cashUp.getTotalRevenue(), dailyOverviews.actualRevenue)} />
          </div>
        ))}
        <div className="overview-stat-title">Bar labour rate</div>
        <div className="overview-stat"><CostRateCompare label="Bar labour rate" showLabel={false} forecast={dailyOverviews.getForecastBarLabourRate()} actual={dailyOverviews.getActualBarLabourRate()} /></div>
        {dailyOverviews.overviews.map((overview, key) => (
          <div key={key} className="overview-stat">
            <CostRateCompare label="Bar labour rate" showLabel={false}
                             forecast={overview.rota.getPredictedLabourRate(dailyOverviews.forecastRevenue, WorkTypes.BAR)}
                             actual={overview.rota.getActualLabourRate(overview.cashUp.getTotalRevenue(), dailyOverviews.actualRevenue, WorkTypes.BAR)} />
          </div>
        ))}
        <div className="overview-stat-title">Kitchen labour rate</div>
        <div className="overview-stat"><CostRateCompare label="Kitchen labour rate" showLabel={false} forecast={dailyOverviews.getForecastKitchenLabourRate()} actual={dailyOverviews.getActualKitchenLabourRate()} /></div>
        {dailyOverviews.overviews.map((overview, key) => (
          <div key={key} className="overview-stat">
            <CostRateCompare label="Kitchen labour rate" showLabel={false}
                             forecast={overview.rota.getPredictedLabourRate(dailyOverviews.forecastRevenue, WorkTypes.KITCHEN)}
                             actual={overview.rota.getActualLabourRate(overview.cashUp.getTotalRevenue(), dailyOverviews.actualRevenue, WorkTypes.KITCHEN)} />
          </div>
        ))}
      </div>
    )
  }
}

export const LabourRateOverview = connect<LabourRateOverviewStateProps, LabourRateOverviewDispatchProps, LabourRateOverviewOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(LabourRateOverviewComponent);