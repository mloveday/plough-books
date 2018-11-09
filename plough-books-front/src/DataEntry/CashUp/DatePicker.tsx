import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {AppState} from "../../redux";
import {Routes} from "../../Routing/Routes";
import {accountingWeek, accountingYearString} from "../../Util/DateUtils";

interface DatePickerOwnProps {
  dateParam: string;
}

interface DatePickerStateProps {
  date: moment.Moment;
}

const mapStateToProps = (state: AppState, ownProps: DatePickerOwnProps): DatePickerStateProps => {
  return {
    date: state.cashUpLocalState.date,
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
    const startOfWeek = this.props.date.clone().startOf('isoWeek');
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
        <h3 className="date-week-number">{accountingYearString(startOfWeek)} Week {accountingWeek(startOfWeek)} cash up</h3>
        <ul className="date-list">
          <li className="date-list-item">&lt;</li>
          {daysOfTheWeek.map((dayOfWeek, index) => {
            return <li key={index} className={"date-list-item" + (dayOfWeek.isSame(this.props.dateParam,'day') ? " selected" : "")}><Link to={Routes.cashUpUrl(dayOfWeek)}>{dayOfWeek.format('dddd D MMM')}</Link></li>
          })}
          <li className="date-list-item">&gt;</li>
        </ul>
      </div>
    )
  }
}

export const DatePicker = connect<DatePickerStateProps, DatePickerDispatchProps, DatePickerOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(DatePickerComponent);
