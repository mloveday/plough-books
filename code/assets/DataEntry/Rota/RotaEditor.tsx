import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as moment from "moment";
import * as React from "react";
import {DragDropContext} from "react-dnd";
import createHTML5Backend from "react-dnd-html5-backend";
import {connect} from "react-redux";
import {Prompt} from "react-router";
import {ResetButton} from "../../Common/Buttons/ResetButton";
import {SaveButton} from "../../Common/Buttons/SaveButton";
import {DatePicker} from "../../Common/Nav/DatePicker";
import {Routes} from "../../Common/Routing/Routes";
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
import {getTimePeriods} from "../../Util/DateUtils";
import {Formatting} from "../../Util/Formatting";
import './Rota.scss';
import {StaffedShift} from "./Shift/Shift";

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
    const today = moment.utc(this.props.date);
    const timePeriods = getTimePeriods(this.props.date);
    const editingDisabled = !((this.props.editType === 'rota' && this.props.rota.canEditRota()) || (this.props.editType === 'sign-in' && this.props.rota.canEditSignIn()));
    const labourCost = this.props.editType === 'rota'
      ? this.props.rota.getTotalPredictedLabourCost(this.props.rotasForWeek.getTotalForecastRevenue(today), this.props.workType)
      : this.props.rota.getTotalActualLabourCost(this.props.rota.forecastRevenue, this.props.rotasForWeek.getTotalForecastRevenue(today), this.props.workType);
    return (
      <div>
        <h1 className="rota-title">{this.props.workType} {this.props.title} {this.props.rota.getDate().format(DateFormats.READABLE_WITH_YEAR)}</h1>
        <DatePicker dateParam={this.props.date} urlFromDate={(date: moment.Moment) => this.props.editType === 'rota' ? Routes.rotaUrl(date, this.props.workType) : Routes.signInUrl(date, this.props.workType)}/>
        <div className="rota-overview">
          <div className="rota-stat">
            Status:
            <select value={this.props.rota.status} onChange={ev => this.formUpdate({status: ev.target.value as RotaStatus})}>
              <option disabled={true} value={RotaStatus.NEW}>New</option>
              <option value={RotaStatus.DRAFT}>Draft</option>
              <option value={RotaStatus.ROTA_COMPLETE}>Rota Complete</option>
              <option value={RotaStatus.SIGN_IN_COMPLETE}>Sign In Complete</option>
              <option disabled={true} value={RotaStatus.IMPORTED}>Imported</option>
            </select>
            </div>
          {this.props.showStats && <div className="rota-stat">Constants: {moment.utc(this.props.rota.constants.date).format(DateFormats.API_DATE)}</div>}
          {this.props.showStats && <div className="rota-stat">Forecast revenue: {this.props.rota.forecastRevenue}</div>}
          {this.props.showStats && <div className="rota-stat">Total wage cost: {Formatting.formatCashForDisplay(labourCost)}</div>}
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
              const numberRequired = (this.props.workType === WorkTypes.BAR ? this.props.rota.barRotaTemplate : this.props.rota.kitchenRotaTemplate).staffLevels[timeKey];
              const numberLeft = numberRequired - numberWorking;
              const stylingClass = numberLeft <= 0 ? 'staff-good' : (numberLeft === 1 ? 'staff-ok' : (numberLeft === 2 ? 'staff-mediocre' : 'staff-poor'));
              return <div className={`rota-time staff-level ${stylingClass}`} key={timeKey}>{numberLeft}</div>
            })}
            <div className={`rota-header rota-rate`}/>
          </div>}
          <Prompt when={this.props.rota.touched} message={location => `Are you sure you want to go to ${location.pathname} without saving?`}/>
          {this.getRolesToDisplay().map((role, roleKey) =>
            <div className="rota-role-group" key={roleKey}>
              <div className="rota-role-header">{role.role}</div>
              {this.props.staffMembers
                .filter(staffMember => staffMember.role.id === role.id && staffMember.isActive())
                .sort((a,b) => a.orderInRota < b.orderInRota ? 1 : (a.name > b.name ? 1 : -1))
                .map(staffMember => this.getShiftForStaffMember(staffMember, timePeriods, editingDisabled))
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

  private getShiftForStaffMember(staffMember: StaffMember, timePeriods: moment.Moment[], editingDisabled: boolean) {
    const shift = this.props.shifts.find(s => s.staffMember.id === staffMember.id);
    return shift === undefined
      ? this.getEmptyShift(staffMember, timePeriods, editingDisabled)
      : <StaffedShift key={shift.staffMember.entityId} shift={shift} editingDisabled={editingDisabled} constants={this.props.rota.constants} editType={this.props.editType} workType={this.props.workType} rotaShowRates={this.props.uiState.rotaShowRates} timePeriods={timePeriods} updateShift={s => this.props.updateShift(s)} removeShift={s => this.props.removeShift(s)} />;
  }

  private getEmptyShift(staffMember: StaffMember, timePeriods: moment.Moment[], editingDisabled: boolean) {
    return (
      <div className="rota-shift no-shift" key={staffMember.entityId}>
        <div className="rota-staff-name">{staffMember.name}</div>
        <div className="rota-remove-shift"/>
        <div className="rota-off-floor"/>
        <div className="rota-new-shift">
          <button disabled={editingDisabled} onClick={() => this.newShiftHandler(staffMember)} type="button"><FontAwesomeIcon icon="plus-circle"/></button>
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

  private autoPopulateShifts() {
    const clonedPlannedShifts = this.props.rota.plannedShifts.map(shift => shift.duplicate());
    this.formUpdate({actualShifts: clonedPlannedShifts});
  }
}

export const RotaEditor = DragDropContext(createHTML5Backend)(connect<RotaEditorStateProps, RotaEditorDispatchProps, RotaEditorOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(RotaEditorComponent));