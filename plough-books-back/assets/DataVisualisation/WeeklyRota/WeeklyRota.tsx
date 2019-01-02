import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {match} from "react-router";
import {RotaExternalState} from "../../DataEntry/Rota/State/RotaExternalState";
import {rotaFetch} from "../../DataEntry/Rota/State/RotaRedux";
import {StaffMember} from '../../DataEntry/Rota/State/StaffMember';
import {WorkTypes} from "../../Enum/WorkTypes";
import {AppState} from "../../redux";
import {uiUpdate} from "../../State/UiRedux";
import {UiState} from "../../State/UiState";
import {DateFormats} from "../../Util/DateFormats";
import {startOfWeek} from "../../Util/DateUtils";
import "./WeeklyRota.scss";

interface WeeklyRotaOwnProps {
  match: match<{
    weekNumber: string,
    year: string,
  }>;
}

interface WeeklyRotaStateProps {
  rotaExternalState: RotaExternalState;
  uiState: UiState;
}

const mapStateToProps = (state: AppState, ownProps: WeeklyRotaOwnProps): WeeklyRotaStateProps => {
  return {
    rotaExternalState: state.rotaExternalState,
    uiState: state.uiState,
  }
};

interface WeeklyRotaDispatchProps {
  fetchRotaForDate: (date: moment.Moment) => void,
  updateUi: (state: UiState) => void;
}

const mapDispatchToProps = (dispatch: any, ownProps: WeeklyRotaOwnProps): WeeklyRotaDispatchProps => {
  return {
    fetchRotaForDate: (date: moment.Moment) => dispatch(rotaFetch(date)),
    updateUi: (state: UiState) => dispatch(uiUpdate(state)),
  };
};

type WeeklyRotaProps = WeeklyRotaOwnProps & WeeklyRotaStateProps & WeeklyRotaDispatchProps;

class WeeklyRotaComponent extends React.Component<WeeklyRotaProps, {}> {
  public componentDidMount() {
    this.maintainStateWithUrl();
  }

  public componentDidUpdate() {
    this.maintainStateWithUrl();
  }

  public render() {
    const startOfThisWeek = this.getStartOfWeek();
    const allStaff = new Map<number, StaffMember>();
    this.props.rotaExternalState.rotasForWeek.getRotasForWeek(startOfThisWeek)
      .forEach(rota => rota.plannedShifts
        .forEach(shift => {
          if (!allStaff.has(shift.staffMember.id)) {
            allStaff.set(shift.staffMember.id, shift.staffMember);
          }
        })
      );
    const barStaff = Array.from(allStaff.values())
      .filter(staffMember => staffMember.role.type === WorkTypes.BAR)
      .sort((a,b) => a.role.orderInRota > b.role.orderInRota ? 1 : (a.name > b.name ? 1 : -1));
    const kitchenStaff = Array.from(allStaff.values())
      .filter(staffMember => staffMember.role.type === WorkTypes.KITCHEN);
    return (
      <div className="weekly-rota">
        <div>Weekly bar rota for week starting {this.getStartOfWeek().format(DateFormats.READABLE_WITH_YEAR)}</div>
        {this.props.rotaExternalState.isLoaded() &&
        <div className="rota-grid">
            <div className="rota-column">
                <div className="date-header"/>
              {barStaff.map((staffMember, key) => (
                <div key={key} className="staff-member">
                  <div className="date-header" />
                  <div className="shift-name">
                    <div>{staffMember.name}</div>
                  </div>
                </div>
              ))}
            </div>
          {this.props.rotaExternalState.rotasForWeek.getRotasForWeek(startOfThisWeek)
            .map((rota, key) => (
              <div key={key} className="rota-column">
                <div className="date-header">{rota.date.format(DateFormats.READABLE_NO_YEAR)}</div>
                {barStaff.map((staffMember, staffKey) => {
                    const shift = rota.plannedShifts.find(plannedShift => plannedShift.staffMember.id === staffMember.id);
                    return shift ? (<div key={staffKey} className="shift">
                      <div>{shift.startTime.format(DateFormats.TIME_LEADING_ZERO)}</div>
                      <div>{shift.endTime.format(DateFormats.TIME_LEADING_ZERO)}</div>
                      <div>{shift.totalBreaks * 30}</div>
                    </div>) : <div key={staffKey} className="shift"/>;
                  }
                )}
              </div>
            ))}
        </div>}
        <div>Weekly kitchen rota for week starting {this.getStartOfWeek().format(DateFormats.READABLE_WITH_YEAR)}</div>
        {this.props.rotaExternalState.isLoaded() &&
        <div className="rota-grid">
            <div className="rota-column">
                <div className="date-header"/>
              {kitchenStaff.map((staffMember, key) => (
                <div key={key} className="staff-member">
                  <div className="date-header" />
                  <div className="shift-name">
                    <div>{staffMember.name}</div>
                  </div>
                </div>
              ))}
            </div>
          {this.props.rotaExternalState.rotasForWeek.getRotasForWeek(startOfThisWeek)
            .map((rota, key) => (
              <div key={key} className="rota-column">
                <div className="date-header">{rota.date.format(DateFormats.READABLE_NO_YEAR)}</div>
                {kitchenStaff.map((staffMember, staffKey) => {
                    const shift = rota.plannedShifts.find(plannedShift => plannedShift.staffMember.id === staffMember.id);
                    return shift ? (<div key={staffKey} className="shift">
                      <div>{shift.startTime.format(DateFormats.TIME_LEADING_ZERO)}</div>
                      <div>{shift.endTime.format(DateFormats.TIME_LEADING_ZERO)}</div>
                      <div>{shift.totalBreaks * 30}</div>
                    </div>) : <div key={staffKey} className="shift"/>;
                  }
                )}
              </div>
            ))}
        </div>}
      </div>
    )
  }

  private getStartOfWeek() {
    return startOfWeek(Number(this.props.match.params.year), Number(this.props.match.params.weekNumber))
  }

  private maintainStateWithUrl() {
    const paramDate = this.getStartOfWeek();
    if (this.props.uiState.isCurrentDateSameAs(paramDate)) {
      this.props.updateUi(this.props.uiState.withCurrentDate(paramDate));
      return;
    }
    if (this.props.rotaExternalState.shouldLoadForDate(paramDate)) {
      this.props.fetchRotaForDate(moment.utc(paramDate));
      return;
    }
  }
}

export const WeeklyRota = connect<WeeklyRotaStateProps, WeeklyRotaDispatchProps, WeeklyRotaOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(WeeklyRotaComponent);