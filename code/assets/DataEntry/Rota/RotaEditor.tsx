import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {Prompt} from "react-router";
import {ResetButton} from "../../Common/Buttons/ResetButton";
import {SaveButton} from "../../Common/Buttons/SaveButton";
import {DatePicker} from "../../Common/Nav/DatePicker";
import {Routes} from "../../Common/Routing/Routes";
import {RotaStaffingTemplateStatus} from "../../Model/Enum/RotaStaffingTemplateStatus";
import {RotaStatus} from "../../Model/Enum/RotaStatus";
import {WorkTypes} from "../../Model/Enum/WorkTypes";
import {RotaEntity} from "../../Model/Rota/RotaEntity";
import {RotasForWeek} from "../../Model/Rota/RotasForWeek";
import {RotaUpdateType} from "../../Model/Rota/RotaTypes";
import {RotaStaffingTemplate} from "../../Model/RotaStaffingTemplate/RotaStaffingTemplate";
import {Shift} from "../../Model/Shift/Shift";
import {StaffMember} from "../../Model/StaffMember/StaffMember";
import {StaffRole} from "../../Model/StaffRole/StaffRole";
import {AppState} from "../../redux";
import {rotaCreate, rotaDataEntry} from "../../Redux/Rota/RotaRedux";
import {uiUpdate} from "../../Redux/UI/UiRedux";
import {UiState} from "../../Redux/UI/UiState";
import {DateFormats} from "../../Util/DateFormats";
import {DAY_START_HOUR, getTimePeriods, momentFromDateAndTime} from "../../Util/DateUtils";
import {Formatting} from "../../Util/Formatting";
import {currencyPattern} from "../../Util/Validation";
import './Rota.scss';

export interface RotaEditorOwnProps {
  rota: RotaEntity;
  editType: 'rota'|'sign-in';
  workType: WorkTypes;
  date: string;
  staffMembers: StaffMember[];
  shifts: Shift[];
  title: string;
  showStats: boolean;
  showStaffLevels: boolean;
  rotasForWeek: RotasForWeek;
  rotaStaffingTemplates: RotaStaffingTemplate[];
  uiState: UiState;
  addShift: (shiftToAdd: Shift) => void;
  updateShift: (shiftToUpdate: Shift) => void;
  removeShift: (shiftToRemove: Shift) => void;
  resetRota: () => void;
  updateUi: (state: UiState) => void;
}

export interface RotaEditorStateProps {}

export const mapStateToProps = (state: AppState, ownProps: RotaEditorOwnProps): RotaEditorStateProps => {
  return {}
};

export interface RotaEditorDispatchProps {
  createRota: (rota: RotaEntity) => void;
  updateRotaLocalState: (state: RotaEntity[]) => void;
  updateUi: (state: UiState) => void;
}

export const mapDispatchToProps = (dispatch: any, ownProps: RotaEditorOwnProps): RotaEditorDispatchProps => {
  return {
    createRota: (rota: RotaEntity) => dispatch(rotaCreate(rota)),
    updateRotaLocalState: (state: RotaEntity[]) => dispatch(rotaDataEntry(state)),
    updateUi: (state: UiState) => dispatch(uiUpdate(state)),
  };
};

export type RotaEditorProps = RotaEditorOwnProps & RotaEditorStateProps & RotaEditorDispatchProps;

export class RotaEditorComponent extends React.Component<RotaEditorProps, {}> {
  public render() {
    if (this.props.rotaStaffingTemplates.length === 0) {
      return null;
    }

    const staffingTemplate = this.props.workType === WorkTypes.BAR ? this.props.rota.barRotaTemplate : this.props.rota.kitchenRotaTemplate;
    if (staffingTemplate.status === RotaStaffingTemplateStatus.INACTIVE) {
      const barTemplate = this.props.rotaStaffingTemplates
        .filter(template =>
          template.status === RotaStaffingTemplateStatus.ACTIVE
          && template.revenue <= this.props.rota.forecastRevenue
          && template.workType === WorkTypes.BAR
          && template.dayOfWeek === moment.utc(this.props.date).isoWeekday()
        )
        .sort((a,b) => a.revenue > b.revenue ? 1 : -1)
        .pop();
      const kitchenTemplate = this.props.rotaStaffingTemplates
        .filter(template =>
          template.status === RotaStaffingTemplateStatus.ACTIVE
          && template.revenue <= this.props.rota.forecastRevenue
          && template.workType === WorkTypes.KITCHEN
          && template.dayOfWeek === moment.utc(this.props.date).isoWeekday()
        )
        .sort((a,b) => a.revenue > b.revenue ? 1 : -1)
        .pop();
      if (barTemplate !== undefined || kitchenTemplate !== undefined) {
        // TODO this needs to be in maintain state
        this.formUpdate({
          barRotaTemplate: barTemplate !== undefined ? barTemplate : this.props.rota.barRotaTemplate,
          kitchenRotaTemplate: kitchenTemplate !== undefined ? kitchenTemplate : this.props.rota.kitchenRotaTemplate,
        }, false);
      }
    }

    const today = moment.utc(this.props.date);
    const timePeriods = getTimePeriods(this.props.date);
    const editingDisabled = !((this.props.editType === 'rota' && this.props.rota.canEditRota()) || (this.props.editType === 'sign-in' && this.props.rota.canEditSignIn()));
    return (
      <div>
        <h1 className="rota-title">{this.props.workType} {this.props.title} {this.props.rota.getDate().format(DateFormats.READABLE_WITH_YEAR)}</h1>
        <DatePicker dateParam={this.props.date} urlFromDate={(date: moment.Moment) => Routes.rotaUrl(date, this.props.workType)}/>
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
          {this.props.showStats && <div className="rota-stat">Constants: {moment.utc(this.props.rota.constants.date).format(DateFormats.API_DATE)}</div>}
          {this.props.showStats && <div className="rota-stat">Forecast revenue: {this.props.rota.forecastRevenue}</div>}
          {this.props.showStats && <div className="rota-stat">Total wage cost: {Formatting.formatCashForDisplay(this.props.rota.getTotalPredictedLabourCost(this.props.rotasForWeek.getTotalForecastRevenue(today), this.props.workType))}</div>}
          {this.props.showStats && <div className="rota-stat">Labour rate: {Formatting.formatPercent(this.props.rota.getPredictedLabourRate(this.props.rotasForWeek.getTotalForecastRevenue(today), this.props.workType))} (aiming for &lt; {Formatting.formatPercent(this.props.rota.targetLabourRate)})</div>}
          {this.props.editType === "sign-in" && <div className="rota-stat"><button disabled={editingDisabled} type="button" onClick={() => this.autoPopulateShifts()}><FontAwesomeIcon icon="magic" /> Auto-populate</button></div>}
          <div className="rota-stat">
            <SaveButton mini={false} clickFn={() => this.props.createRota(this.props.rota)}/>
            <ResetButton mini={false} clickFn={() => this.props.resetRota()}/>
          </div>
        </div>
        <div className="rota-grid include-times">
          <div className="rota-times">
            <div className="rota-header rota-staff-name">Name</div>
            <div className="rota-header rota-remove-shift"/>
            <div className="rota-header rota-off-floor"/>
            <div className="rota-header rota-start-time">Start</div>
            <div className="rota-header rota-end-time">End</div>
            <div className="rota-header rota-breaks">Breaks</div>
            <div className="rota-header rota-rate"><input type="checkbox" checked={this.props.uiState.rotaShowRates} onChange={ev => this.props.updateUi(this.props.uiState.withShouldShowRotaRates(ev.target.checked))}/>Rate</div>
            {timePeriods.map((timePeriod, timeKey) => (
              <div className="rota-time" key={timeKey}>{timePeriod.minutes() === 0 && timePeriod.format(DateFormats.TIME_NO_LEADING_ZERO)}</div>
            ))}
          </div>
          {this.props.showStaffLevels && <div className="rota-staff-levels">
            <div className="rota-header rota-staff-name"/>
            <div className="rota-header rota-remove-shift"/>
            <div className="rota-header rota-off-floor"/>
            <div className="rota-header rota-start-time"/>
            <div className="rota-header rota-end-time"/>
            <div className="rota-header rota-breaks"/>
            <div className="rota-header rota-rate"/>
            {timePeriods.map((timePeriod, timeKey) => {
              const numberWorking = this.props.rota.getPlannedNumberWorkingAtTime(timePeriod.format(DateFormats.TIME_LEADING_ZERO), this.props.workType);
              const numberRequired = staffingTemplate.staffLevels[timeKey];
              const numberLeft = numberRequired - numberWorking;
              const stylingClass = numberLeft <= 0 ? 'staff-good' : (numberLeft === 1 ? 'staff-ok' : (numberLeft === 2 ? 'staff-mediocre' : 'staff-poor'));
              return <div className={`rota-time ${stylingClass}`} key={timeKey}>{numberLeft}</div>
            })}
            <div className={`rota-header rota-rate`}/>
          </div>}
          <Prompt when={this.props.rota.touched} message={location => `Are you sure you want to go to ${location.pathname} without saving?`}/>
          {this.getRolesToDisplay().map((role, roleKey) =>
            <div className="rota-role-group" key={roleKey}>
              <div className="rota-role-header">{role.role}</div>
              {this.props.staffMembers
                .filter(staffMember => staffMember.role.id === role.id && staffMember.isActive())
                .map((staffMember, key) => this.getShiftForStaffMember(staffMember, timePeriods, editingDisabled, key))
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

  private getShiftForStaffMember(staffMember: StaffMember, timePeriods: moment.Moment[], editingDisabled: boolean, key: number) {
    const shift = this.props.shifts.find(s => s.staffMember.id === staffMember.id);
    return shift === undefined
      ? this.getEmptyShift(staffMember, timePeriods, key)
      : this.getShift(shift, timePeriods, editingDisabled, key);
  }

  private getEmptyShift(staffMember: StaffMember, timePeriods: moment.Moment[], key: number) {
    return (
      <div className="rota-shift no-shift" key={key}>
        <div className="rota-staff-name">{staffMember.name}</div>
        <div className="rota-remove-shift"/>
        <div className="rota-off-floor"/>
        <div className="rota-new-shift">
          <button onClick={() => this.newShiftHandler(staffMember)} type="button"><FontAwesomeIcon icon="plus-circle"/></button>
        </div>
        <div className="rota-new-shift-spacer"/>
        <div className="rota-new-shift-spacer"/>
        <div className="rota-new-shift-spacer"/>
        {timePeriods.map((timePeriod, periodKey) => (
          <div className="rota-time" key={periodKey}/>
        ))}
      </div>
    );
  }

  private getShift(shift: Shift, timePeriods: moment.Moment[], editingDisabled: boolean, key: number) {
    return (
      <div className={`rota-shift ${shift.offFloor ? 'off-floor' : 'on-floor'}`} key={key}>
        <div className="rota-staff-name">{shift.staffMember.name}</div>
        <div className="rota-remove-shift">
          {!editingDisabled &&
          <button className="rota-remove-shift-button" type='button' onClick={() => this.props.removeShift(shift)}>
            <FontAwesomeIcon icon="trash"/>
          </button>}
        </div>
        <div className="rota-off-floor">
          {!editingDisabled &&
          <button className="rota-off-floor-button" type='button' onClick={() => this.props.updateShift(shift.with({offFloor: !shift.offFloor}))}>
            <FontAwesomeIcon icon={shift.offFloor ? "user-secret" : "eye"}/>
          </button>}
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
        {(!editingDisabled && this.props.editType === 'sign-in') && <div className="rota-breaks"><input className={`rota-breaks-input`} value={shift.inputs.totalBreaks} onChange={ev => this.props.updateShift(shift.with({totalBreaks: ev.target.value}))}/></div>}
        <div className={`rota-rate`}>
          {this.props.uiState.rotaShowRates && <input className={`rota-rate-input`}
                 disabled={editingDisabled}
                 type="tel" pattern={currencyPattern}
                 value={shift.inputs.hourlyRate}
                 onChange={ev => this.props.updateShift(shift.with({hourlyRate: ev.target.value}))} />}
        </div>
        {timePeriods.map((timePeriod, periodKey) => (
          <div className={shift.isWorkingAtTime(timePeriod) ? "rota-time working" : "rota-time"} key={periodKey}/>
        ))}
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
    this.props.addShift(Shift.default(member, this.props.workType as WorkTypes, this.props.rota.date));
  }

  private startTimeHandler(value: string, shift: Shift) {
    let time = momentFromDateAndTime(shift.date, value);
    if (time.hour() < DAY_START_HOUR) {
      time = momentFromDateAndTime(shift.date, '06:00');
    }
    if (time.hour() === 0) {
      time = momentFromDateAndTime(shift.date, '00:00');
    }
    const formattedTime = time.format(`HH:mm`);
    if (time.isSameOrAfter(shift.getEndTime())) {
      this.props.updateShift(shift.with({startTime: {date: shift.date, time: value}, endTime: {date: shift.date, time: formattedTime}, totalBreaks: this.getExpectedBreaks(time, shift.getEndTime()).toString()}));
    } else {
      this.props.updateShift(shift.with({startTime: {date: shift.date, time: value}, totalBreaks: this.getExpectedBreaks(time, shift.getEndTime()).toString()}));
    }
  }

  private endTimeHandler(value: string, shift: Shift) {
    let time = momentFromDateAndTime(shift.date, value);
    if (time.hour() < DAY_START_HOUR) {
      time.add(1, 'day');
    }
    if (time.hour() === 0 || time.hour() === 24) {
      time = momentFromDateAndTime(shift.date, '00:00').add(1, 'day');
    }
    const formattedTime = time.format(`HH:mm`);
    if (time.isSameOrBefore(shift.getStartTime())) {
      this.props.updateShift(shift.with({endTime: {date: time.format(DateFormats.API_DATE), time: value}, startTime: {date: shift.date, time: formattedTime}, totalBreaks: this.getExpectedBreaks(shift.getStartTime(), time).toString()}));
    } else {
      this.props.updateShift(shift.with({endTime: {date: time.format(DateFormats.API_DATE), time: value}, totalBreaks: this.getExpectedBreaks(shift.getStartTime(), time).toString()}));
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

export const RotaEditor = connect<RotaEditorStateProps, RotaEditorDispatchProps, RotaEditorOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(RotaEditorComponent);