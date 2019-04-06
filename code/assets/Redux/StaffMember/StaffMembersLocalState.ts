import {EditableLocalState, IApiEditableLocalState} from "../../State/EditableLocalState";
import {StaffMember} from "../../Model/StaffMember/StaffMember";
import {StaffMemberApiType} from "../../Model/StaffMember/StaffMemberTypes";

export class StaffMembersLocalState extends EditableLocalState<StaffMember, StaffMember> {
  public static default() {
    return new StaffMembersLocalState();
  }

  public constructor() {
    super(
      (obj: StaffMemberApiType) => StaffMember.fromResponse(obj),
      (a: StaffMember, b: StaffMember) => a.name > b.name ? 1 : -1
    );
  }

  public with(obj: IApiEditableLocalState<StaffMember, StaffMember>) {
    return Object.assign(
      new StaffMembersLocalState(),
      this,
      obj,
    );
  }
}