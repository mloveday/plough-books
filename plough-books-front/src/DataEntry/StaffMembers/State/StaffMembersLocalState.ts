import {StaffMember} from "../../Rota/State/StaffMember";

export class StaffMembersLocalState {
  public static default() {
    return new StaffMembersLocalState();
  }

  private static NOT_EDITING_ID = -1;

  public readonly editingMemberId: number = StaffMembersLocalState.NOT_EDITING_ID;
  public readonly isCreatingMember: boolean = false;
  public readonly members: StaffMember[] = [];
  public readonly newMember: StaffMember;

  public withNewMember(member: StaffMember) {
    return this.with({
      isCreatingMember: true,
      members: this.members.map(m => m.with({})),
      newMember: member,
    });
  }
  
  public withMembers(obj: any[], editingMemberId: number = StaffMembersLocalState.NOT_EDITING_ID) {
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

  public with(obj: any) {
    return Object.assign(
      new StaffMembersLocalState(),
      this,
      obj,
    );
  }

  public isEditing() {
    return this.editingMemberId !== StaffMembersLocalState.NOT_EDITING_ID;
  }
}