import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {AppState} from "../../redux";
import {DateFormats} from "../../Util/DateFormats";
import {accountingWeek, accountingYear, startOfWeek} from "../../Util/DateUtils";
import './WeekPicker.scss';

interface WeekPickerOwnProps {
  week: number;
  year: number;
  urlFromDate: (date: moment.Moment) => string;
}

interface WeekPickerStateProps {
}

const mapStateToProps = (state: AppState, ownProps: WeekPickerOwnProps): WeekPickerStateProps => {
  return {}
};

interface WeekPickerDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: WeekPickerOwnProps): WeekPickerDispatchProps => {
  return {};
};

type WeekPickerProps = WeekPickerOwnProps & WeekPickerStateProps & WeekPickerDispatchProps;

class WeekPickerComponent extends React.Component<WeekPickerProps, {}> {
  public render() {
    const selectedDate = startOfWeek(this.props.year, this.props.week);
    const otherWeeks = [
      selectedDate.clone().subtract(4, "weeks"),
      selectedDate.clone().subtract(3, "weeks"),
      selectedDate.clone().subtract(2, "weeks"),
      selectedDate.clone().subtract(1, "weeks"),
      selectedDate.clone(),
      selectedDate.clone().add(1, "weeks"),
      selectedDate.clone().add(2, "weeks"),
      selectedDate.clone().add(3, "weeks"),
      selectedDate.clone().add(4, "weeks"),
    ];
    return (
      <div className="week-picker">
        <h3 className="week-number">{this.props.year} Week {this.props.week}</h3>
        <ul className="week-list">
          <li className="week-list-item">
            <Link className="week-link prev-period" to={this.props.urlFromDate(selectedDate.clone().subtract(1, 'month'))}><FontAwesomeIcon icon="chevron-left" /></Link>
          </li>
          {otherWeeks.map((date, index) => {
            return <li key={index} className={`week-list-item ${(date.isSame(selectedDate, 'week') ? "selected" : "")}`}>
              <Link className="week-link this-period"
                    to={this.props.urlFromDate(date)}>{`${accountingYear(date)}-${accountingWeek(date)}`}<br/>{`(${date.format(DateFormats.DMY_SLASHES)})`}
              </Link>
            </li>
          })}
          <li className="week-list-item">
            <Link className="week-link next-period" to={this.props.urlFromDate(selectedDate.clone().add(1, 'month'))}><FontAwesomeIcon icon="chevron-right" /></Link>
          </li>
        </ul>
      </div>
    )
  }
}

export const WeekPicker = connect<WeekPickerStateProps, WeekPickerDispatchProps, WeekPickerOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(WeekPickerComponent);
