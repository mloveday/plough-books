import * as moment from "moment";
import {WorkTypes} from "../../../Enum/WorkTypes";
import {DateFormats} from "../../../Util/DateFormats";
import {momentFromDateAndTime} from "../../../Util/DateUtils";
import {StaffMember} from "./StaffMember";
import {StaffRole} from "./StaffRole";

export class Shift {

  public static default() {
    return new Shift(StaffMember.default(), StaffRole.default(), 'inactive', 0, moment.utc().format(DateFormats.API), '10:00', '17:00', 0, WorkTypes.BAR);
  }

  public static fromOtherShift(shift: Shift) {
    return new Shift(shift.staffMember, shift.staffRole, shift.status, shift.hourlyRate, shift.date, shift.startTime, shift.endTime, shift.totalBreaks, shift.type);
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

  constructor(staffMember: StaffMember, staffRole: StaffRole, status: string, hourlyRate: number, date: string, startTime: string, endTime: string, totalBreaks: number, type: string) {
    this.staffMember = staffMember;
    this.staffRole = staffRole;
    this.status = status;
    this.hourlyRate = hourlyRate;
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.totalBreaks = totalBreaks;
    this.startTimeInputValue = startTime;
    this.endTimeInputValue = endTime;
    this.type = type;
  }

  public isWorkingAtTime(time: moment.Moment) {
    return (time.isSameOrAfter(this.getStartTime()) && time.isBefore(this.getEndTime()));
  }

  public with(o: any): Shift {
    const obj = Object.assign({}, o);
    obj.staffMember = obj.staffMember ? this.staffMember.with(obj.staffMember) : this.staffMember;
    obj.staffRole = obj.staffRole ? this.staffRole.with(obj.staffRole) : this.staffRole;
    obj.startTimeInputValue = obj.startTimeInputValue ? obj.startTimeInputValue : this.startTimeInputValue;
    obj.endTimeInputValue = obj.endTimeInputValue ? obj.endTimeInputValue : this.endTimeInputValue;
    return Object.assign(
      new Shift(this.staffMember, this.staffRole, this.status, this.hourlyRate, this.date, this.startTime, this.endTime, this.totalBreaks, this.type),
      {id: this.id},
      obj,
    );
  }

  public clone(): Shift {
    return this.with({});
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
    // TODO: investigate why calling this mutates this shift
    return Object.assign(
      this.clone(),
      {
        endTime: this.getEndTime().format(),
        startTime: this.getStartTime().format(),
      }
    )
  }
}