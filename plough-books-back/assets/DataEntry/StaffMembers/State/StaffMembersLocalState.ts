import {EditableLocalState} from "../../../State/EditableLocalState";
import {StaffMember} from "../../Rota/State/StaffMember";

export class StaffMembersLocalState extends EditableLocalState<StaffMember> {
  public static default() {
    return new StaffMembersLocalState();
  }

  public constructor() {
    super(
      (obj:any) => StaffMember.default().with(obj),
      (a: StaffMember, b: StaffMember) => a.name > b.name ? 1 : -1
    );
  }

  public with(obj: any) {
    return Object.assign(
      new StaffMembersLocalState(),
      this,
      obj,
    );
  }
}