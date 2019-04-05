import * as moment from "moment";
import {WorkTypes} from "../../../Enum/WorkTypes";
import {DateFormats} from "../../../Util/DateFormats";
import {momentFromDateAndTime} from "../../../Util/DateUtils";
import {StaffMember} from "../../StaffMembers/State/StaffMember";
import {StaffMemberApiType} from "../../StaffMembers/State/StaffMemberTypes";
import {StaffRole} from "../../StaffRoles/State/StaffRole";
import {StaffRoleApiType} from "../../StaffRoles/State/StaffRoleTypes";

export interface IShiftApiObject {
  id?: number;
  staffMember: StaffMemberApiType;
  staffRole: StaffRoleApiType;
  status: string;
  hourlyRate: number;
  date: string;
  totalBreaks: number;
  startTimeInputValue: string;
  endTimeInputValue: string;
  type: string;
  endTime: string;
  startTime: string;
}

export interface IShiftUpdateObject {
  id?: number;
  staffMember?: StaffMember;
  staffRole?: StaffRole;
  status?: string;
  hourlyRate?: number;
  date?: string;
  totalBreaks?: number;
  startTimeInputValue?: string;
  endTimeInputValue?: string;
  type?: string;
  endTime?: string;
  startTime?: string;
}

export class Shift {

  public static fromOtherShift(shift: Shift) {
    return new Shift(shift.staffMember, shift.staffRole, shift.status, shift.hourlyRate, shift.date, shift.startTime, shift.endTime, shift.totalBreaks, shift.type, shift.startTime, shift.endTime, shift.id);
  }

  public static defaultFor(staffMember: StaffMember, type: WorkTypes, date: string): Shift {
    return new Shift(staffMember, staffMember.role, 'active', staffMember.currentHourlyRate, date, '08:00', '17:00', 0.5, type, '08:00', '17:00');
  }

  public static fromPartial(obj: IShiftUpdateObject, type: WorkTypes, date: string): Shift {
    return Shift.defaultFor(
      StaffMember.default(),
      type,
      date
    ).update(obj);
  }

  public static fromResponse(obj: IShiftApiObject, date: string): Shift {
    return new Shift(
      StaffMember.fromResponse(obj.staffMember),
      StaffRole.fromResponse(obj.staffRole),
      obj.status,
      obj.hourlyRate,
      date,
      obj.startTime,
      obj.endTime,
      obj.totalBreaks,
      obj.type,
      obj.startTimeInputValue,
      obj.endTimeInputValue,
      obj.id,
    );
  }

  public readonly id: number;
  public readonly staffMember: StaffMember;
  public readonly staffRole: StaffRole;
  public readonly status: string;
  public readonly hourlyRate: number;
  public readonly date: string;
  public readonly totalBreaks: number;
  public readonly startTimeInputValue: string;
  public readonly endTimeInputValue: string;
  public readonly type: string;
  public readonly endTime: string;
  public readonly startTime: string;

  private constructor(staffMember: StaffMember, staffRole: StaffRole, status: string, hourlyRate: number, date: string, startTime: string, endTime: string, totalBreaks: number, type: string, startTimeInputValue?: string, endTimeInputValue?: string, id?: number) {
    this.staffMember = staffMember;
    this.staffRole = staffRole;
    this.status = status;
    this.hourlyRate = hourlyRate;
    this.date = date;
    this.startTime = momentFromDateAndTime(date, startTime, true).format(DateFormats.TIME_LEADING_ZERO);
    this.endTime = momentFromDateAndTime(date, endTime, true).format(DateFormats.TIME_LEADING_ZERO);
    this.totalBreaks = totalBreaks;
    this.startTimeInputValue = startTimeInputValue ? startTimeInputValue : startTime;
    this.endTimeInputValue = endTimeInputValue ? endTimeInputValue : endTime;
    this.type = type;
    if (id !== undefined) {
      this.id = id;
    }
  }

  public isWorkingAtTime(time: moment.Moment) {
    return (time.isSameOrAfter(this.getStartTime()) && time.isBefore(this.getEndTime()));
  }

  public update(obj: IShiftUpdateObject): Shift {
    const date = obj.date ? obj.date : this.date;
    return new Shift(
      obj.staffMember ? obj.staffMember : this.staffMember,
      obj.staffRole ? obj.staffRole : this.staffRole.with({}),
      obj.status ? obj.status : this.status,
      obj.hourlyRate ? obj.hourlyRate : this.hourlyRate,
      date,
      obj.startTime ? obj.startTime : this.startTime,
      obj.endTime ? obj.endTime : this.endTime,
      obj.totalBreaks ? obj.totalBreaks : this.totalBreaks,
      obj.type ? obj.type : this.type,
      obj.startTimeInputValue ? obj.startTimeInputValue : this.startTimeInputValue,
      obj.endTimeInputValue ? obj.endTimeInputValue : this.endTimeInputValue,
      obj.id ? obj.id : this.id,
    );
  }

  public clone(): Shift {
    return Shift.fromOtherShift(this);
  }
  
  public getRawCost() {
    return Math.max(this.hourlyRate * ((this.getEndTime().diff(this.getStartTime(), "minutes") / 60) - this.totalBreaks), 0)
  }

  public getStartTime(): moment.Moment {
    const timeAndDate = momentFromDateAndTime(this.date, this.startTime);
    if (timeAndDate.hour() < 6) {
      timeAndDate.add(1, 'day');
    }
    return timeAndDate;
  }

  public getEndTime(): moment.Moment {
    const timeAndDate = momentFromDateAndTime(this.date, this.endTime);
    if (timeAndDate.hour() < 6) {
      timeAndDate.add(1, 'day');
    }
    return timeAndDate;
  }

  public forApi() {
    return Object.assign(
      this.clone(),
      {
        endTime: this.getEndTime().format(),
        startTime: this.getStartTime().format(),
      }
    );
  }
}