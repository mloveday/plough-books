import {StaffMemberStatus} from "../../../Model/Enum/StaffMemberStatus";
import {StaffRole} from "../../../Model/StaffRole/StaffRole";

export interface IStaffMemberFiltersUpdateObject {
  status?: StaffMemberStatus;
  statusFiltered?: boolean;
  role?: StaffRole;
  roleFiltered?: boolean;
  textSearch?: string;
  pageNumber?: number;
  pageSize?: number;
}

export class StaffMemberFilters {
  public readonly status: StaffMemberStatus = StaffMemberStatus.ACTIVE;
  public readonly statusFiltered: boolean = true;

  public readonly role: StaffRole = StaffRole.default();
  public readonly roleFiltered: boolean = false;

  public readonly textSearch: string = '';

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