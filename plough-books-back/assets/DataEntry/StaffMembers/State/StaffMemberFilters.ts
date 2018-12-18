import {StaffMemberStatus} from "../../../Enum/StaffMemberStatus";

export class StaffMemberFilters {
  public readonly status: StaffMemberStatus = StaffMemberStatus.ACTIVE;
  public readonly statusFiltered: boolean = true;

  public readonly pageNumber: number = 1;
  public readonly pageSize: number = 20;

  public with(obj: any) {
    return Object.assign(
      new StaffMemberFilters(),
      this,
      obj
    );
  }
}