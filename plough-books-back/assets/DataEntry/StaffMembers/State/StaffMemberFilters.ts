import {StaffMemberStatus} from "../../../Enum/StaffMemberStatus";

export class StaffMemberFilters {
  public readonly status: StaffMemberStatus = StaffMemberStatus.ACTIVE;
  public readonly statusFiltered: boolean = true;

  public with(obj: any) {
    return Object.assign(
      new StaffMemberFilters(),
      this,
      obj
    );
  }
}