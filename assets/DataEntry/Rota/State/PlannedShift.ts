import * as moment from "moment";
import {WorkTypes} from "../../../Enum/WorkTypes";
import {DateFormats} from "../../../Util/DateFormats";
import {StaffMember} from "./StaffMember";
import {StaffRole} from "./StaffRole";

export class PlannedShift {

  public static default() {
    return new PlannedShift(StaffMember.default(), StaffRole.default(), 'inactive', 0, moment.utc(), moment.utc(), 0, WorkTypes.BAR);
  }

  public readonly id: number;
  public readonly staffMember: StaffMember;
  public readonly staffRole: StaffRole;
  public readonly status: string;
  public readonly hourlyRate: number;
  public readonly startTime: moment.Moment;
  public readonly endTime: moment.Moment;
  public readonly totalBreaks: number;
  public readonly startTimeInputValue: string;
  public readonly endTimeInputValue: string;
  public readonly type: string;

  constructor(staffMember: StaffMember, staffRole: StaffRole, status: string, hourlyRate: number, startTime: moment.Moment, endTime: moment.Moment, totalBreaks: number, type: string) {
    this.staffMember = staffMember;
    this.staffRole = staffRole;
    this.status = status;
    this.hourlyRate = hourlyRate;
    this.startTime = startTime;
    this.endTime = endTime;
    this.totalBreaks = totalBreaks;
    this.startTimeInputValue = startTime.format('HH:mm');
    this.endTimeInputValue = endTime.format('HH:mm');
    this.type = type;
  }

  public isWorkingAtTime(time: moment.Moment) {
    return (time.isSameOrAfter(this.startTime) && time.isBefore(this.endTime));
  }

  public with(o: any): PlannedShift {
    const obj = Object.assign({}, o);
    obj.staffMember = obj.staffMember ? this.staffMember.with(obj.staffMember) : this.staffMember;
    obj.staffRole = obj.staffRole ? this.staffRole.with(obj.staffRole) : this.staffRole;
    obj.startTime = obj.startTime ? moment.utc(obj.startTime) : this.startTime.clone();
    obj.endTime = obj.endTime ? moment.utc(obj.endTime) : this.endTime.clone();
    obj.startTimeInputValue = obj.startTimeInputValue ? obj.startTimeInputValue : this.startTimeInputValue;
    obj.endTimeInputValue = obj.endTimeInputValue ? obj.endTimeInputValue : this.endTimeInputValue;
    return Object.assign(
      new PlannedShift(this.staffMember, this.staffRole, this.status, this.hourlyRate, this.startTime, this.endTime, this.totalBreaks, this.type),
      {id: this.id},
      obj,
    );
  }

  public clone() {
    return this.with({});
  }
  
  public getRawCost() {
    return Math.max(this.hourlyRate * ((this.endTime.diff(this.startTime, "minutes") / 60) - this.totalBreaks), 0)
  }

  public forApi(rotaDate: moment.Moment) {

    return Object.assign(
      this,
      {
        endTime: this.endTime.hour() < 6 ? `${rotaDate.clone().add(1, 'days').format(DateFormats.API)}T${this.endTime.format(DateFormats.TIME_LEADING_ZERO)}Z` : `${rotaDate.format(DateFormats.API)}T${this.endTime.format(DateFormats.TIME_LEADING_ZERO)}Z`,
        startTime: `${rotaDate.format(DateFormats.API)}T${this.startTime.format(DateFormats.TIME_LEADING_ZERO)}Z`,
      }
    )
  }
}