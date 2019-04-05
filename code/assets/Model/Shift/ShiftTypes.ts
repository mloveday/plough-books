import {ApiType, EntityType, InputType, UpdateType} from "../../State/TypeWithNumericalInputs";
import {StaffMember} from "../StaffMember/StaffMember";
import {StaffMemberApiType} from "../StaffMember/StaffMemberTypes";
import {StaffRole} from "../StaffRole/StaffRole";
import {StaffRoleApiType} from "../StaffRole/StaffRoleTypes";

export abstract class ShiftAbstract<T, SM, SR> {
  public readonly staffMember: SM;
  public readonly staffRole: SR;
  public readonly status: string;
  public readonly hourlyRate: number;
  public readonly date: string;
  public readonly totalBreaks: T;
  public readonly type: string;
  public readonly endTime: string;
  public readonly startTime: string;

  constructor(staffMember: SM, staffRole: SR, status: string, hourlyRate: number, date: string, startTime: string, endTime: string, totalBreaks: T, type: string, startTimeInputValue?: string, endTimeInputValue?: string, id?: number) {
    this.staffMember = staffMember;
    this.staffRole = staffRole;
    this.status = status;
    this.hourlyRate = hourlyRate;
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.totalBreaks = totalBreaks;
    this.type = type;
  }
}
export type ShiftApiType = ApiType<ShiftAbstract<number, StaffMemberApiType, StaffRoleApiType>>;
export type ShiftUpdateType = UpdateType<ShiftAbstract<string, StaffMember, StaffRole>>;
export type ShiftInputType = InputType<ShiftAbstract<string, undefined, undefined>>;
export type ShiftType = EntityType<ShiftAbstract<number, StaffMember, StaffRole>, ShiftAbstract<string, undefined, undefined>>;