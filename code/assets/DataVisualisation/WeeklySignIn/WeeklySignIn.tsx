import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {match} from "react-router";
import {WorkTypes} from "../../Model/Enum/WorkTypes";
import {StaffMember} from '../../Model/StaffMember/StaffMember';
import {AppState} from "../../redux";
import {RotaExternalState} from "../../Redux/Rota/RotaExternalState";
import {rotaFetch} from "../../Redux/Rota/RotaRedux";
import {uiUpdate} from "../../Redux/UI/UiRedux";
import {UiState} from "../../Redux/UI/UiState";
import {DateFormats} from "../../Util/DateFormats";
import {startOfWeek} from "../../Util/DateUtils";
import "./WeeklySignIn.scss";

interface WeeklySignInOwnProps {
  match: match<{
    weekNumber: string,
    year: string,
  }>;
}

interface WeeklySignInStateProps {
  rotaExternalState: RotaExternalState;
  uiState: UiState;
}

const mapStateToProps = (state: AppState, ownProps: WeeklySignInOwnProps): WeeklySignInStateProps => {
  return {
    rotaExternalState: state.rotaExternalState,
    uiState: state.uiState,
  }
};

interface WeeklySignInDispatchProps {
  fetchRotaForDate: (date: moment.Moment) => void,
  updateUi: (state: UiState) => void;
}

const mapDispatchToProps = (dispatch: any, ownProps: WeeklySignInOwnProps): WeeklySignInDispatchProps => {
  return {
    fetchRotaForDate: (date: moment.Moment) => dispatch(rotaFetch(date)),
    updateUi: (state: UiState) => dispatch(uiUpdate(state)),
  };
};

type WeeklySignInProps = WeeklySignInOwnProps & WeeklySignInStateProps & WeeklySignInDispatchProps;

class WeeklySignInComponent extends React.Component<WeeklySignInProps, {}> {
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
      .forEach(rota => rota.actualShifts
        .forEach(shift => {
          if (!allStaff.has(shift.staffMember.entityId)) {
            allStaff.set(shift.staffMember.entityId, shift.staffMember);
          }
        })
      );
    const barStaff = Array.from(allStaff.values())
      .filter(staffMember => staffMember.role.type === WorkTypes.BAR)
      .sort((a,b) => a.role.orderInRota > b.role.orderInRota ? 1 : (a.name > b.name ? 1 : -1));
    const kitchenStaff = Array.from(allStaff.values())
      .filter(staffMember => staffMember.role.type === WorkTypes.KITCHEN);
    return (
      <div className="weekly-sign-in">
        <div>Weekly bar sign in for week starting {this.getStartOfWeek().format(DateFormats.READABLE_WITH_YEAR)}</div>
        {this.props.rotaExternalState.isLoaded() &&
        <div className="sign-in-grid">
            <div className="sign-in-column">
                <div className="date-header"/>
                <div className="staff-member" />
              {barStaff.map((staffMember, key) => (
                <div key={key} className="staff-member">{staffMember.name}</div>
              ))}
            </div>
          {this.props.rotaExternalState.rotasForWeek.getRotasForWeek(startOfThisWeek)
            .map((rota, key) => (
              <div key={key} className="sign-in-column">
                <div className="date-header">{rota.getDate().format(DateFormats.READABLE_NO_YEAR)}</div>
                <div className="shift">
                  <div>Start</div>
                  <div>End</div>
                  <div>Breaks</div>
                </div>
                {barStaff.map((staffMember, staffKey) => {
                    const shift = rota.actualShifts.find(actualShift => actualShift.staffMember.id === staffMember.id);
                    return shift ? (<div key={staffKey} className="shift">
                      <div>{shift.getStartTime().format(DateFormats.TIME_LEADING_ZERO)}</div>
                      <div>{shift.getEndTime().format(DateFormats.TIME_LEADING_ZERO)}</div>
                      <div>{shift.totalBreaks * 60}</div>
                    </div>) : <div key={staffKey} className="shift"/>;
                  }
                )}
              </div>
            ))}
            <div className="sign-in-column">
                <div className="date-header">Planned hours</div>
                <div className="shift" />
              {barStaff.map((staffMember, staffKey) => {
                  const totalHours = this.props.rotaExternalState.rotasForWeek.getRotasForWeek(startOfThisWeek).reduce((prev, curr) => {
                    const shift = curr.plannedShifts.find(plannedShift => plannedShift.staffMember.id === staffMember.id);
                    return prev + (shift ? shift.getEndTime().diff(shift.getStartTime(), 'minutes') - shift.totalBreaks*60 : 0);
                  }, 0);
                  return <div key={staffKey} className="shift">{(totalHours/60).toFixed(2)}</div>;
                }
              )}
            </div>
            <div className="sign-in-column">
                <div className="date-header">Actual hours</div>
                <div className="shift" />
              {barStaff.map((staffMember, staffKey) => {
                  const totalHours = this.props.rotaExternalState.rotasForWeek.getRotasForWeek(startOfThisWeek).reduce((prev, curr) => {
                    const shift = curr.actualShifts.find(actualShift => actualShift.staffMember.id === staffMember.id);
                    return prev + (shift ? shift.getEndTime().diff(shift.getStartTime(), 'minutes') - shift.totalBreaks*60 : 0);
                  }, 0);
                  return <div key={staffKey} className="shift">{(totalHours/60).toFixed(2)}</div>;
                }
              )}
            </div>
        </div>}
        <div>Weekly kitchen sign in for week starting {this.getStartOfWeek().format(DateFormats.READABLE_WITH_YEAR)}</div>
        {this.props.rotaExternalState.isLoaded() &&
        <div className="sign-in-grid">
            <div className="sign-in-column">
                <div className="date-header"/>
                <div className="staff-member" />
              {kitchenStaff.map((staffMember, key) => (
                <div key={key} className="staff-member">{staffMember.name}</div>
              ))}
            </div>
          {this.props.rotaExternalState.rotasForWeek.getRotasForWeek(startOfThisWeek)
            .map((rota, key) => (
              <div key={key} className="sign-in-column">
                <div className="date-header">{rota.getDate().format(DateFormats.READABLE_NO_YEAR)}</div>
                <div className="shift">
                  <div>Start</div>
                  <div>End</div>
                  <div>Breaks</div>
                </div>
                {kitchenStaff.map((staffMember, staffKey) => {
                    const shift = rota.actualShifts.find(actualShift => actualShift.staffMember.id === staffMember.id);
                    return shift ? (<div key={staffKey} className="shift">
                      <div>{shift.getStartTime().format(DateFormats.TIME_LEADING_ZERO)}</div>
                      <div>{shift.getEndTime().format(DateFormats.TIME_LEADING_ZERO)}</div>
                      <div>{shift.totalBreaks * 30}</div>
                    </div>) : <div key={staffKey} className="shift"/>;
                  }
                )}
              </div>
            ))}
            <div className="sign-in-column">
                <div className="date-header">Planned hours</div>
                <div className="shift" />
              {kitchenStaff.map((staffMember, staffKey) => {
                  const totalHours = this.props.rotaExternalState.rotasForWeek.getRotasForWeek(startOfThisWeek).reduce((prev, curr) => {
                    const shift = curr.plannedShifts.find(plannedShift => plannedShift.staffMember.id === staffMember.id);
                    return prev + (shift ? shift.getEndTime().diff(shift.getStartTime(), 'minutes') - shift.totalBreaks*60 : 0);
                  }, 0);
                  return <div key={staffKey} className="shift">{(totalHours/60).toFixed(2)}</div>;
                }
              )}
            </div>
            <div className="sign-in-column">
                <div className="date-header">Actual hours</div>
                <div className="shift" />
              {kitchenStaff.map((staffMember, staffKey) => {
                  const totalHours = this.props.rotaExternalState.rotasForWeek.getRotasForWeek(startOfThisWeek).reduce((prev, curr) => {
                    const shift = curr.actualShifts.find(actualShift => actualShift.staffMember.id === staffMember.id);
                    return prev + (shift ? shift.getEndTime().diff(shift.getStartTime(), 'minutes') - shift.totalBreaks*60 : 0);
                  }, 0);
                  return <div key={staffKey} className="shift">{(totalHours/60).toFixed(2)}</div>;
                }
              )}
            </div>
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

export const WeeklySignIn = connect<WeeklySignInStateProps, WeeklySignInDispatchProps, WeeklySignInOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(WeeklySignInComponent);