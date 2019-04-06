import {connect} from "react-redux";
import {Shift} from "../../Model/Shift/Shift";
import {
  mapDispatchToProps,
  mapStateToProps,
  RotaAbstractComponent,
  RotaAbstractDispatchProps,
  RotaAbstractOwnProps,
  RotaAbstractStateProps
} from "./RotaAbstract";

class RotaComponent extends RotaAbstractComponent {
  protected getName(): string {
    return "Rota";
  }

  protected showingRota(): boolean {
    return true;
  }

  protected showingSignIn(): boolean {
    return false;
  }

  protected showStats(): boolean {
    return true;
  }

  protected showStaffLevels(): boolean {
    return true;
  }

  protected canAutoPopulateFromRota(): boolean {
    return false;
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