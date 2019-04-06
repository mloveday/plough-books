import {StaffMemberStatus} from "../../../Model/Enum/StaffMemberStatus";

export interface IStaffMemberFiltersUpdateObject {
  status?: StaffMemberStatus;
  statusFiltered?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export class StaffMemberFilters {
  public readonly status: StaffMemberStatus = StaffMemberStatus.ACTIVE;
  public readonly statusFiltered: boolean = true;

  public readonly pageNumber: number = 1;
  public readonly pageSize: number = 20;

  public with(obj: IStaffMemberFiltersUpdateObject) {
    return Object.assign(
      new StaffMemberFilters(),
      this,
      obj
    );
  }
}