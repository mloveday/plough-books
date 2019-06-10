import * as React from "react";
import {connect} from "react-redux";
import {AppState} from "../../../redux";
import {DateFormats} from "../../../Util/DateFormats";
import {ConstantsWithHover} from "../../Constants/ConstantsWithHover";
import {DailyOverviews} from "../State/DailyOverviews";

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
          {options.status && <td className="overview-stat-title">Status</td>}
          <td className={`overview-stat week-total`}/>
          {options.status && dailyOverviews.overviews.map(overview => (
            <td className="overview-stat" key={overview.date.format(DateFormats.API_DATE)}>{overview.rota.getReadableStatus()}</td>
          ))}
        </tr>,
        <tr key={2}>
          {options.constants && <td className="overview-stat-title">Constants from date</td>}
          <td className={`overview-stat week-total`}/>
          {options.constants && dailyOverviews.overviews.map(overview => (
            <td className="overview-stat" key={overview.date.format(DateFormats.API_DATE)}>
              <ConstantsWithHover constants={overview.rota.constants} />
            </td>
          ))}
        </tr>,
        <tr key={3}>
          {options.notes && <td className="overview-stat-title">Notes</td>}
          <td className={`overview-stat week-total`}/>
          {options.notes && dailyOverviews.overviews.map(overview => (
            <td className="overview-stat notes" key={overview.date.format(DateFormats.API_DATE)}>{overview.cashUp.dailyNotes.toUpperCase()}</td>
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