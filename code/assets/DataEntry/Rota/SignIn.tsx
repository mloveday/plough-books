import * as React from "react";
import {connect} from "react-redux";
import {ShiftRecordingTypes} from "../../Model/Enum/ShiftRecordingType";
import {WorkType, WorkTypes} from "../../Model/Enum/WorkTypes";
import {Shift} from "../../Model/Shift/Shift";
import {AncillaryRotaEditor, AncillaryRotaEditorOwnProps} from "./AncillaryRotaEditor";
import {
  mapDispatchToProps,
  mapStateToProps,
  RotaAbstract,
  RotaAbstractDispatchProps,
  RotaAbstractOwnProps,
  RotaAbstractStateProps
} from "./RotaAbstract";
import {RotaEditor, RotaEditorOwnProps} from "./RotaEditor";

class SignInComponent extends RotaAbstract {

  protected componentToRender(): JSX.Element {
    const rota = this.getRota();
    const props: RotaEditorOwnProps|AncillaryRotaEditorOwnProps = {
      title: 'Sign-in',
      workType: this.props.match.params.type as WorkType,
      date: this.props.match.params.date,
      editType: ShiftRecordingTypes.SIGN_IN,
      rota,
      rotasForWeek: this.props.rotaLocalStates,
      cashUps: this.props.cashUps.cashUpsForWeek,
      shifts: rota.actualShifts,
      showStaffLevels: false,
      showStats: true,
      staffMembers: this.props.staffMembersExternalState.externalState.entities,
      holidays: this.props.holidayExternalState.externalState.entities,
      addShift: (shift: Shift) => this.addShift(shift),
      removeShift: (shift: Shift) => this.removeShift(shift),
      updateShift: (shift: Shift) => this.updateShift(shift),
      resetRota: () => this.resetLocalState(),
    };
    return this.props.match.params.type as WorkType === WorkTypes.ANCILLARY
      ? <AncillaryRotaEditor {...props}/>
      : <RotaEditor {...props}/>;
  }

  protected getShifts() {
    return this.getRota().actualShifts;
  }

  protected addShift(shiftToAdd: Shift) {
    const clonedShifts = this.getShifts().map(shift => shift.clone());
    clonedShifts.push(shiftToAdd);
    this.formUpdate({actualShifts: clonedShifts});
  }

  protected updateShift(shiftToUpdate: Shift) {
    const clonedShifts = this.getShifts().map(shift => shift.staffMember.id === shiftToUpdate.staffMember.id ? shiftToUpdate : shift.clone());
    this.formUpdate({actualShifts: clonedShifts});
  }

  protected removeShift(shiftToRemove: Shift) {
    const clonedShifts = this.getShifts()
      .filter(shift => shift.staffMember.id !== shiftToRemove.staffMember.id)
      .map(shift => shift.clone());
    this.formUpdate({actualShifts: clonedShifts});
  }

  protected requiresCashUp(): boolean {
    return true;
  }
}

export const SignIn = connect<RotaAbstractStateProps, RotaAbstractDispatchProps, RotaAbstractOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(SignInComponent);