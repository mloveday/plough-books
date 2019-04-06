import {StaffMember} from "../../Model/StaffMember/StaffMember";
import {StaffMemberApiType} from "../../Model/StaffMember/StaffMemberTypes";
import {EditableLocalState, IApiEditableLocalState} from "../EditableLocalState";

export class StaffMembersLocalState extends EditableLocalState<StaffMember> {
  public static default() {
    return new StaffMembersLocalState();
  }

  public constructor() {
    super(
      (obj: StaffMemberApiType) => StaffMember.fromResponse(obj),
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