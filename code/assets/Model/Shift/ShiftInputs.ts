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
      staffMember.currentHourlyRate,
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
      obj.hourlyRate,
      date,
      {date: moment.utc(obj.startTime).format(DateFormats.API_DATE), time: moment.utc(obj.startTime).format(DateFormats.TIME_LEADING_ZERO)},
      {date: moment.utc(obj.endTime).format(DateFormats.API_DATE), time: moment.utc(obj.endTime).format(DateFormats.TIME_LEADING_ZERO)},
      Formatting.formatCash(obj.totalBreaks),
      obj.type,
    );
  }

  private constructor(status: string, hourlyRate: number, date: string, startTime: ShiftDate, endTime: ShiftDate, totalBreaks: string, type: string) {
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
      obj.status ? obj.status : this.status,
      obj.hourlyRate ? obj.hourlyRate : this.hourlyRate,
      obj.date ? obj.date : this.date,
      obj.startTime ? obj.startTime : this.startTime,
      obj.endTime ? obj.endTime : this.endTime,
      obj.totalBreaks ? obj.totalBreaks : this.totalBreaks,
      obj.type ? obj.type : this.type,
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