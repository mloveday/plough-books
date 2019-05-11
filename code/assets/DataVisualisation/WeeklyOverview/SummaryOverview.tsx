import * as React from "react";
import {connect} from "react-redux";
import {AppState} from "../../redux";
import {DateFormats} from "../../Util/DateFormats";
import {ConstantsWithHover} from "../Constants/ConstantsWithHover";
import {DailyOverviews} from "./State/DailyOverviews";

interface SummaryOverviewOwnProps {
  dailyOverviews: DailyOverviews;
  options: {
    status: boolean,
    constants: boolean,
    notes: boolean,
  };
}

interface SummaryOverviewStateProps {
}

const mapStateToProps = (state: AppState, ownProps: SummaryOverviewOwnProps): SummaryOverviewStateProps => {
  return {}
};

interface SummaryOverviewDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: SummaryOverviewOwnProps): SummaryOverviewDispatchProps => {
  return {};
};

type SummaryOverviewProps = SummaryOverviewOwnProps & SummaryOverviewStateProps & SummaryOverviewDispatchProps;

class SummaryOverviewComponent extends React.Component<SummaryOverviewProps, {}> {
  public render() {
    const dailyOverviews = this.props.dailyOverviews;
    const options = this.props.options;
    return (
      [
        <tr key={1}>
          <th className="overview-stat-title">Date</th>
          <th className="overview-stat week-total" rowSpan={4}>Week totals</th>
          {dailyOverviews.overviews.map((overview, key) => (
            <th className="overview-stat" key={key}>{overview.date.format(DateFormats.READABLE_NO_YEAR)}</th>
          ))}
        </tr>,
        <tr key={2}>
          {options.status && <td className="overview-stat-title">Status</td>}
          {options.status && dailyOverviews.overviews.map((overview, key) => (
            <td className="overview-stat" key={key}>{overview.rota.getReadableStatus()}</td>
          ))}
        </tr>,
        <tr key={3}>
          {options.constants && <td className="overview-stat-title">Constants from date</td>}
          {options.constants && dailyOverviews.overviews.map((overview, key) => (
            <td className="overview-stat">
              <ConstantsWithHover constants={overview.rota.constants} key={key} />
            </td>
          ))}
        </tr>,
        <tr key={4}>
          {options.notes && <td className="overview-stat-title">Notes</td>}
          {options.notes && dailyOverviews.overviews.map((overview, key) => (
            <td className="overview-stat notes" key={key}>{overview.cashUp.dailyNotes.toUpperCase()}</td>
          ))}
        </tr>
      ]
    )
  }
}

export const SummaryOverview = connect<SummaryOverviewStateProps, SummaryOverviewDispatchProps, SummaryOverviewOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(SummaryOverviewComponent);