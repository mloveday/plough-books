import {EditableLocalState, IApiEditableLocalState} from "../../../State/EditableLocalState";
import {IApiStaffMemberObject, StaffMember} from "../../Rota/State/StaffMember";
import {StaffMemberNotPersisted} from "../../Rota/State/StaffMemberNotPersisted";

export class StaffMembersLocalState extends EditableLocalState<StaffMemberNotPersisted, StaffMember> {
  public static default() {
    return new StaffMembersLocalState();
  }

  public constructor() {
    super(
      (obj: IApiStaffMemberObject) => StaffMember.fromResponse(obj),
      (a: StaffMember, b: StaffMember) => a.name > b.name ? 1 : -1
    );
  }

  public with(obj: IApiEditableLocalState<StaffMemberNotPersisted, StaffMember>) {
    return Object.assign(
      new StaffMembersLocalState(),
      this,
      obj,
    );
  }
}