import {StaffMember} from "../../Rota/State/StaffMember";

export class StaffMembersLocalState {
  public static default() {
    return new StaffMembersLocalState();
  }

  public readonly members: StaffMember[] = [];
  
  public with(obj: any) {
    return Object.assign(
      new StaffMembersLocalState(),
      {members: obj.map((member: any) => StaffMember.default().with(member))
        .sort((a: StaffMember, b: StaffMember) => a.name > b.name ? 1 : -1)}
    );
  }
}