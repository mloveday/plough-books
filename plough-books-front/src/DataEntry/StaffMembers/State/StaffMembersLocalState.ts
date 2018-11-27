import {StaffMember} from "../../Rota/State/StaffMember";

export class StaffMembersLocalState {
  public static default() {
    return new StaffMembersLocalState();
  }

  private static NOT_EDITING_ID = -1;

  public readonly members: StaffMember[] = [];
  public readonly editingMemberId: number = StaffMembersLocalState.NOT_EDITING_ID;
  
  public with(obj: any[], editingMemberId: number = StaffMembersLocalState.NOT_EDITING_ID) {
    const newStaffMembers = new Map<number, StaffMember>();
    obj.forEach(v => {
      newStaffMembers.set(v.id, StaffMember.default().with(v))
    });
    const staffMembers = new Map<number, StaffMember>();
    this.members.forEach(v => {
      const staffMember = newStaffMembers.get(v.id);
      staffMembers.set(v.id, staffMember ? staffMember : v.with({}));
    });
    newStaffMembers.forEach((v,k) => staffMembers.set(k, v));
    return Object.assign(
      new StaffMembersLocalState(),
      this,
      {
        editingMemberId,
        members: Array.from(staffMembers.values()).sort((a: StaffMember, b: StaffMember) => a.name > b.name ? 1 : -1)
      }
    );
  }

  public isEditing() {
    return this.editingMemberId !== StaffMembersLocalState.NOT_EDITING_ID;
  }
}