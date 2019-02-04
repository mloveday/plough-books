import {EditableLocalState, IApiEditableLocalState} from "../../../State/EditableLocalState";
import {IApiStaffMemberObject, StaffMember} from "../../Rota/State/StaffMember";

export class StaffMembersLocalState extends EditableLocalState<StaffMember> {
  public static default() {
    return new StaffMembersLocalState();
  }

  public constructor() {
    super(
      (obj: IApiStaffMemberObject) => StaffMember.default().with(obj),
      (a: StaffMember, b: StaffMember) => a.name > b.name ? 1 : -1
    );
  }

  public with(obj: IApiEditableLocalState<StaffMember>) {
    return Object.assign(
      new StaffMembersLocalState(),
      this,
      obj,
    );
  }
}