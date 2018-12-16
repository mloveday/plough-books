import * as moment from "moment";
import {WorkTypes} from "../../../Enum/WorkTypes";
import {DateFormats} from "../../../Util/DateFormats";
import {StaffMember} from "./StaffMember";

export class PlannedShift {

  public static default() {
    return new PlannedShift(
      StaffMember.default(),
      'inactive',
      0,
      moment(),
      moment(),
      0,
      WorkTypes.BAR,
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
  public readonly type: string;

  constructor(staffMember: StaffMember, status: string, hourlyRate: number, startTime: moment.Moment, endTime: moment.Moment, totalBreaks: number, type: string) {
    this.staffMember = staffMember;
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

  public with(o: any) {
    const obj = Object.assign({}, o);
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
        this.type,
      ),
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

  public forApi() {
    return Object.assign(
      this,
      {
        endTime: this.endTime.format(DateFormats.TIME_LEADING_ZERO),
        startTime: this.startTime.format(DateFormats.TIME_LEADING_ZERO),
      }
    )
  }
}