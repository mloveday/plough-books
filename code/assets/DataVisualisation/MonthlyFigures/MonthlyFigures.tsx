import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {CashUpEntity} from "../../Model/CashUp/CashUpEntity";
import {Constants} from "../../Model/Constants/Constants";
import {AppState} from "../../redux";
import {CashUpExternalState} from "../../Redux/CashUp/CashUpExternalState";
import {cashUpRangeFetch} from "../../Redux/CashUp/CashUpRedux";
import {ConstantsExternalState} from "../../Redux/Constants/ConstantsExternalState";
import {constantsFetch} from "../../Redux/Constants/ConstantsRedux";
import {CashManipulation} from "../../Util/CashManipulation";
import {DateFormats} from "../../Util/DateFormats";
import {momentFromDate} from "../../Util/DateUtils";
import {Formatting} from "../../Util/Formatting";
import './MonthlyFigures.scss';

interface MonthlyFiguresOwnProps {
}

interface MonthlyFiguresStateProps {
  cashUps: CashUpEntity[];
  cashUpState: CashUpExternalState;
  constantsState: ConstantsExternalState;
}

const mapStateToProps = (state: AppState, ownProps: MonthlyFiguresOwnProps): MonthlyFiguresStateProps => {
  return {
    cashUps: state.cashUpLocalStates.cashUps,
    cashUpState: state.cashUpExternalState,
    constantsState: state.constantsExternalState,
  }
};

interface MonthlyFiguresDispatchProps {
  fetchCashUpForDate: (startDate: moment.Moment, endDate: moment.Moment) => void;
  fetchConstants: () => void;
}

const mapDispatchToProps = (dispatch: any, ownProps: MonthlyFiguresOwnProps): MonthlyFiguresDispatchProps => {
  return {
    fetchCashUpForDate: (startDate: moment.Moment, endDate: moment.Moment) => dispatch(cashUpRangeFetch(startDate, endDate)),
    fetchConstants: () => dispatch(constantsFetch()),
  };
};

type MonthlyFiguresProps = MonthlyFiguresOwnProps & MonthlyFiguresStateProps & MonthlyFiguresDispatchProps;

class MonthlyFiguresComponent extends React.Component<MonthlyFiguresProps, {}> {

  public componentDidMount() {
    this.maintainStateWithUrl();
  }

  public componentDidUpdate() {
    this.maintainStateWithUrl();
  }

  public render() {
    if (!this.shouldRender()) {
      return null;
    }
    const startDate = momentFromDate('2019-03-01');
    const endDate = momentFromDate('2019-04-26');
    const cashUps = this.props.cashUps.filter(cashUp => momentFromDate(cashUp.date).isBetween(startDate, endDate));
    const days = [];
    const numberOfDays = Math.abs(startDate.diff(endDate, 'days'));
    for (let i=0; i<numberOfDays; i++) {
      days.push(startDate.clone().add(i, 'days'));
    }
    const vatMultiplierFor = (cashUp: CashUpEntity): number => {
      const constants = this.props.constantsState.externalState.entities;
      const olderConstants = constants
        .sort((a,b) => a.date > b.date ? -1 : 1)
        .filter(constant => constant.date <= cashUp.date);
      const topConstants = olderConstants.pop();
      if (topConstants !== undefined) {
        return topConstants.vatMultiplier;
      }
      const someConstants = olderConstants.pop();
      if (someConstants !== undefined) {
        return someConstants.vatMultiplier;
      }
      return Constants.default().vatMultiplier;
    };

    const netFigure = (figure: number, cashUp: CashUpEntity) => CashManipulation.calculateVatAdjustedRevenue(figure, vatMultiplierFor(cashUp));
    return (
      <div className={`monthly-figures`}>
        <div>
          <label>Start date</label>
          <input disabled={true} type={'date'} value={startDate.format(DateFormats.API_DATE)}/>
        </div>
        <div>
          <label>End date</label>
          <input disabled={true} type={'date'} value={endDate.format(DateFormats.API_DATE)}/>
        </div>
        <table>
          <thead><tr>
            <td>Date</td>
            <td>Gross sales</td>
            <td>Wet</td>
            <td>Dry</td>
            <td>Hot</td>
            <td>+/-</td>
            <td>Gift card</td>
            <td>Paypal</td>
            <td>Deliveroo</td>
            <td>Dep. paid</td>
            <td>Dep. redeemed</td>
            <td>Charge to acc</td>
            <td>Amex</td>
            <td>WorldPay</td>
          </tr></thead>
          <tbody>
          {days.map(day => {
            const cashUp = cashUps.find(c => c.date === day.format(DateFormats.API_DATE));
            if (cashUp === undefined) {
              return (
                <tr key={day.format(DateFormats.API_DATE)}>
                  <td>{day.format(DateFormats.READABLE_NO_YEAR)}</td>
                </tr>
              );
            }
            return <tr key={cashUp.date}>
              <td>{momentFromDate(cashUp.date).format(DateFormats.READABLE_NO_YEAR)}</td>
              <td>{Formatting.formatCashForDisplay(cashUp.getTotalRevenue())}</td>
              <td>{Formatting.formatCashForDisplay(cashUp.getTotalRevenue() - cashUp.takeDry - cashUp.takeCoffee)}</td>
              <td>{Formatting.formatCashForDisplay(cashUp.takeDry)}</td>
              <td>{Formatting.formatCashForDisplay(cashUp.takeCoffee)}</td>
              <td>{Formatting.formatCashForDisplay(cashUp.getZReadVariance())}</td>
              <td>{Formatting.formatCashForDisplay(cashUp.takeGiftCard)}</td>
              <td>{Formatting.formatCashForDisplay(cashUp.paypal)}</td>
              <td>{Formatting.formatCashForDisplay(cashUp.deliveroo)}</td>
              <td>{Formatting.formatCashForDisplay(cashUp.takeDepositPaid)}</td>
              <td>{Formatting.formatCashForDisplay(cashUp.depositRedeemed)}</td>
              <td>{Formatting.formatCashForDisplay(cashUp.chargeToAccount)}</td>
              <td>{Formatting.formatCashForDisplay(cashUp.amexTots)}</td>
              <td>{Formatting.formatCashForDisplay(cashUp.visaMcTots)}</td>
            </tr>
          })}
          <tr/>
          <tr>
            <td>Gross total</td>
            <td>{Formatting.formatCashForDisplay(cashUps.reduce((prev, curr) => prev + curr.getTotalRevenue(), 0))}</td>
            <td>{Formatting.formatCashForDisplay(cashUps.reduce((prev, curr) => prev + curr.getTotalRevenue() - curr.takeDry - curr.takeCoffee, 0))}</td>
            <td>{Formatting.formatCashForDisplay(cashUps.reduce((prev, curr) => prev + curr.takeDry, 0))}</td>
            <td>{Formatting.formatCashForDisplay(cashUps.reduce((prev, curr) => prev + curr.takeCoffee, 0))}</td>
            <td>{Formatting.formatCashForDisplay(cashUps.reduce((prev, curr) => prev + curr.getZReadVariance(), 0))}</td>
            <td>{Formatting.formatCashForDisplay(cashUps.reduce((prev, curr) => prev + curr.takeGiftCard, 0))}</td>
            <td>{Formatting.formatCashForDisplay(cashUps.reduce((prev, curr) => prev + curr.paypal, 0))}</td>
            <td>{Formatting.formatCashForDisplay(cashUps.reduce((prev, curr) => prev + curr.deliveroo, 0))}</td>
            <td>{Formatting.formatCashForDisplay(cashUps.reduce((prev, curr) => prev + curr.takeDepositPaid, 0))}</td>
            <td>{Formatting.formatCashForDisplay(cashUps.reduce((prev, curr) => prev + curr.depositRedeemed, 0))}</td>
            <td>{Formatting.formatCashForDisplay(cashUps.reduce((prev, curr) => prev + curr.chargeToAccount, 0))}</td>
            <td>{Formatting.formatCashForDisplay(cashUps.reduce((prev, curr) => prev + curr.amexTots, 0))}</td>
            <td>{Formatting.formatCashForDisplay(cashUps.reduce((prev, curr) => prev + curr.visaMcTots, 0))}</td>
          </tr>
          <tr>
            <td>Net total</td>
            <td>{Formatting.formatCashForDisplay(cashUps.reduce((prev, curr) => prev + netFigure(curr.getTotalRevenue(), curr), 0))}</td>
            <td>{Formatting.formatCashForDisplay(cashUps.reduce((prev, curr) => prev + netFigure(curr.getTotalRevenue() - curr.takeDry - curr.takeCoffee, curr), 0))}</td>
            <td>{Formatting.formatCashForDisplay(cashUps.reduce((prev, curr) => prev + netFigure(curr.takeDry, curr), 0))}</td>
            <td>{Formatting.formatCashForDisplay(cashUps.reduce((prev, curr) => prev + netFigure(curr.takeCoffee, curr), 0))}</td>
            <td>{Formatting.formatCashForDisplay(cashUps.reduce((prev, curr) => prev + netFigure(curr.getZReadVariance(), curr), 0))}</td>
            <td>{Formatting.formatCashForDisplay(cashUps.reduce((prev, curr) => prev + netFigure(curr.takeGiftCard, curr), 0))}</td>
            <td>{Formatting.formatCashForDisplay(cashUps.reduce((prev, curr) => prev + netFigure(curr.paypal, curr), 0))}</td>
            <td>{Formatting.formatCashForDisplay(cashUps.reduce((prev, curr) => prev + netFigure(curr.deliveroo, curr), 0))}</td>
            <td>{Formatting.formatCashForDisplay(cashUps.reduce((prev, curr) => prev + netFigure(curr.takeDepositPaid, curr), 0))}</td>
            <td>{Formatting.formatCashForDisplay(cashUps.reduce((prev, curr) => prev + netFigure(curr.depositRedeemed, curr), 0))}</td>
            <td>{Formatting.formatCashForDisplay(cashUps.reduce((prev, curr) => prev + netFigure(curr.chargeToAccount, curr), 0))}</td>
            <td>{Formatting.formatCashForDisplay(cashUps.reduce((prev, curr) => prev + netFigure(curr.amexTots, curr), 0))}</td>
            <td>{Formatting.formatCashForDisplay(cashUps.reduce((prev, curr) => prev + netFigure(curr.visaMcTots, curr), 0))}</td>
          </tr>
          </tbody>
        </table>
      </div>
    )
  }

  private shouldRender() {
    return this.props.constantsState.isLoaded() && this.props.cashUpState.isLoaded();
  }

  private maintainStateWithUrl() {
    if (this.props.constantsState.isEmpty()) {
      this.props.fetchConstants();
      return;
    }

    const startDate = moment.utc('2019-03-01');
    const endDate = moment.utc('2019-04-26');
    if (this.props.cashUpState.isEmpty()
      || (this.props.cashUpState.cashUpsForWeek && this.props.cashUpState.isLoaded() && this.props.cashUpState.shouldLoadForDate(startDate))
    ) {
      this.props.fetchCashUpForDate(startDate, endDate);
      return;
    }
  }
}

export const MonthlyFigures = connect<MonthlyFiguresStateProps, MonthlyFiguresDispatchProps, MonthlyFiguresOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(MonthlyFiguresComponent);