import * as moment from "moment";
import {WorkTypes} from "../../../Enum/WorkTypes";
import {DateFormats} from "../../../Util/DateFormats";
import {momentFromDateAndTime} from "../../../Util/DateUtils";
import {StaffMember} from "./StaffMember";
import {StaffRole} from "./StaffRole";

export class Shift {

  public static default() {
    return new Shift(StaffMember.default(), StaffRole.default(), 'inactive', 0, moment.utc().format(DateFormats.API), '10:00', '17:00', 0, WorkTypes.BAR, '10:00', '17:00');
  }

  public static fromOtherShift(shift: Shift) {
    return new Shift(shift.staffMember, shift.staffRole, shift.status, shift.hourlyRate, shift.date, shift.startTime, shift.endTime, shift.totalBreaks, shift.type, shift.startTime, shift.endTime, shift.id);
  }

  public static fromApi(obj: any, date: string): Shift {
    obj.date = date;
    return Shift.default().fromApi(obj);
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
  private readonly endTime: string;
  private readonly startTime: string;

  private constructor(staffMember: StaffMember, staffRole: StaffRole, status: string, hourlyRate: number, date: string, startTime: string, endTime: string, totalBreaks: number, type: string, startTimeInputValue?: string, endTimeInputValue?: string, id?: number) {
    this.staffMember = staffMember;
    this.staffRole = staffRole;
    this.status = status;
    this.hourlyRate = hourlyRate;
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
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

  public fromApi(obj: any): Shift {
    return new Shift(
      obj.staffMember ? StaffMember.default().with(obj.staffMember) : this.staffMember,
      obj.staffRole ? this.staffRole.with(obj.staffRole) : this.staffRole.with({}),
      obj.status ? obj.status : this.status,
      obj.hourlyRate ? obj.hourlyRate : this.hourlyRate,
      obj.date ? obj.date : this.date,
      obj.startTime ? moment.utc(obj.startTime).format('HH:mm') : this.startTime,
      obj.endTime ? moment.utc(obj.endTime).format('HH:mm') : this.endTime,
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