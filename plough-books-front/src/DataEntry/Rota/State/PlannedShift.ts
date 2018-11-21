import * as moment from "moment";
import {StaffMember} from "./StaffMember";

export class PlannedShift {

  public static default() {
    return new PlannedShift(
      StaffMember.default(),
      'inactive',
      0,
      moment(),
      moment(),
      0
    );
  }

  public readonly id: number;
  public readonly staffMember: StaffMember;
  public readonly status: string;
  public readonly hourlyRate: number;
  public readonly startTime: moment.Moment;
  public readonly endTime: moment.Moment;
  public readonly totalBreaks: number;
  public readonly startTimeInputValue: string;
  public readonly endTimeInputValue: string;

  constructor(staffMember: StaffMember, status: string, hourlyRate: number, startTime: moment.Moment, endTime: moment.Moment, totalBreaks: number) {
    this.staffMember = staffMember;
    this.status = status;
    this.hourlyRate = hourlyRate;
    this.startTime = startTime;
    this.endTime = endTime;
    this.totalBreaks = totalBreaks;
    this.startTimeInputValue = startTime.format('HH:mm');
    this.endTimeInputValue = endTime.format('HH:mm');
  }

  public isWorkingAtTime(time: moment.Moment) {
    return (time.isSameOrAfter(this.startTime) && time.isBefore(this.endTime));
  }

  public with(obj: any) {
    obj.staffMember = obj.staffMember ? this.staffMember.with(obj.staffMember) : this.staffMember;
    obj.startTime = obj.startTime ? moment(obj.startTime) : this.startTime.clone();
    obj.endTime = obj.endTime ? moment(obj.endTime) : this.endTime.clone();
    obj.startTimeInputValue = obj.startTime.format('HH:mm');
    obj.endTimeInputValue = obj.endTime.format('HH:mm');
    return Object.assign(
      new PlannedShift(
        this.staffMember,
        this.status,
        this.hourlyRate,
        this.startTime,
        this.endTime,
        this.totalBreaks,
      ),
      {id: this.id},
      obj,
    );
  }

  public clone() {
    return this.with({});
  }
  
  public getRawCost() {
    return Math.max(this.staffMember.currentHourlyRate * ((this.endTime.diff(this.startTime, "minutes") / 60) - this.totalBreaks), 0)
  }
}