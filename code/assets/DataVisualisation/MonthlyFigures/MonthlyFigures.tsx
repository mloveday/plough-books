import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {CashUpEntity} from "../../Model/CashUp/CashUpEntity";
import {AppState} from "../../redux";
import {CashUpExternalState} from "../../Redux/CashUp/CashUpExternalState";
import {cashUpRangeFetch} from "../../Redux/CashUp/CashUpRedux";
import {DateFormats} from "../../Util/DateFormats";

interface MonthlyFiguresOwnProps {
}

interface MonthlyFiguresStateProps {
  cashUps: CashUpEntity[];
  cashUpState: CashUpExternalState;
}

const mapStateToProps = (state: AppState, ownProps: MonthlyFiguresOwnProps): MonthlyFiguresStateProps => {
  return {
    cashUps: state.cashUpLocalStates.cashUps,
    cashUpState: state.cashUpExternalState,
  }
};

interface MonthlyFiguresDispatchProps {
  fetchCashUpForDate: (startDate: moment.Moment, endDate: moment.Moment) => void;
}

const mapDispatchToProps = (dispatch: any, ownProps: MonthlyFiguresOwnProps): MonthlyFiguresDispatchProps => {
  return {
    fetchCashUpForDate: (startDate: moment.Moment, endDate: moment.Moment) => dispatch(cashUpRangeFetch(startDate, endDate)),
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
    const startDate = moment.utc('2019-03-01');
    const endDate = moment.utc('2019-04-26');
    const cashUps = this.props.cashUps.filter(cashUp => moment.utc(cashUp.date).isBetween(startDate, endDate));
    const days = [];
    const numberOfDays = Math.abs(startDate.diff(endDate, 'days'));
    for (let i=0; i<numberOfDays; i++) {
      days.push(startDate.clone().add(i, 'days').format(DateFormats.API_DATE));
    }
    return (
      <div>
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
          </tr></thead>
          <tbody>
          {days.map(day => {
            const cashUp = cashUps.find(c => c.date === day);
            if (cashUp === undefined) {
              return (
                <tr key={day}>
                  <td>{day}</td>
                  <td>-</td>
                </tr>
              );
            }
            return <tr key={cashUp.date}>
              <td>{cashUp.date}</td>
              <td>{cashUp.getTotalRevenue()}</td>
              <td>{cashUp.getTotalRevenue() - cashUp.takeDry - cashUp.takeCoffee}</td>
              <td>{cashUp.takeDry}</td>
              <td>{cashUp.takeCoffee}</td>
              <td>{cashUp.getZReadVariance()}</td>
              <td>{cashUp.takeGiftCard}</td>
              <td>{cashUp.paypal}</td>
              <td>{cashUp.deliveroo}</td>
              <td>{cashUp.takeDepositPaid}</td>
              <td>{cashUp.depositRedeemed}</td>
              <td>{cashUp.chargeToAccount}</td>
            </tr>
          })}
          </tbody>
        </table>
      </div>
    )
  }

  private maintainStateWithUrl() {
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