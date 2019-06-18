import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {Prompt} from "react-router";
import {ResetButton} from "../../Common/Buttons/ResetButton";
import {SaveButton} from "../../Common/Buttons/SaveButton";
import {DatePicker} from "../../Common/Nav/DatePicker";
import {Routes} from "../../Common/Routing/Routes";
import {RotaStatus} from "../../Model/Enum/RotaStatus";
import {WorkType} from "../../Model/Enum/WorkTypes";
import {RotaEntity} from "../../Model/Rota/RotaEntity";
import {RotasForWeek} from "../../Model/Rota/RotasForWeek";
import {RotaUpdateType} from "../../Model/Rota/RotaTypes";
import {Shift} from "../../Model/Shift/Shift";
import {StaffMember} from "../../Model/StaffMember/StaffMember";
import {StaffRole} from "../../Model/StaffRole/StaffRole";
import {AppState} from "../../redux";
import {rotaCreate, rotaDataEntry} from "../../Redux/Rota/RotaRedux";
import {uiUpdate} from "../../Redux/UI/UiRedux";
import {UiState} from "../../Redux/UI/UiState";
import {DateFormats} from "../../Util/DateFormats";
import {momentFromDate, momentFromDateAndTime} from "../../Util/DateUtils";
import {Formatting} from "../../Util/Formatting";
import {currencyPattern} from "../../Util/Validation";
import './Rota.scss';

export interface AncillaryRotaEditorOwnProps {
  rota: RotaEntity;
  editType: 'rota'|'sign-in';
  workType: WorkType;
  date: string;
  staffMembers: StaffMember[];
  shifts: Shift[];
  title: string;
  showStats: boolean;
  showStaffLevels: boolean;
  rotasForWeek: RotasForWeek;
  addShift: (shiftToAdd: Shift) => void;
  updateShift: (shiftToUpdate: Shift) => void;
  removeShift: (shiftToRemove: Shift) => void;
  resetRota: () => void;
}

export interface AncillaryRotaEditorStateProps {
  uiState: UiState;
}

export const mapStateToProps = (state: AppState, ownProps: AncillaryRotaEditorOwnProps): AncillaryRotaEditorStateProps => {
  return {
    uiState: state.uiState,
  }
};

export interface AncillaryRotaEditorDispatchProps {
  createRota: (rota: RotaEntity) => void;
  updateRotaLocalState: (state: RotaEntity[]) => void;
  updateUi: (state: UiState) => void;
}

export const mapDispatchToProps = (dispatch: any, ownProps: AncillaryRotaEditorOwnProps): AncillaryRotaEditorDispatchProps => {
  return {
    createRota: (rota: RotaEntity) => dispatch(rotaCreate(rota)),
    updateRotaLocalState: (state: RotaEntity[]) => dispatch(rotaDataEntry(state)),
    updateUi: (state: UiState) => dispatch(uiUpdate(state)),
  };
};

export type AncillaryRotaEditorProps = AncillaryRotaEditorOwnProps & AncillaryRotaEditorStateProps & AncillaryRotaEditorDispatchProps;

export class AncillaryRotaEditorComponent extends React.Component<AncillaryRotaEditorProps, {}> {
  public render() {
    const today = momentFromDate(this.props.date);
    const editingDisabled = !((this.props.editType === 'rota' && this.props.rota.canEditRota()) || (this.props.editType === 'sign-in' && this.props.rota.canEditSignIn()));
    return (
      <div>
        <h1 className="rota-title">{this.props.workType} {this.props.title} {this.props.rota.getDate().format(DateFormats.READABLE_WITH_YEAR)}</h1>
        <DatePicker dateParam={this.props.date} urlFromDate={(date: moment.Moment) => this.props.editType === 'rota' ? Routes.rotaUrl(date, this.props.workType) : Routes.signInUrl(date, this.props.workType)}/>
        <div className="rota-overview">
          <div className="rota-stat">
            Status:
            <select value={this.props.rota.status} onChange={ev => this.formUpdate({status: ev.target.value as RotaStatus})}>
              <option value={RotaStatus.NEW}>New</option>
              <option value={RotaStatus.DRAFT}>Draft</option>
              <option value={RotaStatus.ROTA_COMPLETE}>Rota Complete</option>
              <option value={RotaStatus.SIGN_IN_COMPLETE}>Sign In Complete</option>
              <option value={RotaStatus.IMPORTED}>Imported</option>
            </select>
          </div>
          {this.props.showStats && <div className="rota-stat">Constants: {momentFromDate(this.props.rota.constants.date).format(DateFormats.API_DATE)}</div>}
          {this.props.showStats && <div className="rota-stat">Forecast revenue: {this.props.rota.forecastRevenue}</div>}
          {this.props.showStats && <div className="rota-stat">Total wage cost: {Formatting.formatCashForDisplay(this.props.rota.getTotalPredictedLabourCost(this.props.rotasForWeek.getTotalForecastRevenue(today), this.props.workType))}</div>}
          {this.props.showStats && <div className="rota-stat">Labour rate: {Formatting.formatPercent(this.props.rota.getPredictedLabourRate(this.props.rotasForWeek.getTotalForecastRevenue(today), this.props.workType))} (aiming for &lt; {Formatting.formatPercent(this.props.rota.targetLabourRate)})</div>}
          {this.props.editType === "sign-in" && <div className="rota-stat"><button disabled={editingDisabled} type="button" onClick={() => this.autoPopulateShifts()}><FontAwesomeIcon icon="magic" /> Auto-populate</button></div>}
          <div className="rota-stat">
            <SaveButton mini={false} clickFn={() => this.props.createRota(this.props.rota)}/>
            <ResetButton mini={false} clickFn={() => this.props.resetRota()}/>
          </div>
        </div>
        <div className="rota-grid exclude-times">
          <div className="rota-times">
            <div className="rota-header rota-staff-name">Name</div>
            <div className="rota-header rota-remove-shift"/>
            <div className="rota-header rota-start-date">Start date</div>
            <div className="rota-header rota-start-time">Start time</div>
            <div className="rota-header rota-end-date">End date</div>
            <div className="rota-header rota-end-time">End time</div>
            <div className="rota-header rota-breaks">Breaks</div>
            <div className="rota-header rota-rate"><input type="checkbox" checked={this.props.uiState.rotaShowRates} onChange={ev => this.props.updateUi(this.props.uiState.withShouldShowRotaRates(ev.target.checked))}/>Rate</div>
          </div>
          {this.props.showStaffLevels && <div className="rota-staff-levels">
            <div className="rota-header rota-staff-name"/>
            <div className="rota-header rota-remove-shift"/>
            <div className="rota-header rota-start-date"/>
            <div className="rota-header rota-start-time"/>
            <div className="rota-header rota-end-date"/>
            <div className="rota-header rota-end-time"/>
            <div className="rota-header rota-breaks"/>
            <div className="rota-header rota-rate"/>
          </div>}
          <Prompt when={this.props.rota.touched} message={location => `Are you sure you want to go to ${location.pathname} without saving?`}/>
          {this.getRolesToDisplay().map((role, roleKey) =>
            <div className="rota-role-group" key={roleKey}>
              <div className="rota-role-header">{role.role}</div>
              {this.props.staffMembers
                .filter(staffMember => staffMember.role.id === role.id)
                .map((staffMember, key) => this.getShiftForStaffMember(staffMember, editingDisabled, key))
              }
            </div>
          )}
        </div>
      </div>
    );
  }

  private getRolesToDisplay() {
    const visibleRoles: StaffRole[] = [];
    this.props.staffMembers.forEach(member => {
      if (member.role.type === this.props.workType && member.isActive() && visibleRoles.find(role => member.role.entityId === role.entityId) === undefined) {
        visibleRoles.push(member.role);
      }
    });
    return visibleRoles.sort((a, b) => a.orderInRota > b.orderInRota ? 1 : -1);
  }

  private getShiftForStaffMember(staffMember: StaffMember, editingDisabled: boolean, key: number) {
    const shift = this.props.shifts.find(s => s.staffMember.id === staffMember.id);
    return shift === undefined
      ? this.getEmptyShift(staffMember, key)
      : this.getShift(shift, editingDisabled, key);
  }

  private getEmptyShift(staffMember: StaffMember, key: number) {
    return (
      <div className="rota-shift no-shift" key={key}>
        <div className="rota-staff-name">{staffMember.name}</div>
        <div className="rota-remove-shift"/>
        <div className="rota-new-shift">
          <button onClick={() => this.newShiftHandler(staffMember)} type="button"><FontAwesomeIcon icon="plus-circle"/></button>
        </div>
        <div className="rota-new-shift-spacer"/>
        <div className="rota-new-shift-spacer"/>
      </div>
    );
  }

  private getShift(shift: Shift, editingDisabled: boolean, key: number) {
    return (
      <div className="rota-shift" key={key}>
        <div className="rota-staff-name">{shift.staffMember.name}</div>
        <div className="rota-remove-shift">
          {!editingDisabled &&
          <button className="rota-remove-shift-button" type='button' onClick={() => this.props.removeShift(shift)}>
            <FontAwesomeIcon icon="trash"/>
          </button>}
        </div>
        <div className="rota-start-date">
          {editingDisabled ? (
            <div>{shift.getStartTime().format(DateFormats.API_DATE)}</div>
          ) : (
            <input disabled={editingDisabled}
                   type='date'
                   className="rota-time-input"
                   value={shift.inputs.startTime.date}
                   onChange={ev => this.startDateHandler(ev.target.value, shift)}
            />
          )}
        </div>
        <div className="rota-start-time">
          {editingDisabled ? (
            <div>{shift.getStartTime().format(DateFormats.TIME_LEADING_ZERO)}</div>
          ) : (
            <input disabled={editingDisabled}
                   type='time'
                   className="rota-time-input"
                   value={shift.inputs.startTime.time}
                   onChange={ev => this.startTimeHandler(ev.target.value, shift)}
            />
          )}
        </div>
        <div className="rota-end-date">
          {editingDisabled ? (
            <div>{shift.getEndTime().format(DateFormats.API_DATE)}</div>
          ) : (
            <input disabled={editingDisabled}
                   type='date'
                   className="rota-time-input"
                   value={shift.inputs.endTime.date}
                   onChange={ev => this.endDateHandler(ev.target.value, shift)}
            />
          )}
        </div>
        <div className="rota-end-time">
          {editingDisabled ? (
            <div>{shift.getEndTime().format(DateFormats.TIME_LEADING_ZERO)}</div>
          ) : (
            <input type='time'
                   className="rota-time-input"
                   value={shift.inputs.endTime.time}
                   onChange={ev => this.endTimeHandler(ev.target.value, shift)}
            />
          )}
        </div>
        {(editingDisabled || this.props.editType === 'rota') && <div className="rota-breaks">{shift.totalBreaks} hrs</div>}
        {(!editingDisabled && this.props.editType === 'sign-in') && <div className="rota-breaks"><input className="rota-breaks-input" value={shift.inputs.totalBreaks} onChange={ev => this.props.updateShift(shift.with({totalBreaks: ev.target.value}))}/></div>}
        <div className={`rota-rate`}>
          {this.props.uiState.rotaShowRates && <input className={`rota-rate-input`}
                 disabled={editingDisabled}
                 type="tel" pattern={currencyPattern}
                 value={shift.inputs.hourlyRate}
                 onChange={ev => this.props.updateShift(shift.with({hourlyRate: ev.target.value}))} />}
        </div>
      </div>
    );
  }

  private formUpdate(obj: RotaUpdateType, touched: boolean = true) {
    if (touched) {
      this.props.updateRotaLocalState(
        [this.props.rota.updateTouched(obj)]
      );
    } else {
      this.props.updateRotaLocalState(
        [this.props.rota.update(obj)]
      );
    }
  }

  private newShiftHandler(member: StaffMember) {
    this.props.addShift(Shift.default(member, this.props.workType as WorkType, this.props.rota.date));
  }

  private startTimeHandler(value: string, shift: Shift) {
    const time = momentFromDateAndTime(shift.inputs.startTime.date, value);
    const formattedTime = time.format(DateFormats.TIME_LEADING_ZERO);
    if (time.isSameOrAfter(shift.getEndTime())) {
      this.props.updateShift(shift.with({startTime: {date: shift.inputs.startTime.date, time: value}, endTime: {date: shift.inputs.startTime.date, time: formattedTime}, totalBreaks: this.getExpectedBreaks(time, shift.getEndTime()).toString()}));
    } else {
      this.props.updateShift(shift.with({startTime: {date: shift.inputs.startTime.date, time: value}, totalBreaks: this.getExpectedBreaks(time, shift.getEndTime()).toString()}));
    }
  }

  private endTimeHandler(value: string, shift: Shift) {
    const time = momentFromDateAndTime(shift.inputs.endTime.date, value);
    const formattedTime = time.format(DateFormats.TIME_LEADING_ZERO);
    if (time.isSameOrBefore(shift.getStartTime())) {
      this.props.updateShift(shift.with({endTime: {date: shift.inputs.endTime.date, time: value}, startTime: {date: shift.inputs.endTime.date, time: formattedTime}, totalBreaks: this.getExpectedBreaks(shift.getStartTime(), time).toString()}));
    } else {
      this.props.updateShift(shift.with({endTime: {date: shift.inputs.endTime.date, time: value}, totalBreaks: this.getExpectedBreaks(shift.getStartTime(), time).toString()}));
    }
  }

  private startDateHandler(value: string, shift: Shift) {
    const time = momentFromDateAndTime(value, shift.inputs.startTime.time);
    const formattedDate = time.format(DateFormats.API_DATE);
    if (time.isSameOrAfter(shift.getEndTime())) {
      this.props.updateShift(shift.with({startTime: {date: value, time: shift.inputs.startTime.time}, endTime: {date: formattedDate, time: shift.inputs.startTime.time}, totalBreaks: this.getExpectedBreaks(time, shift.getEndTime()).toString()}));
    } else {
      this.props.updateShift(shift.with({startTime: {date: value, time: shift.inputs.startTime.time}, totalBreaks: this.getExpectedBreaks(time, shift.getEndTime()).toString()}));
    }
  }

  private endDateHandler(value: string, shift: Shift) {
    const time = momentFromDateAndTime(value, shift.inputs.endTime.time);
    const formattedDate = time.format(DateFormats.API_DATE);
    if (time.isSameOrBefore(shift.getStartTime())) {
      this.props.updateShift(shift.with({endTime: {date: value, time: shift.inputs.endTime.time}, startTime: {date: formattedDate, time: shift.inputs.endTime.time}, totalBreaks: this.getExpectedBreaks(shift.getStartTime(), time).toString()}));
    } else {
      this.props.updateShift(shift.with({endTime: {date: value, time: shift.inputs.endTime.time}, totalBreaks: this.getExpectedBreaks(shift.getStartTime(), time).toString()}));
    }
  }

  private getExpectedBreaks(startTime: moment.Moment, endTime: moment.Moment): number {
    const hoursDifference = endTime.diff(startTime, "hours");
    if (hoursDifference > this.props.rota.constants.hoursPerLongBreak) {
      return this.props.rota.constants.longBreakDuration;
    }
    if (hoursDifference > this.props.rota.constants.hoursPerShortBreak) {
      return this.props.rota.constants.shortBreakDuration;
    }
    return 0;
  }

  private autoPopulateShifts() {
    const clonedPlannedShifts = this.props.rota.plannedShifts.map(shift => shift.duplicate());
    this.formUpdate({actualShifts: clonedPlannedShifts});
  }
}

export const AncillaryRotaEditor = connect<AncillaryRotaEditorStateProps, AncillaryRotaEditorDispatchProps, AncillaryRotaEditorOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(AncillaryRotaEditorComponent);