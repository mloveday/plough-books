import * as moment from "moment";
import {DateFormats} from "../../Util/DateFormats";
import {momentFromDateAndTime} from "../../Util/DateUtils";
import {validateDecimal} from "../../Util/Validation";
import {WorkTypes} from "../Enum/WorkTypes";
import {StaffMember} from "../StaffMember/StaffMember";
import {StaffRole} from "../StaffRole/StaffRole";
import {ShiftInputs} from "./ShiftInputs";
import {ShiftAbstract, ShiftApiType, ShiftType, ShiftUpdateType} from "./ShiftTypes";

export class Shift extends ShiftAbstract<number, StaffMember, StaffRole, string> implements ShiftType {

  public static default(staffMember: StaffMember, type: WorkTypes, date: string): Shift {
    return new Shift(
      staffMember,
      staffMember.role,
      'active',
      staffMember.currentHourlyRate,
      date,
      `${date} 08:00`,
      `${date} 17:00`,
      0.5,
      type,
      ShiftInputs.default(staffMember, type, date)
    );
  }

  public static fromApi(obj: ShiftApiType, date: string): Shift {
    return new Shift(
      StaffMember.fromApi(obj.staffMember),
      StaffRole.fromApi(obj.staffRole),
      obj.status,
      obj.hourlyRate,
      date,
      obj.startTime,
      obj.endTime,
      obj.totalBreaks,
      obj.type,
      ShiftInputs.fromApi(obj, date),
      obj.id,
    );
  }

  public readonly id?: number;
  public readonly inputs: ShiftInputs;

  private constructor(staffMember: StaffMember, staffRole: StaffRole, status: string, hourlyRate: number, date: string, startTime: string, endTime: string, totalBreaks: number, type: string, inputs: ShiftInputs, id?: number) {
    super(
      staffMember,
      staffRole,
      status,
      hourlyRate,
      date,
      startTime,
      endTime,
      totalBreaks,
      type
    );
    this.id = id;
    this.inputs = inputs;
  }

  public with(obj: ShiftUpdateType): Shift {
    return new Shift(
      obj.staffMember !== undefined ? obj.staffMember : this.staffMember,
      obj.staffRole !== undefined ? obj.staffRole : this.staffRole.with({}),
      obj.status !== undefined ? obj.status : this.status,
      obj.hourlyRate !== undefined ? obj.hourlyRate : this.hourlyRate,
      obj.date !== undefined ? obj.date : this.date,
      obj.startTime !== undefined ? momentFromDateAndTime(obj.startTime.date, obj.startTime.time).format(DateFormats.API_DATE_TIME) : this.startTime,
      obj.endTime !== undefined ? momentFromDateAndTime(obj.endTime.date, obj.endTime.time).format(DateFormats.API_DATE_TIME) : this.endTime,
      obj.totalBreaks !== undefined ? validateDecimal(obj.totalBreaks, this.totalBreaks) : this.totalBreaks,
      obj.type !== undefined ? obj.type : this.type,
      this.inputs.with(obj),
      this.id,
    );
  }

  public clone(): Shift {
    return new Shift(
      this.staffMember,
      this.staffRole,
      this.status,
      this.hourlyRate,
      this.date,
      this.startTime,
      this.endTime,
      this.totalBreaks,
      this.type,
      this.inputs,
      this.id
    );
  }

  public duplicate(): Shift {
    return new Shift(
      this.staffMember,
      this.staffRole,
      this.status,
      this.hourlyRate,
      this.date,
      this.startTime,
      this.endTime,
      this.totalBreaks,
      this.type,
      this.inputs
    );
  }

  public isWorkingAtTime(time: moment.Moment) {
    return (time.isSameOrAfter(this.getStartTime()) && time.isBefore(this.getEndTime()));
  }
  
  public getRawCost() {
    return Math.max(this.hourlyRate * ((this.getEndTime().diff(this.getStartTime(), "minutes") / 60) - this.totalBreaks), 0)
  }

  public getStartTime(): moment.Moment {
    return moment.utc(this.startTime);
  }

  public getEndTime(): moment.Moment {
    return moment.utc(this.endTime);
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