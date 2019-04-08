import * as React from "react";
import {connect} from "react-redux";
import {WorkTypes} from "../../Model/Enum/WorkTypes";
import {Shift} from "../../Model/Shift/Shift";
import {
  mapDispatchToProps,
  mapStateToProps,
  RotaAbstract,
  RotaAbstractDispatchProps,
  RotaAbstractOwnProps,
  RotaAbstractStateProps
} from "./RotaAbstract";
import {RotaEditor} from "./RotaEditor";

class RotaComponent extends RotaAbstract {

  protected componentToRender() {
    const rota = this.getRota();
    return <RotaEditor
      title={'Rota'}
      workType={this.props.match.params.type as WorkTypes}
      date={this.props.match.params.date}
      editType={'rota'}
      rota={rota}
      rotasForWeek={this.props.rotaLocalStates}
      shifts={rota.plannedShifts}
      showStaffLevels={true}
      showStats={true}
      staffMembers={this.props.staffMembersExternalState.externalState.entities}
      addShift={shift => this.addShift(shift)}
      removeShift={shift => this.removeShift(shift)}
      updateShift={shift => this.updateShift(shift)}
    />;
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
}
export const Rota = connect<RotaAbstractStateProps, RotaAbstractDispatchProps, RotaAbstractOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(RotaComponent);