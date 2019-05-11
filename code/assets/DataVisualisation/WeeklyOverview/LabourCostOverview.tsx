import * as React from "react";
import {connect} from "react-redux";
import {WorkTypes} from "../../Model/Enum/WorkTypes";
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
    const dailyOverviews = this.props.dailyOverviews;
    return (
      [
        <tr key={0}><td colSpan={9} className="spacer-row"/></tr>,
        <tr key={1}>
          <td className="overview-stat-title">Bar wage cost</td>
          <td className="overview-stat week-total">
            <CostsCompare label="Bar costs" showLabel={false}
                          forecast={dailyOverviews.forecastBarLabour}
                          actual={dailyOverviews.actualBarLabour}/>
          </td>
          {dailyOverviews.overviews.map((overview, key) => (
            <td className="overview-stat">
              <CostsCompare key={key} label="Bar labour cost" showLabel={false}
                            forecast={overview.rota.getTotalPredictedLabourCost(dailyOverviews.forecastRevenue, WorkTypes.BAR)}
                            actual={overview.rota.getTotalActualLabourCost(overview.cashUp.getTotalRevenue(), dailyOverviews.actualRevenue, WorkTypes.BAR)}/>
            </td>
          ))}
        </tr>,
        <tr key={2}>
          <td className="overview-stat-title">Kitchen wage cost</td>
          <td className="overview-stat week-total">
            <CostsCompare label="Kitchen costs" showLabel={false} forecast={dailyOverviews.forecastKitchenLabour}
                          actual={dailyOverviews.actualKitchenLabour}/>
          </td>
          {dailyOverviews.overviews.map((overview, key) => (
            <td className="overview-stat">
              <CostsCompare key={key} label="Kitchen labour cost" showLabel={false}
                            forecast={overview.rota.getTotalPredictedLabourCost(dailyOverviews.forecastRevenue, WorkTypes.KITCHEN)}
                            actual={overview.rota.getTotalActualLabourCost(overview.cashUp.getTotalRevenue(), dailyOverviews.actualRevenue, WorkTypes.KITCHEN)}/>
            </td>
          ))}
        </tr>,
        <tr key={3}>
          <td className="overview-stat-title">Ancillary wage cost</td>
          <td className="overview-stat week-total">
            <CostsCompare label="Ancillary costs" showLabel={false} forecast={dailyOverviews.forecastAncillaryLabour}
                          actual={dailyOverviews.actualAncillaryLabour}/>
          </td>
          {dailyOverviews.overviews.map((overview, key) => (
            <td className="overview-stat">
              <CostsCompare key={key} label="Ancillary labour cost" showLabel={false}
                            forecast={overview.rota.getTotalPredictedLabourCost(dailyOverviews.forecastRevenue, WorkTypes.ANCILLARY)}
                            actual={overview.rota.getTotalActualLabourCost(overview.cashUp.getTotalRevenue(), dailyOverviews.actualRevenue, WorkTypes.ANCILLARY)}/>
            </td>
          ))}
        </tr>,
      ]
    )
  }
}

export const LabourCostOverview = connect<LabourCostOverviewStateProps, LabourCostOverviewDispatchProps, LabourCostOverviewOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(LabourCostOverviewComponent);