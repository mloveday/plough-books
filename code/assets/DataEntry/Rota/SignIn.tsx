import {connect} from "react-redux";
import {
  mapDispatchToProps,
  mapStateToProps,
  RotaAbstractComponent,
  RotaAbstractDispatchProps,
  RotaAbstractOwnProps,
  RotaAbstractStateProps
} from "./RotaAbstract";
import {Shift} from "../../Model/Shift/Shift";

class SignInComponent extends RotaAbstractComponent {
  protected getName(): string {
    return "Sign-in";
  }

  protected showStats(): boolean {
    return true;
  }

  protected showStaffLevels(): boolean {
    return false;
  }

  protected canAutoPopulateFromRota(): boolean {
    return true;
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
}
export const SignIn = connect<RotaAbstractStateProps, RotaAbstractDispatchProps, RotaAbstractOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(SignInComponent);