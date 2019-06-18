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
import {getTimePeriods, momentFromDate} from "../../Util/DateUtils";
import {Formatting} from "../../Util/Formatting";
import './Rota.scss';
import {EmptyShift} from "./RotaEditor/EmptyShift";
import {RotaHeader} from "./RotaEditor/RotaHeader";
import {RotaStaffLevels} from "./RotaEditor/RotaStaffLevels";
import {StaffedShift} from "./RotaEditor/Shift";

export interface RotaEditorOwnProps {
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

export interface RotaEditorStateProps {
  uiState: UiState;
}

export const mapStateToProps = (state: AppState, ownProps: RotaEditorOwnProps): RotaEditorStateProps => {
  return {
    uiState: state.uiState,
  }
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
    const today = momentFromDate(this.props.date);
    const timePeriods = getTimePeriods(this.props.date);
    const editingDisabled = !((this.props.editType === 'rota' && this.props.rota.canEditRota()) || (this.props.editType === 'sign-in' && this.props.rota.canEditSignIn()));
    const labourCost = this.props.editType === 'rota'
      ? this.props.rota.getTotalPredictedLabourCost(this.props.rotasForWeek.getTotalForecastRevenue(today), this.props.workType)
      : this.props.rota.getTotalActualLabourCost(this.props.rota.forecastRevenue, this.props.rotasForWeek.getTotalForecastRevenue(today), this.props.workType);
    return (
      <div>
        <Prompt when={this.props.rota.touched} message={location => `Are you sure you want to go to ${location.pathname} without saving?`}/>
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
          {this.props.showStats && <div className="rota-stat">Constants: {momentFromDate(this.props.rota.constants.date).format(DateFormats.API_DATE)}</div>}
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
          <RotaHeader date={this.props.date}/>
          {this.props.showStaffLevels && <RotaStaffLevels rota={this.props.rota} workType={this.props.workType}/>}
          {this.getRolesToDisplay().map(role =>
            <div className="rota-role-group" key={role.id}>
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
      ? <EmptyShift key={staffMember.id} workType={this.props.workType} date={this.props.date} editingDisabled={editingDisabled} addShift={s => this.props.addShift(s)} staffMember={staffMember} timePeriods={timePeriods}/>
      : <StaffedShift key={shift.staffMember.id} shift={shift} editingDisabled={editingDisabled} constants={this.props.rota.constants} editType={this.props.editType} workType={this.props.workType} rotaShowRates={this.props.uiState.rotaShowRates} timePeriods={timePeriods} updateShift={s => this.props.updateShift(s)} removeShift={s => this.props.removeShift(s)} />;
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

  private autoPopulateShifts() {
    const clonedPlannedShifts = this.props.rota.plannedShifts.map(shift => shift.duplicate());
    this.formUpdate({actualShifts: clonedPlannedShifts});
  }
}

export const RotaEditor = connect<RotaEditorStateProps, RotaEditorDispatchProps, RotaEditorOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(RotaEditorComponent);