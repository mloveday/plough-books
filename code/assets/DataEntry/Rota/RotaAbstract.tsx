import * as moment from "moment";
import * as React from "react";
import {match} from "react-router";
import {Constants} from "../../Model/Constants/Constants";
import {RotaStaffingTemplateStatus} from "../../Model/Enum/RotaStaffingTemplateStatus";
import {WorkType, WorkTypes} from "../../Model/Enum/WorkTypes";
import {RotaEntity} from "../../Model/Rota/RotaEntity";
import {RotasForWeek} from "../../Model/Rota/RotasForWeek";
import {RotaUpdateType} from "../../Model/Rota/RotaTypes";
import {Shift} from "../../Model/Shift/Shift";
import {AppState} from "../../redux";
import {CashUpExternalState} from "../../Redux/CashUp/CashUpExternalState";
import {cashUpFetch} from "../../Redux/CashUp/CashUpRedux";
import {ConstantsExternalState} from "../../Redux/Constants/ConstantsExternalState";
import {constantsFetch} from "../../Redux/Constants/ConstantsRedux";
import {RotaExternalState} from "../../Redux/Rota/RotaExternalState";
import {rotaCreate, rotaDataEntry, rotaFetch} from "../../Redux/Rota/RotaRedux";
import {RotaStaffingTemplatesExternalState} from "../../Redux/RotaStaffingTemplates/RotaStaffingTemplatesExternalState";
import {rotaStaffingTemplatesFetch} from "../../Redux/RotaStaffingTemplates/RotaStaffingTemplatesRedux";
import {StaffMembersExternalState} from "../../Redux/StaffMember/StaffMembersExternalState";
import {staffMembersFetch} from "../../Redux/StaffMember/StaffMembersRedux";
import {StaffRolesExternalState} from "../../Redux/StaffRole/StaffRolesExternalState";
import {staffRolesFetch} from "../../Redux/StaffRole/StaffRolesRedux";
import {uiUpdate} from "../../Redux/UI/UiRedux";
import {UiState} from "../../Redux/UI/UiState";
import {momentFromDate} from "../../Util/DateUtils";

export interface RotaAbstractOwnProps {
  match: match<{
    date: string,
    type: WorkType,
  }>;
}

export interface RotaAbstractStateProps {
  constantsExternalState: ConstantsExternalState;
  rotaExternalState: RotaExternalState;
  rotaLocalStates: RotasForWeek;
  rotaStaffingTemplatesState: RotaStaffingTemplatesExternalState;
  staffMembersExternalState: StaffMembersExternalState;
  staffRolesExternalState: StaffRolesExternalState;
  uiState: UiState;
  cashUps: CashUpExternalState;
}

export const mapStateToProps = (state: AppState, ownProps: RotaAbstractOwnProps): RotaAbstractStateProps => {
  return {
    constantsExternalState: state.constantsExternalState,
    rotaExternalState: state.rotaExternalState,
    rotaLocalStates: state.rotaLocalStates,
    rotaStaffingTemplatesState: state.rotaStaffingTemplatesExternalState,
    staffMembersExternalState: state.staffMembersExternalState,
    staffRolesExternalState: state.staffRolesExternalState,
    uiState: state.uiState,
    cashUps: state.cashUpExternalState,
  }
};

export interface RotaAbstractDispatchProps {
  createRota: (rota: RotaEntity) => void;
  fetchConstants: () => void;
  fetchRotaForDate: (date: moment.Moment) => void;
  fetchRotaStaffingTemplates: () => void;
  fetchStaffMembers: () => void;
  fetchStaffRoles: () => void;
  updateRotaLocalState: (state: RotaEntity[]) => void;
  updateUi: (state: UiState) => void;
  fetchCashUp: (date: moment.Moment) => void;
}

export const mapDispatchToProps = (dispatch: any, ownProps: RotaAbstractOwnProps): RotaAbstractDispatchProps => {
  return {
    createRota: (rota: RotaEntity) => dispatch(rotaCreate(rota)),
    fetchConstants: () => dispatch(constantsFetch()),
    fetchRotaForDate: (date: moment.Moment) => dispatch(rotaFetch(date)),
    fetchRotaStaffingTemplates: () => dispatch(rotaStaffingTemplatesFetch()),
    fetchStaffMembers: () => dispatch(staffMembersFetch()),
    fetchStaffRoles: () => dispatch(staffRolesFetch()),
    updateRotaLocalState: (state: RotaEntity[]) => dispatch(rotaDataEntry(state)),
    updateUi: (state: UiState) => dispatch(uiUpdate(state)),
    fetchCashUp: date => dispatch(cashUpFetch(date)),
  };
};

export type RotaAbstractProps = RotaAbstractOwnProps & RotaAbstractStateProps & RotaAbstractDispatchProps;

export abstract class RotaAbstract extends React.Component<RotaAbstractProps, {}> {

  public componentDidMount() {
    this.maintainStateWithUrl();
  }

  public componentDidUpdate() {
    this.maintainStateWithUrl();
  }

  public render() {
    if (!this.props.staffRolesExternalState.isLoaded()
      || !this.getRota()
      || !this.props.staffMembersExternalState.isLoaded()) {
      return null;
    }
    if (this.props.constantsExternalState.isLoaded() && this.props.constantsExternalState.externalState.entities.length === 0) {
      return (<div>No constants found. Cannot create a rota without constants.</div>)
    }
    return this.componentToRender();
  }

  protected abstract componentToRender(): JSX.Element;
  protected abstract getShifts(): void;
  protected abstract addShift(shiftToAdd: Shift): void;
  protected abstract updateShift(shiftToUpdate: Shift): void;
  protected abstract removeShift(shiftToRemove: Shift): void;
  protected abstract requiresCashUp(): boolean;

  protected getRota(): RotaEntity {
    const date = momentFromDate(this.props.match.params.date);
    const localState = this.props.rotaLocalStates.getRotaForDate(date);
    return localState === undefined ? RotaEntity.default(date) : localState;
  }

  protected formUpdate(obj: RotaUpdateType, touched: boolean = true) {
    if (touched) {
      this.props.updateRotaLocalState(
        [this.getRota().updateTouched(obj)]
      );
    } else {
      this.props.updateRotaLocalState(
        [this.getRota().update(obj)]
      );
    }
  }

  protected resetLocalState() {
    const date = momentFromDate(this.props.match.params.date);
    this.props.updateRotaLocalState(
      this.props.rotaExternalState.rotasForWeek.getRotasForWeek(date)
    );
  }

  private maintainStateWithUrl() {
    const paramDate = momentFromDate(this.props.match.params.date);
    if (this.props.uiState.isCurrentDateSameAs(paramDate)) {
      this.props.updateUi(this.props.uiState.withCurrentDate(paramDate));
      return;
    }
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
    if (this.props.rotaExternalState.shouldLoadForDate(paramDate)) {
      this.props.fetchRotaForDate(moment.utc(paramDate));
      return;
    }
    if (this.props.rotaStaffingTemplatesState.isEmpty()) {
      this.props.fetchRotaStaffingTemplates();
      return;
    }
    if (this.requiresCashUp() && this.props.cashUps.shouldLoadForDate(paramDate)) {
      this.props.fetchCashUp(paramDate);
      return;
    }
    const rota = this.getRota();
    const staffingTemplate = this.props.match.params.type === WorkTypes.BAR ? rota.barRotaTemplate : rota.kitchenRotaTemplate;
    if (staffingTemplate.status === RotaStaffingTemplateStatus.INACTIVE) {
      const barTemplate = this.props.rotaStaffingTemplatesState.externalState.entities
        .filter(template =>
          template.status === RotaStaffingTemplateStatus.ACTIVE
          && template.revenue <= rota.forecastRevenue
          && template.workType === WorkTypes.BAR
          && template.dayOfWeek === momentFromDate(this.props.match.params.date).isoWeekday()
        )
        .sort((a,b) => a.revenue > b.revenue ? 1 : -1)
        .pop();
      const kitchenTemplate = this.props.rotaStaffingTemplatesState.externalState.entities
        .filter(template =>
          template.status === RotaStaffingTemplateStatus.ACTIVE
          && template.revenue <= rota.forecastRevenue
          && template.workType === WorkTypes.KITCHEN
          && template.dayOfWeek === momentFromDate(this.props.match.params.date).isoWeekday()
        )
        .sort((a,b) => a.revenue > b.revenue ? 1 : -1)
        .pop();
      if (barTemplate !== undefined || kitchenTemplate !== undefined) {
        this.formUpdate({
          barRotaTemplate: barTemplate !== undefined ? barTemplate : rota.barRotaTemplate,
          kitchenRotaTemplate: kitchenTemplate !== undefined ? kitchenTemplate : rota.kitchenRotaTemplate,
        }, false);
        return;
      }
    }

    if (this.props.constantsExternalState.isLoaded() && this.props.constantsExternalState.externalState.entities.length === 0) {
      return;
    }
    if (this.props.constantsExternalState.isLoaded() && this.props.rotaExternalState.isLoaded() && this.getRota().constants.id === undefined && this.props.constantsExternalState.externalState) {
      this.formUpdate({constants: this.props.constantsExternalState.externalState.entities.length > 0 ? this.props.constantsExternalState.externalState.entities.slice(0,1)[0] : Constants.default()}, false);
    }
  }
}