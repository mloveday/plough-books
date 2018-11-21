import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {AppState} from "../redux";
import {accountingWeek, accountingYearString} from "../Util/DateUtils";
import './DatePicker.css';

interface DatePickerOwnProps {
  dateParam: string;
  urlFromDate: (date: moment.Moment) => string;
}

interface DatePickerStateProps {
}

const mapStateToProps = (state: AppState, ownProps: DatePickerOwnProps): DatePickerStateProps => {
  return {
  }
};

interface DatePickerDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: DatePickerOwnProps): DatePickerDispatchProps => {
  return {};
};

type DatePickerProps = DatePickerOwnProps & DatePickerStateProps & DatePickerDispatchProps;

class DatePickerComponent extends React.Component<DatePickerProps, {}> {
  public render() {
    const selectedDate = moment(this.props.dateParam);
    const startOfWeek = selectedDate.clone().startOf('isoWeek');
    const daysOfTheWeek = [
      startOfWeek.clone(),
      startOfWeek.clone().add(1, "days"),
      startOfWeek.clone().add(2, "days"),
      startOfWeek.clone().add(3, "days"),
      startOfWeek.clone().add(4, "days"),
      startOfWeek.clone().add(5, "days"),
      startOfWeek.clone().add(6, "days"),
    ];
    return (
      <div className="date-picker">
        <h3 className="date-week-number">{accountingYearString(startOfWeek)} Week {accountingWeek(startOfWeek)}</h3>
        <ul className="date-list">
          <li className="date-list-item"><Link to={this.props.urlFromDate(selectedDate.clone().subtract(1, 'week'))}>&lt;</Link></li>
          {daysOfTheWeek.map((dayOfWeek, index) => {
            return <li key={index} className={"date-list-item" + (dayOfWeek.isSame(this.props.dateParam,'day') ? " selected" : "")}>
              <Link className="date-link" to={this.props.urlFromDate(dayOfWeek)}>{dayOfWeek.format('dddd D MMM')}</Link>
            </li>
          })}
          <li className="date-list-item"><Link to={this.props.urlFromDate(selectedDate.clone().add(1, 'week'))}>&gt;</Link></li>
        </ul>
      </div>
    )
  }
}

export const DatePicker = connect<DatePickerStateProps, DatePickerDispatchProps, DatePickerOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(DatePickerComponent);
