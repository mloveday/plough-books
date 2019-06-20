import * as React from "react";
import {connect} from "react-redux";
import {WorkTypes} from "../../../Model/Enum/WorkTypes";
import {AppState} from "../../../redux";
import {HoursCompare} from "../../ForecastVsActual/HoursCompare";
import {DailyOverviews} from "../State/DailyOverviews";

interface LabourHoursOverviewOwnProps {
  dailyOverviews: DailyOverviews;
}

interface LabourHoursOverviewStateProps {
}

const mapStateToProps = (state: AppState, ownProps: LabourHoursOverviewOwnProps): LabourHoursOverviewStateProps => {
  return {}
};

interface LabourHoursOverviewDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: LabourHoursOverviewOwnProps): LabourHoursOverviewDispatchProps => {
  return {};
};

type LabourHoursOverviewProps = LabourHoursOverviewOwnProps & LabourHoursOverviewStateProps & LabourHoursOverviewDispatchProps;

class LabourHoursOverviewComponent extends React.Component<LabourHoursOverviewProps, {}> {
  public render() {
    const dailyOverviews = this.props.dailyOverviews;
    return (
      [
        <tr key={0}><td colSpan={9} className="spacer-row"/></tr>,
        <tr key={1}>
          <td className="overview-stat-title">Bar hours</td>
          <td className="overview-stat week-total">
            <HoursCompare label="Bar hours total" showLabel={false}
                          forecast={dailyOverviews.forecastBarHours}
                          actual={dailyOverviews.actualBarHours}/>
          </td>
          {dailyOverviews.overviews.map((overview, key) => (
            <td className="overview-stat" key={key}>
              <HoursCompare label="Bar hours" showLabel={false}
                            forecast={overview.rota.getTotalPlannedHoursOfType(WorkTypes.BAR)}
                            actual={overview.rota.getTotalActualHoursOfType(WorkTypes.BAR)}/>
            </td>
          ))}
        </tr>,
        <tr key={2}>
          <td className="overview-stat-title">Kitchen hours</td>
          <td className="overview-stat week-total">
            <HoursCompare label="Kitchen costs total" showLabel={false}
                          forecast={dailyOverviews.forecastKitchenHours}
                          actual={dailyOverviews.actualKitchenHours}/>
          </td>
          {dailyOverviews.overviews.map((overview, key) => (
            <td className="overview-stat" key={key}>
              <HoursCompare label="Kitchen hours" showLabel={false}
                            forecast={overview.rota.getTotalPlannedHoursOfType(WorkTypes.KITCHEN)}
                            actual={overview.rota.getTotalActualHoursOfType(WorkTypes.KITCHEN)}/>
            </td>
          ))}
        </tr>,
        <tr key={3}>
          <td className="overview-stat-title">Ancillary hours</td>
          <td className="overview-stat week-total">
            <HoursCompare label="Ancillary hours total" showLabel={false}
                          forecast={dailyOverviews.forecastAncillaryHours}
                          actual={dailyOverviews.actualAncillaryHours}/>
          </td>
          {dailyOverviews.overviews.map((overview, key) => (
            <td className="overview-stat" key={key}>
              <HoursCompare label="Ancillary hours" showLabel={false}
                            forecast={overview.rota.getTotalPlannedHoursOfType(WorkTypes.ANCILLARY)}
                            actual={overview.rota.getTotalActualHoursOfType(WorkTypes.ANCILLARY)}/>
            </td>
          ))}
        </tr>,
      ]
    )
  }
}

export const LabourHoursOverview = connect<LabourHoursOverviewStateProps, LabourHoursOverviewDispatchProps, LabourHoursOverviewOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(LabourHoursOverviewComponent);