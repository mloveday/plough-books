import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {AppState} from "../../redux";
import {DateFormats} from "../../Util/DateFormats";
import {accountingWeek, accountingYearString, momentFromDate} from "../../Util/DateUtils";
import './DatePicker.scss';

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
    const selectedDate = momentFromDate(this.props.dateParam);
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
          <li className="date-list-item">
            <Link className="date-link" to={this.props.urlFromDate(selectedDate.clone().subtract(1, 'week'))}><FontAwesomeIcon icon="chevron-left" /></Link>
          </li>
          {daysOfTheWeek.map((dayOfWeek, index) => {
            return <li key={index} className={"date-list-item" + (dayOfWeek.isSame(momentFromDate(this.props.dateParam),'day') ? " selected" : "")}>
              <Link className="date-link" to={this.props.urlFromDate(dayOfWeek.clone())}>{dayOfWeek.format(DateFormats.READABLE_NO_YEAR)}</Link>
            </li>
          })}
          <li className="date-list-item">
            <Link className="date-link" to={this.props.urlFromDate(selectedDate.clone().add(1, 'week'))}><FontAwesomeIcon icon="chevron-right" /></Link>
          </li>
        </ul>
      </div>
    )
  }
}

export const DatePicker = connect<DatePickerStateProps, DatePickerDispatchProps, DatePickerOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(DatePickerComponent);
