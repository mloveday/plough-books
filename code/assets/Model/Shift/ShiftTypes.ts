import {WorkType} from "../Enum/WorkTypes";
import {StaffMember} from "../StaffMember/StaffMember";
import {StaffMemberApiType} from "../StaffMember/StaffMemberTypes";
import {StaffRole} from "../StaffRole/StaffRole";
import {StaffRoleApiType} from "../StaffRole/StaffRoleTypes";
import {ApiType, EntityType, InputType, UpdateType} from "../TypeWithNumericalInputs";

export abstract class ShiftAbstract<T, SM, SR, D> {
  public readonly staffMember: SM;
  public readonly staffRole: SR;
  public readonly status: string;
  public readonly hourlyRate: T;
  public readonly date: string;
  public readonly totalBreaks: T;
  public readonly type: WorkType;
  public readonly endTime: D;
  public readonly startTime: D;
  public readonly offFloor: boolean;

  constructor(staffMember: SM, staffRole: SR, status: string, hourlyRate: T, date: string, startTime: D, endTime: D, totalBreaks: T, type: WorkType, offFloor: boolean) {
    this.staffMember = staffMember;
    this.staffRole = staffRole;
    this.status = status;
    this.hourlyRate = hourlyRate;
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.totalBreaks = totalBreaks;
    this.type = type;
    this.offFloor = offFloor;
  }
}
export interface ShiftDate { date: string; time: string; }
export type ShiftApiType = ApiType<ShiftAbstract<number, StaffMemberApiType, StaffRoleApiType, string>>;
export type ShiftUpdateType = UpdateType<ShiftAbstract<string, StaffMember, StaffRole, ShiftDate>>;
type Inputs = ShiftAbstract<string, undefined, undefined, ShiftDate>;
export type ShiftInputType = InputType<Inputs>;
export type ShiftType = EntityType<ShiftAbstract<number, StaffMember, StaffRole, string>, Inputs>;