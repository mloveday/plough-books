import {StaffMemberStatus} from "../../../Model/Enum/StaffMemberStatus";
import {StaffMember} from "../../../Model/StaffMember/StaffMember";
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

  public shouldShowStaffMember(staffMember: StaffMember) {
    return (!this.statusFiltered || this.status === staffMember.status)
      && (!this.roleFiltered || this.role.id === staffMember.role.id)
      && staffMember.name.toLowerCase().includes(this.textSearch.toLowerCase());
  }
}