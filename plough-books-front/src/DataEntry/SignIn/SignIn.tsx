import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {match} from "react-router";
import {DatePicker} from "../../Nav/DatePicker";
import {AppState} from "../../redux";
import {Routes} from "../../Routing/Routes";
import {DateFormats} from "../../Util/DateFormats";
import {validateCash} from "../../Util/Validation";
import {ConstantsExternalState} from "../Constants/State/ConstantsExternalState";
import {constantsFetch} from "../Constants/State/ConstantsRedux";
import {ActualShift} from "../Rota/State/ActualShift";
import {RotaEntity} from "../Rota/State/RotaEntity";
import {RotaExternalState} from "../Rota/State/RotaExternalState";
import {rotaCreate, rotaDataEntry, rotaFetch} from "../Rota/State/RotaRedux";
import {RotasForWeek} from "../Rota/State/RotasForWeek";
import {StaffMember} from "../Rota/State/StaffMember";
import {StaffMembersExternalState} from "../StaffMembers/State/StaffMembersExternalState";
import {StaffMembersLocalState} from "../StaffMembers/State/StaffMembersLocalState";
import {staffMembersFetch} from "../StaffMembers/State/StaffMembersRedux";
import {StaffRolesExternalState} from "../StaffRoles/State/StaffRolesExternalState";
import {StaffRolesLocalState} from "../StaffRoles/State/StaffRolesLocalState";
import {staffRolesFetch} from "../StaffRoles/State/StaffRolesRedux";

interface SignInOwnProps {
  match: match<{
    date: string,
    type: string,
  }>;
}

interface SignInStateProps {
  constantsExternalState: ConstantsExternalState;
  rotaExternalState: RotaExternalState;
  rotaLocalStates: RotasForWeek;
  staffMembersExternalState: StaffMembersExternalState;
  staffMembersLocalState: StaffMembersLocalState;
  staffRolesExternalState: StaffRolesExternalState;
  staffRolesLocalState: StaffRolesLocalState;
}

const mapStateToProps = (state: AppState, ownProps: SignInOwnProps): SignInStateProps => {
  return {
    constantsExternalState: state.constantsExternalState,
    rotaExternalState: state.rotaExternalState,
    rotaLocalStates: state.rotaLocalStates,
    staffMembersExternalState: state.staffMembersExternalState,
    staffMembersLocalState: state.staffMembersLocalState,
    staffRolesExternalState: state.staffRolesExternalState,
    staffRolesLocalState: state.staffRolesLocalState,
  }
};

interface SignInDispatchProps {
  createRota: (rota: RotaEntity) => void;
  fetchConstants: () => void;
  fetchRotaForDate: (date: moment.Moment) => void;
  fetchStaffMembers: () => void;
  fetchStaffRoles: () => void;
  updateRotaLocalState: (state: RotaEntity[]) => void;
}

const mapDispatchToProps = (dispatch: any, ownProps: SignInOwnProps): SignInDispatchProps => {
  return {
    createRota: (rota: RotaEntity) => dispatch(rotaCreate(rota)),
    fetchConstants: () => dispatch(constantsFetch()),
    fetchRotaForDate: (date: moment.Moment) => dispatch(rotaFetch(date)),
    fetchStaffMembers: () => dispatch(staffMembersFetch()),
    fetchStaffRoles: () => dispatch(staffRolesFetch()),
    updateRotaLocalState: (state: RotaEntity[]) => dispatch(rotaDataEntry(state)),
  };
};

type SignInProps = SignInOwnProps & SignInStateProps & SignInDispatchProps;

class SignInComponent extends React.Component<SignInProps, {}> {
  private DAY_START_HOUR = 6;

  public componentDidMount() {
    this.maintainStateWithUrl();
  }

  public componentDidUpdate() {
    this.maintainStateWithUrl();
  }

  public render() {
    const startTime = moment(this.props.match.params.date).set('hour', this.DAY_START_HOUR).set('minute', 0);
    const endTime = moment(this.props.match.params.date).add(1, 'day').set('hour', this.DAY_START_HOUR).set('minute', 0);
    const numberOfTimePeriods = endTime.diff(startTime, 'minutes') / 30;
    const timePeriods: moment.Moment[] = [];
    for (let i=0; i<numberOfTimePeriods; i++) {
      timePeriods.push(startTime.clone().add(i*30, 'minutes'));
    }
    const unusedMembers = this.props.staffMembersLocalState.members
      .filter(
        (member: StaffMember) => this.getRota().actualShifts.filter(
          shift => shift.staffMember.id === member.id
        ).length === 0
      );
    const editingDisabled = this.getRota().status !== 'draft';
    return (
      <div>
        <h1 className="rota-title">{this.props.match.params.type} Sign-in {this.getRota().date.format(DateFormats.READABLE_WITH_YEAR)}</h1>
        <DatePicker dateParam={this.props.match.params.date} urlFromDate={(date: moment.Moment) => Routes.signInUrl(date, this.props.match.params.type)}/>
        <div className="rota-overview">
          <div className="rota-stat">
            Status:
            <select value={this.getRota().status} onChange={ev => this.formUpdate({status: ev.target.value})}>
              <option value='draft'>Draft</option>
              <option value='final'>Final</option>
              <option value='deleted'>Deleted</option>
            </select>
          </div>
          <div className="rota-stat">
            Constants:
            <select value={this.getRota().constants.id} onChange={ev => this.constantsUpdate(Number(ev.target.value))}>
              {this.props.constantsExternalState.externalState && this.props.constantsExternalState.externalState.constants.map((constants, key) => (
                <option key={key} value={constants.id}>{constants.date.format(DateFormats.API)}</option>
              ))}
            </select>
          </div>
          <div className="rota-stat">
            Forecast revenue: <input disabled={editingDisabled} type="number" step={0.01} value={this.getRota().forecastRevenue} className="rota-forecast"
                                     onChange={ev => this.formUpdate({forecastRevenue: validateCash(ev.target.value, this.getRota().forecastRevenue)})} />
          </div>
          <div className="rota-stat">Total wage cost: £{this.getRota().getTotalLabourCost(this.props.rotaLocalStates.getTotalForecastRevenue(), this.props.match.params.type).toFixed(2)}</div>
          <div className="rota-stat">Labour rate: {(this.getRota().getLabourRate(this.props.rotaLocalStates.getTotalForecastRevenue(), this.props.match.params.type) * 100).toFixed(2)}% (aiming for &lt; {(this.getRota().targetLabourRate * 100).toFixed(2)}%)</div>
          <div className="rota-stat"><button type="button" onClick={() => this.props.createRota(this.getRota())}>Save</button></div>
        </div>
        <div className="rota-grid">
          <div className="rota-times">
            <div className="rota-header rota-staff-name">Name</div>
            <div className="rota-header rota-remove-shift"/>
            <div className="rota-header rota-start-time">Start</div>
            <div className="rota-header rota-end-time">End</div>
            <div className="rota-header rota-breaks">Breaks</div>
            {timePeriods.map((timePeriod, timeKey) => (
              <div className="rota-time" key={timeKey}>{timePeriod.minutes() === 0 && timePeriod.format(DateFormats.TIME_NO_LEADING_ZERO)}</div>
            ))}
          </div>
          {     this.props.staffRolesExternalState.isLoaded()
          &&  this.getRota()
          &&  this.props.staffMembersExternalState.isLoaded()
          && this.props.staffRolesLocalState.roles.filter(role => role.type === this.props.match.params.type)
            .map((role, roleKey) => {
                return (
                  <div className="rota-role-group" key={roleKey}>
                    <div className="rota-role-header">{role.role}</div>
                    {this.getRota().actualShifts
                      .filter(actualShift => actualShift.staffMember.role.id === role.id && actualShift.type === this.props.match.params.type)
                      .map((actualShift, shiftKey) => (
                        <div className="rota-shift" key={shiftKey}>
                          <div className="rota-staff-name">{actualShift.staffMember.name}</div>
                          <div className="rota-remove-shift">
                            {!editingDisabled && <button className="rota-remove-shift-button" type='button' onClick={() => this.removeActualShift(actualShift)}>x</button>}
                          </div>
                          <div className="rota-start-time">
                            {editingDisabled ? (
                              <div>{actualShift.startTime.format(DateFormats.TIME_LEADING_ZERO)}</div>
                            ) : (
                              <input disabled={editingDisabled} type='time' step={1800} className="rota-time-input"
                                     value={actualShift.startTimeInputValue}
                                     onChange={ev => this.startTimeHandler(ev.target.value, actualShift)}
                              />
                            )}
                          </div>
                          <div className="rota-end-time">
                            {editingDisabled ? (
                              <div>{actualShift.endTime.format(DateFormats.TIME_LEADING_ZERO)}</div>
                            ) : (
                              <input type='time' step={1800} className="rota-time-input"
                                     value={actualShift.endTimeInputValue}
                                     onChange={ev => this.endTimeHandler(ev.target.value, actualShift)}
                              />
                            )}
                          </div>
                          <div className="rota-breaks">{actualShift.totalBreaks * 60} mins</div>
                          {timePeriods.map((timePeriod, periodKey) => (
                            <div className={actualShift.isWorkingAtTime(timePeriod) ? "rota-time working" : "rota-time"} key={periodKey}/>
                          ))}
                        </div>
                      ))}
                    <div className="rota-horizontal-spacer" />
                    {!editingDisabled && unusedMembers
                      .filter(member => member.role.id === role.id)
                      .map((member, shiftKey) => (
                        <div className="rota-shift no-shift" key={shiftKey}>
                          <div className="rota-staff-name">{member.name}</div>
                          <div className="rota-remove-shift"/>
                          <div className="rota-new-shift">
                            <button onClick={() => this.newShiftHandler(member)} type="button">Add to rota</button>
                          </div>
                          <div className="rota-new-shift-spacer"/>
                          <div className="rota-new-shift-spacer"/>
                          {timePeriods.map((timePeriod, periodKey) => (
                            <div className="rota-time" key={periodKey}/>
                          ))}
                        </div>
                      ))}
                  </div>);
              }
            )}
        </div>
        <div className="temp-todo">
          <h2>TODO</h2>
          <div>Save all changes for week</div>
          <div>Do not override changes made to other days when saving one day</div>
          <div>Weekly overview</div>
        </div>
      </div>)
  }

  private getRota(): RotaEntity {
    const localState = this.props.rotaLocalStates.rotas.get(this.props.match.params.date);
    return localState === undefined ? RotaEntity.default() : localState;
  }

  private formUpdate(obj: {}) {
    this.props.updateRotaLocalState(
      [this.getRota().with(obj)]
    );
  }

  private constantsUpdate(id: number) {
    if (this.props.constantsExternalState.externalState) {
      this.formUpdate({
        constants: this.props.constantsExternalState.externalState.constants.find((constants) => constants.id === id)
      });
    }
  }

  private newShiftHandler(member: StaffMember) {
    const time = moment(this.props.match.params.date).startOf('day');
    this.addActualShift(ActualShift.default().with({type: this.props.match.params.type, staffMember: member, startTime: time.clone().hour(10), endTime: time.clone().hour(17)}));
  }

  private startTimeHandler(value: string, actualShift: ActualShift) {
    const time = moment(`${actualShift.startTime.format(DateFormats.API)} ${value}`);
    if (time.hour() < this.DAY_START_HOUR && time.isSame(this.getRota().date, 'day')) {
      time.add(1, 'days');
    }
    if (time.hour() >= this.DAY_START_HOUR && !time.isSame(this.getRota().date, 'day')) {
      time.subtract(1, 'days');
    }
    if (time.isAfter(actualShift.endTime)) {
      this.updateActualShift(actualShift.with({startTimeInputValue: value, startTime: time, endTime: time, totalBreaks: this.getExpectedBreaks(time, actualShift.endTime)}));
    } else {
      this.updateActualShift(actualShift.with({startTimeInputValue: value, startTime: time, totalBreaks: this.getExpectedBreaks(time, actualShift.endTime)}));
    }
  }

  private endTimeHandler(value: string, actualShift: ActualShift) {
    const time = moment(`${actualShift.endTime.format(DateFormats.API)} ${value}`);
    if (time.hour() < this.DAY_START_HOUR && time.isSame(this.getRota().date, 'day')) {
      time.add(1, 'days');
    }
    if (time.hour() >= this.DAY_START_HOUR && !time.isSame(this.getRota().date, 'day')) {
      time.subtract(1, 'days');
    }
    if (time.isBefore(actualShift.startTime)) {
      this.updateActualShift(actualShift.with({endTimeInputValue: value, endTime: time, startTime: time, totalBreaks: this.getExpectedBreaks(actualShift.startTime, time)}));
    } else {
      this.updateActualShift(actualShift.with({endTimeInputValue: value, endTime: time, totalBreaks: this.getExpectedBreaks(actualShift.startTime, time)}));
    }
  }

  private getExpectedBreaks(startTime: moment.Moment, endTime: moment.Moment): number {
    const hoursDifference = endTime.diff(startTime, "hours");
    if (hoursDifference > this.getRota().constants.hoursPerLongBreak) {
      return this.getRota().constants.longBreakDuration;
    }
    if (hoursDifference > this.getRota().constants.hoursPerShortBreak) {
      return this.getRota().constants.shortBreakDuration;
    }
    return 0;
  }

  private addActualShift(actualShift: ActualShift) {
    const clonedActualShifts = this.getRota().actualShifts.map(shift => shift.clone());
    clonedActualShifts.push(actualShift);
    this.formUpdate({actualShifts: clonedActualShifts});
  }

  private updateActualShift(actualShift: ActualShift) {
    const clonedActualShifts = this.getRota().actualShifts.map(shift => shift.staffMember.id === actualShift.staffMember.id ? actualShift : shift.clone());
    this.formUpdate({actualShifts: clonedActualShifts});
  }

  private removeActualShift(actualShift: ActualShift) {
    const clonedActualShifts = this.getRota().actualShifts
      .filter(shift => shift.staffMember.id !== actualShift.staffMember.id)
      .map(shift => shift.clone());
    this.formUpdate({actualShifts: clonedActualShifts});
  }

  private maintainStateWithUrl() {
    const paramDate = moment(this.props.match.params.date);
    if (this.props.staffRolesExternalState.isEmpty()) {
      this.props.fetchStaffRoles();
      return;
    }
    if (this.props.staffMembersExternalState.isEmpty()) {
      this.props.fetchStaffMembers();
      return;
    }
    if (this.props.constantsExternalState.isEmpty()) {
      this.props.fetchConstants();
      return;
    }
    if (this.props.rotaExternalState.isEmpty()
      || (this.props.rotaExternalState.rotasForWeek && this.props.rotaExternalState.isLoaded() && !this.props.rotaExternalState.rotasForWeek.rotas.has(paramDate.format(DateFormats.API)))
    ) {
      this.props.fetchRotaForDate(moment(paramDate));
      return;
    }
    if (this.props.constantsExternalState.isLoaded() && this.props.rotaExternalState.isLoaded() && !this.getRota().constants.id && this.props.constantsExternalState.externalState) {
      this.formUpdate({type: this.props.match.params.type, constants: this.props.constantsExternalState.externalState.constants.slice(0,1)[0]});
    }
  }
}

export const SignIn = connect<SignInStateProps, SignInDispatchProps, SignInOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(SignInComponent);