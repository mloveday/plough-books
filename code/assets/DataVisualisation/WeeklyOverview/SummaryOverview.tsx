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
    return (
      <div className="overview-rota-group">
        <div className="overview-stat-title">Date</div>
        <div className="overview-stat week-total">Week totals</div>
        {dailyOverviews.overviews.map((overview, key) => (
          <div className="overview-stat" key={key}>{overview.date.format(DateFormats.READABLE_NO_YEAR)}</div>
        ))}
        {this.props.options.status && <div className="overview-stat-title">Status</div>}
        {this.props.options.status && <div className="overview-stat"/>}
        {this.props.options.status && dailyOverviews.overviews.map((overview, key) => (
          <div className="overview-stat" key={key}>{overview.rota.getReadableStatus()}</div>
        ))}
        {this.props.options.constants && <div className="overview-stat-title">Constants from date</div>}
        {this.props.options.constants && <div className="overview-stat"/>}
        {this.props.options.constants && dailyOverviews.overviews.map((overview, key) => (
          <ConstantsWithHover constants={overview.rota.constants} key={key} />
        ))}
        {this.props.options.notes && <div className="overview-stat-title">Notes</div>}
        {this.props.options.notes && <div className="overview-stat"/>}
        {this.props.options.notes && dailyOverviews.overviews.map((overview, key) => (
          <div className="overview-stat notes" key={key}>{overview.cashUp.dailyNotes.toUpperCase()}</div>
        ))}
      </div>
    )
  }
}

export const SummaryOverview = connect<SummaryOverviewStateProps, SummaryOverviewDispatchProps, SummaryOverviewOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(SummaryOverviewComponent);