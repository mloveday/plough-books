import * as moment from "moment";
import * as React from "react";
import {match} from "react-router";
import {Constants} from "../../Model/Constants/Constants";
import {RotaEntity} from "../../Model/Rota/RotaEntity";
import {RotasForWeek} from "../../Model/Rota/RotasForWeek";
import {RotaUpdateType} from "../../Model/Rota/RotaTypes";
import {Shift} from "../../Model/Shift/Shift";
import {AppState} from "../../redux";
import {ConstantsExternalState} from "../../Redux/Constants/ConstantsExternalState";
import {constantsFetch} from "../../Redux/Constants/ConstantsRedux";
import {RotaExternalState} from "../../Redux/Rota/RotaExternalState";
import {rotaCreate, rotaDataEntry, rotaFetch} from "../../Redux/Rota/RotaRedux";
import {StaffMembersExternalState} from "../../Redux/StaffMember/StaffMembersExternalState";
import {staffMembersFetch} from "../../Redux/StaffMember/StaffMembersRedux";
import {StaffRolesExternalState} from "../../Redux/StaffRole/StaffRolesExternalState";
import {staffRolesFetch} from "../../Redux/StaffRole/StaffRolesRedux";
import {uiUpdate} from "../../Redux/UI/UiRedux";
import {UiState} from "../../Redux/UI/UiState";

export interface RotaAbstractOwnProps {
  match: match<{
    date: string,
    type: string,
  }>;
}

export interface RotaAbstractStateProps {
  constantsExternalState: ConstantsExternalState;
  rotaExternalState: RotaExternalState;
  rotaLocalStates: RotasForWeek;
  staffMembersExternalState: StaffMembersExternalState;
  staffRolesExternalState: StaffRolesExternalState;
  uiState: UiState;
}

export const mapStateToProps = (state: AppState, ownProps: RotaAbstractOwnProps): RotaAbstractStateProps => {
  return {
    constantsExternalState: state.constantsExternalState,
    rotaExternalState: state.rotaExternalState,
    rotaLocalStates: state.rotaLocalStates,
    staffMembersExternalState: state.staffMembersExternalState,
    staffRolesExternalState: state.staffRolesExternalState,
    uiState: state.uiState,
  }
};

export interface RotaAbstractDispatchProps {
  createRota: (rota: RotaEntity) => void;
  fetchConstants: () => void;
  fetchRotaForDate: (date: moment.Moment) => void;
  fetchStaffMembers: () => void;
  fetchStaffRoles: () => void;
  updateRotaLocalState: (state: RotaEntity[]) => void;
  updateUi: (state: UiState) => void;
}

export const mapDispatchToProps = (dispatch: any, ownProps: RotaAbstractOwnProps): RotaAbstractDispatchProps => {
  return {
    createRota: (rota: RotaEntity) => dispatch(rotaCreate(rota)),
    fetchConstants: () => dispatch(constantsFetch()),
    fetchRotaForDate: (date: moment.Moment) => dispatch(rotaFetch(date)),
    fetchStaffMembers: () => dispatch(staffMembersFetch()),
    fetchStaffRoles: () => dispatch(staffRolesFetch()),
    updateRotaLocalState: (state: RotaEntity[]) => dispatch(rotaDataEntry(state)),
    updateUi: (state: UiState) => dispatch(uiUpdate(state)),
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

  protected getRota(): RotaEntity {
    const date = moment.utc(this.props.match.params.date);
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

  private maintainStateWithUrl() {
    const paramDate = moment.utc(this.props.match.params.date);
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
    if (this.props.constantsExternalState.isLoaded() && this.props.constantsExternalState.externalState.entities.length === 0) {
      return;
    }
    if (this.props.constantsExternalState.isLoaded() && this.props.rotaExternalState.isLoaded() && this.getRota().constants.id === undefined && this.props.constantsExternalState.externalState) {
      this.formUpdate({constants: this.props.constantsExternalState.externalState.entities.length > 0 ? this.props.constantsExternalState.externalState.entities.slice(0,1)[0] : Constants.default()}, false);
    }
  }
}