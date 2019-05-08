import * as moment from "moment";
import {DateFormats} from "../../Util/DateFormats";
import {Formatting} from "../../Util/Formatting";
import {WorkTypes} from "../Enum/WorkTypes";
import {StaffMember} from "../StaffMember/StaffMember";
import {ShiftAbstract, ShiftApiType, ShiftDate, ShiftInputType, ShiftUpdateType} from "./ShiftTypes";

export class ShiftInputs extends ShiftAbstract<string, undefined, undefined, ShiftDate> implements ShiftInputType {
  public static default(staffMember: StaffMember, type: WorkTypes, date: string): ShiftInputs {
    return new ShiftInputs(
      'active',
      Formatting.formatCashForInput(staffMember.currentHourlyRate),
      date,
      {date, time: '08:00'},
      {date, time: '17:00'},
      '0.5',
      type
    );
  }

  public static fromApi(obj: ShiftApiType, date: string): ShiftInputs {
    return new ShiftInputs(
      obj.status,
      Formatting.formatCashForInput(obj.hourlyRate),
      date,
      {date: moment.utc(obj.startTime).format(DateFormats.API_DATE), time: moment.utc(obj.startTime).format(DateFormats.TIME_LEADING_ZERO)},
      {date: moment.utc(obj.endTime).format(DateFormats.API_DATE), time: moment.utc(obj.endTime).format(DateFormats.TIME_LEADING_ZERO)},
      Formatting.formatCashForInput(obj.totalBreaks),
      obj.type,
    );
  }

  private constructor(status: string, hourlyRate: string, date: string, startTime: ShiftDate, endTime: ShiftDate, totalBreaks: string, type: string) {
    super(
      undefined,
      undefined,
      status,
      hourlyRate,
      date,
      startTime,
      endTime,
      totalBreaks,
      type
    );
  }

  public with(obj: ShiftUpdateType): ShiftInputs {
    return new ShiftInputs(
      obj.status !== undefined ? obj.status : this.status,
      obj.hourlyRate !== undefined ? obj.hourlyRate : this.hourlyRate,
      obj.date !== undefined ? obj.date : this.date,
      obj.startTime !== undefined ? obj.startTime : this.startTime,
      obj.endTime !== undefined ? obj.endTime : this.endTime,
      obj.totalBreaks !== undefined ? obj.totalBreaks : this.totalBreaks,
      obj.type !== undefined ? obj.type : this.type,
    );
  }

  public clone(): ShiftInputs {
    return new ShiftInputs(
      this.status,
      this.hourlyRate,
      this.date,
      this.startTime,
      this.endTime,
      this.totalBreaks,
      this.type,
    );
  }
}