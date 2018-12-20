import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {DailyOverviews} from "../../DataVisualisation/WeeklyOverview/State/DailyOverviews";
import {WorkTypes} from "../../Enum/WorkTypes";
import {AppState} from "../../redux";
import {DateFormats} from "../../Util/DateFormats";
import {CashUpExternalState} from "../CashUp/State/CashUpExternalState";
import {RotaExternalState} from "../Rota/State/RotaExternalState";

interface PriorWeekOverviewOwnProps {
  dayInPriorWeek: moment.Moment;
  title: string;
}

interface PriorWeekOverviewStateProps {
  rotaExternalState: RotaExternalState,
  cashUpExternalState: CashUpExternalState,
}

const mapStateToProps = (state: AppState, ownProps: PriorWeekOverviewOwnProps): PriorWeekOverviewStateProps => {
  return {
    rotaExternalState: state.rotaExternalState,
    cashUpExternalState: state.cashUpExternalState,
  }
};

interface PriorWeekOverviewDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: PriorWeekOverviewOwnProps): PriorWeekOverviewDispatchProps => {
  return {};
};

type PriorWeekOverviewProps = PriorWeekOverviewOwnProps & PriorWeekOverviewStateProps & PriorWeekOverviewDispatchProps;

class PriorWeekOverviewComponent extends React.Component<PriorWeekOverviewProps, {}> {
  public render() {
    if (!this.props.rotaExternalState.isLoaded() && !this.props.cashUpExternalState.isLoaded()) {
      return null;
    }
    const startOfPriorWeek = this.props.dayInPriorWeek.clone().startOf('isoWeek');
    const dailyOverviews = new DailyOverviews(startOfPriorWeek, this.props.rotaExternalState.rotasForWeek, this.props.cashUpExternalState.cashUpsForWeek);
    return (
      <div key={startOfPriorWeek.format(DateFormats.API)}>
        <div>{this.props.title}</div>
        <div className="weekly-overview">
          <div className="overview-stats">
            <div className="overview-stat">Forecast Bar costs: £{dailyOverviews.forecastBarLabour.toFixed(2)}</div>
            <div className="overview-stat">Actual Bar costs: £{dailyOverviews.actualBarLabour.toFixed(2)}</div>
            <div className="overview-stat">Forecast Kitchen costs: £{dailyOverviews.forecastKitchenLabour.toFixed(2)}</div>
            <div className="overview-stat">Actual Kitchen costs: £{dailyOverviews.actualKitchenLabour.toFixed(2)}</div>
          </div>
          <div className="overview-stats">
            <div className="overview-stat">Forecast combined costs: £{dailyOverviews.getForecastLabour().toFixed(2)}</div>
            <div className="overview-stat">Actual combined costs: £{dailyOverviews.getForecastLabour().toFixed(2)}</div>
          </div>
          <div className="overview-stats">
            <div className="overview-stat">Total forecast revenue: £{dailyOverviews.forecastRevenue.toFixed(2)}</div>
            <div className="overview-stat">Total actual revenue: £{dailyOverviews.actualRevenue.toFixed(2)}</div>
          </div>
          <div className="overview-stats">
            <div className="overview-stat">Target forecast labour rate: {(100*this.props.rotaExternalState.rotasForWeek.getTargetLabourRateForWeek(startOfPriorWeek)).toFixed(2)}%</div>
            <div className="overview-stat">Combined forecast labour rate: {(100*dailyOverviews.getCombinedForecastLabourRate()).toFixed(2)}%</div>
            <div className="overview-stat">Combined actual labour rate: {(100*dailyOverviews.getCombinedActualLabourRate()).toFixed(2)}%</div>
          </div>
          <div className="overview-rota-group">
            <div className="overview-stat-title">Date</div>
            {dailyOverviews.overviews.map((overview, key) => (
              <div className="overview-stat" key={key}>{overview.date.format(DateFormats.READABLE_NO_YEAR)}</div>
            ))}
            <div className="overview-stat-title">Notes</div>
            {dailyOverviews.overviews.map((overview, key) => (
              <div className="overview-stat notes" key={key}>{overview.cashUp.dailyNotes.toUpperCase()}</div>
            ))}
          </div>
          <div className="overview-rota-group">
            <div className="overview-stat-title">Forecast revenue</div>
            {dailyOverviews.overviews.map((overview, key) => (
              <div className="overview-stat" key={key}>£{overview.rota.forecastRevenue.toFixed(2)}</div>
            ))}
            <div className="overview-stat-title">Actual revenue</div>
            {dailyOverviews.overviews.map((overview, key) => (
              <div className="overview-stat" key={key}>£{overview.cashUp.getTotalRevenue().toFixed(2)}</div>
            ))}
          </div>
          <div className="overview-rota-group">
            <div className="overview-stat-title">Predicted Bar wage cost</div>
            {dailyOverviews.overviews.map((overview, key) => (
              <div className="overview-stat" key={key}>£{overview.rota.getTotalPredictedLabourCost(dailyOverviews.forecastRevenue, WorkTypes.BAR).toFixed(2)}</div>
            ))}
            <div className="overview-stat-title">Actual Bar wage cost</div>
            {dailyOverviews.overviews.map((overview, key) => (
              <div className="overview-stat" key={key}>£{overview.rota.getTotalActualLabourCost(overview.cashUp.getTotalRevenue(), dailyOverviews.actualRevenue, WorkTypes.BAR).toFixed(2)}</div>
            ))}
            <div className="overview-stat-title">Predicted Kitchen wage cost</div>
            {dailyOverviews.overviews.map((overview, key) => (
              <div className="overview-stat" key={key}>£{overview.rota.getTotalPredictedLabourCost(dailyOverviews.forecastRevenue, WorkTypes.KITCHEN).toFixed(2)}</div>
            ))}
            <div className="overview-stat-title">Actual Kitchen wage cost</div>
            {dailyOverviews.overviews.map((overview, key) => (
              <div className="overview-stat" key={key}>£{overview.rota.getTotalActualLabourCost(overview.cashUp.getTotalRevenue(), dailyOverviews.actualRevenue, WorkTypes.KITCHEN).toFixed(2)}</div>
            ))}
          </div>
          <div className="overview-rota-group">
            <div className="overview-stat-title">Target labour rate</div>
            {dailyOverviews.overviews.map((overview, key) => (
              <div className="overview-stat" key={key}>{(overview.rota.targetLabourRate * 100).toFixed(2)}%</div>
            ))}
            <div className="overview-stat-title">Predicted Bar labour rate</div>
            {dailyOverviews.overviews.map((overview, key) => (
              <div className="overview-stat" key={key}>{(overview.rota.getPredictedLabourRate(dailyOverviews.forecastRevenue, WorkTypes.BAR) * 100).toFixed(2)}%</div>
            ))}
            <div className="overview-stat-title">Actual Bar labour rate</div>
            {dailyOverviews.overviews.map((overview, key) => (
              <div className="overview-stat" key={key}>{(overview.rota.getActualLabourRate(overview.cashUp.getTotalRevenue(), dailyOverviews.actualRevenue, WorkTypes.BAR) * 100).toFixed(2)}%</div>
            ))}
            <div className="overview-stat-title">Predicted Kitchen labour rate</div>
            {dailyOverviews.overviews.map((overview, key) => (
              <div className="overview-stat" key={key}>{(overview.rota.getPredictedLabourRate(dailyOverviews.forecastRevenue, WorkTypes.KITCHEN) * 100).toFixed(2)}%</div>
            ))}
            <div className="overview-stat-title">Actual Kitchen labour rate</div>
            {dailyOverviews.overviews.map((overview, key) => (
              <div className="overview-stat" key={key}>{(overview.rota.getActualLabourRate(overview.cashUp.getTotalRevenue(), dailyOverviews.actualRevenue, WorkTypes.KITCHEN) * 100).toFixed(2)}%</div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export const PriorWeekOverview = connect<PriorWeekOverviewStateProps, PriorWeekOverviewDispatchProps, PriorWeekOverviewOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(PriorWeekOverviewComponent);