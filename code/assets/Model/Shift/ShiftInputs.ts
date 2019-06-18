import {DateFormats} from "../../Util/DateFormats";
import {momentFromDateTime} from "../../Util/DateUtils";
import {Formatting} from "../../Util/Formatting";
import {WorkType} from "../Enum/WorkTypes";
import {StaffMember} from "../StaffMember/StaffMember";
import {ShiftAbstract, ShiftApiType, ShiftDate, ShiftInputType, ShiftUpdateType} from "./ShiftTypes";

export class ShiftInputs extends ShiftAbstract<string, undefined, undefined, ShiftDate> implements ShiftInputType {
  public static default(staffMember: StaffMember, type: WorkType, date: string): ShiftInputs {
    return new ShiftInputs(
      'active',
      Formatting.formatCashForInput(staffMember.currentHourlyRate),
      date,
      {date, time: '08:00'},
      {date, time: '08:00'},
      '0',
      type,
      staffMember.defaultOffFloor,
    );
  }

  public static fromApi(obj: ShiftApiType, date: string): ShiftInputs {
    return new ShiftInputs(
      obj.status,
      Formatting.formatCashForInput(obj.hourlyRate),
      date,
      {date: momentFromDateTime(obj.startTime).format(DateFormats.API_DATE), time: momentFromDateTime(obj.startTime).format(DateFormats.TIME_LEADING_ZERO)},
      {date: momentFromDateTime(obj.endTime).format(DateFormats.API_DATE), time: momentFromDateTime(obj.endTime).format(DateFormats.TIME_LEADING_ZERO)},
      Formatting.formatCashForInput(obj.totalBreaks),
      obj.type,
      obj.offFloor,
    );
  }

  private constructor(status: string, hourlyRate: string, date: string, startTime: ShiftDate, endTime: ShiftDate, totalBreaks: string, type: string, offFloor: boolean) {
    super(
      undefined,
      undefined,
      status,
      hourlyRate,
      date,
      startTime,
      endTime,
      totalBreaks,
      type,
      offFloor,
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
      obj.offFloor !== undefined ? obj.offFloor : this.offFloor,
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
      this.offFloor,
    );
  }
}