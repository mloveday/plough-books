import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {CostRateCompare} from "../../DataVisualisation/ForecastVsActual/CostRateCompare";
import {CostsCompare} from "../../DataVisualisation/ForecastVsActual/CostsCompare";
import {RevenueCompare} from "../../DataVisualisation/ForecastVsActual/RevenueCompare";
import {DailyOverviews} from "../../DataVisualisation/WeeklyOverview/State/DailyOverviews";
import {WorkTypes} from "../../Enum/WorkTypes";
import {AppState} from "../../redux";
import {DateFormats} from "../../Util/DateFormats";
import {CashUpExternalState} from "../CashUp/State/CashUpExternalState";
import {RotaExternalState} from "../Rota/State/RotaExternalState";
import "./PriorWeekOverview.scss";

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
    if (dailyOverviews.overviews.length === 0) {
      return (
        <div className="prior-week-overview">
          <div className="prior-week-title">{this.props.title}</div>
          <div className="weekly-overview">No data for this week</div>
        </div>
      )
    }
    return (
      <div className="prior-week-overview">
        <div className="prior-week-title">{this.props.title}</div>
        <div className="weekly-overview">
          <div className="overview-stats">
            <div className="overview-stat"><CostsCompare label="Bar costs" forecast={dailyOverviews.forecastBarLabour} actual={dailyOverviews.actualBarLabour} /></div>
            <div className="overview-stat"><CostsCompare label="Kitchen costs" forecast={dailyOverviews.forecastKitchenLabour} actual={dailyOverviews.actualKitchenLabour} /></div>
          </div>
          <div className="overview-stats">
            <div className="overview-stat"><CostsCompare label="Combined Labour" forecast={dailyOverviews.getForecastLabour()} actual={dailyOverviews.getActualLabour()} /></div>
          </div>
          <div className="overview-stats">
            <div className="overview-stat"><RevenueCompare label="Revenue" forecast={dailyOverviews.forecastRevenue} actual={dailyOverviews.actualRevenue} /></div>
          </div>
          <div className="overview-stats">
            <div className="overview-stat">Target forecast labour rate: {(100*this.props.rotaExternalState.rotasForWeek.getTargetLabourRateForWeek(startOfPriorWeek)).toFixed(2)}%</div>
            <div className="overview-stat"><CostRateCompare label="Combined labour" forecast={dailyOverviews.getCombinedForecastLabourRate()} actual={dailyOverviews.getCombinedActualLabourRate()} /></div>
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
            <div className="overview-stat-title">Revenue</div>
            {dailyOverviews.overviews.map((overview, key) => (
              <div className="overview-stat">
                <RevenueCompare key={key} label="Revenue" showLabel={false} forecast={overview.rota.forecastRevenue} actual={overview.cashUp.getTotalRevenue()} />
              </div>
            ))}
          </div>
          <div className="overview-rota-group">
            <div className="overview-stat-title">Bar labour cost</div>
            {dailyOverviews.overviews.map((overview, key) => (
              <div className="overview-stat">
                <CostsCompare key={key} label="Bar labour cost" showLabel={false}
                                forecast={overview.rota.getTotalPredictedLabourCost(dailyOverviews.forecastRevenue, WorkTypes.BAR)}
                                actual={overview.rota.getTotalActualLabourCost(overview.cashUp.getTotalRevenue(), dailyOverviews.actualRevenue, WorkTypes.BAR)} />
              </div>
            ))}
            <div className="overview-stat-title">Kitchen labour cost</div>
            {dailyOverviews.overviews.map((overview, key) => (
              <div className="overview-stat">
                <CostsCompare key={key} label="Kitchen labour cost" showLabel={false}
                              forecast={overview.rota.getTotalPredictedLabourCost(dailyOverviews.forecastRevenue, WorkTypes.KITCHEN)}
                              actual={overview.rota.getTotalActualLabourCost(overview.cashUp.getTotalRevenue(), dailyOverviews.actualRevenue, WorkTypes.KITCHEN)} />
              </div>
            ))}
          </div>
          <div className="overview-rota-group">
            <div className="overview-stat-title">Bar labour rate</div>
            {dailyOverviews.overviews.map((overview, key) => (
              <div className="overview-stat">
                <CostRateCompare key={key} label="Bar labour rate" showLabel={false}
                                 forecast={overview.rota.getPredictedLabourRate(dailyOverviews.forecastRevenue, WorkTypes.BAR)}
                                 actual={overview.rota.getActualLabourRate(overview.cashUp.getTotalRevenue(), dailyOverviews.actualRevenue, WorkTypes.BAR)} />
              </div>
            ))}
            <div className="overview-stat-title">Kitchen labour rate</div>
            {dailyOverviews.overviews.map((overview, key) => (
              <div className="overview-stat">
                <CostRateCompare key={key} label="Kitchen labour rate" showLabel={false}
                                 forecast={overview.rota.getPredictedLabourRate(dailyOverviews.forecastRevenue, WorkTypes.KITCHEN)}
                                 actual={overview.rota.getActualLabourRate(overview.cashUp.getTotalRevenue(), dailyOverviews.actualRevenue, WorkTypes.KITCHEN)} />
              </div>
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