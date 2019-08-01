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

class RotaComponent extends RotaAbstract {

  protected componentToRender() {
    const rota = this.getRota();
    const props: RotaEditorOwnProps|AncillaryRotaEditorOwnProps = {
      title: 'Rota',
      workType: this.props.match.params.type as WorkType,
      date: this.props.match.params.date,
      editType: ShiftRecordingTypes.ROTA,
      rota,
      rotasForWeek: this.props.rotaLocalStates,
      shifts: rota.plannedShifts,
      showStaffLevels: true,
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
    return this.getRota().plannedShifts;
  }

  protected addShift(shiftToAdd: Shift) {
    const clonedShifts = this.getShifts().map(shift => shift.clone());
    clonedShifts.push(shiftToAdd);
    this.formUpdate({plannedShifts: clonedShifts});
  }

  protected updateShift(shiftToUpdate: Shift) {
    const clonedShifts = this.getShifts().map(shift => shift.staffMember.id === shiftToUpdate.staffMember.id ? shiftToUpdate : shift.clone());
    this.formUpdate({plannedShifts: clonedShifts});
  }

  protected removeShift(shiftToRemove: Shift) {
    const clonedShifts = this.getShifts()
      .filter(shift => shift.staffMember.id !== shiftToRemove.staffMember.id)
      .map(shift => shift.clone());
    this.formUpdate({plannedShifts: clonedShifts});
  }

  protected requiresCashUp(): boolean {
    return false;
  }
}
export const Rota = connect<RotaAbstractStateProps, RotaAbstractDispatchProps, RotaAbstractOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(RotaComponent);