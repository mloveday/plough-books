import * as React from "react";
import {connect} from "react-redux";
import {WorkTypes} from "../../Enum/WorkTypes";
import {AppState} from "../../redux";
import {CostsCompare} from "../ForecastVsActual/CostsCompare";
import {DailyOverviews} from "./State/DailyOverviews";

interface LabourCostOverviewOwnProps {
  dailyOverviews: DailyOverviews;
}

interface LabourCostOverviewStateProps {
}

const mapStateToProps = (state: AppState, ownProps: LabourCostOverviewOwnProps): LabourCostOverviewStateProps => {
  return {}
};

interface LabourCostOverviewDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: LabourCostOverviewOwnProps): LabourCostOverviewDispatchProps => {
  return {};
};

type LabourCostOverviewProps = LabourCostOverviewOwnProps & LabourCostOverviewStateProps & LabourCostOverviewDispatchProps;

class LabourCostOverviewComponent extends React.Component<LabourCostOverviewProps, {}> {
  public render() {
    return (
      <div className="overview-rota-group">
        <div className="overview-stat-title">Bar wage cost</div>
        <div className="overview-stat"><CostsCompare label="Bar costs" showLabel={false} forecast={this.props.dailyOverviews.forecastBarLabour} actual={this.props.dailyOverviews.actualBarLabour} /></div>
        {this.props.dailyOverviews.overviews.map((overview, key) => (
          <CostsCompare key={key} label="Bar labour cost" showLabel={false}
                        forecast={overview.rota.getTotalPredictedLabourCost(this.props.dailyOverviews.forecastRevenue, WorkTypes.BAR)}
                        actual={overview.rota.getTotalActualLabourCost(overview.cashUp.getTotalRevenue(), this.props.dailyOverviews.actualRevenue, WorkTypes.BAR)} />
        ))}
        <div className="overview-stat-title">Kitchen wage cost</div>
        <div className="overview-stat"><CostsCompare label="Kitchen costs" showLabel={false} forecast={this.props.dailyOverviews.forecastKitchenLabour} actual={this.props.dailyOverviews.actualKitchenLabour} /></div>
        {this.props.dailyOverviews.overviews.map((overview, key) => (
          <CostsCompare key={key} label="Kitchen labour cost" showLabel={false}
                        forecast={overview.rota.getTotalPredictedLabourCost(this.props.dailyOverviews.forecastRevenue, WorkTypes.KITCHEN)}
                        actual={overview.rota.getTotalActualLabourCost(overview.cashUp.getTotalRevenue(), this.props.dailyOverviews.actualRevenue, WorkTypes.KITCHEN)} />
        ))}
      </div>
    )
  }
}

export const LabourCostOverview = connect<LabourCostOverviewStateProps, LabourCostOverviewDispatchProps, LabourCostOverviewOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(LabourCostOverviewComponent);