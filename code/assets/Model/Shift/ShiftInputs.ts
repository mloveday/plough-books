import {WorkTypes} from "../Enum/WorkTypes";
import {Formatting} from "../../Util/Formatting";
import {StaffMember} from "../StaffMember/StaffMember";
import {ShiftAbstract, ShiftApiType, ShiftInputType, ShiftUpdateType} from "./ShiftTypes";

export class ShiftInputs extends ShiftAbstract<string, undefined, undefined> implements ShiftInputType {

  public static default(staffMember: StaffMember, type: WorkTypes, date: string): ShiftInputs {
    return new ShiftInputs(
      'active',
      staffMember.currentHourlyRate,
      date,
      '08:00',
      '17:00',
      '0.5',
      type
    );
  }

  public static fromResponse(obj: ShiftApiType, date: string): ShiftInputs {
    return new ShiftInputs(
      obj.status,
      obj.hourlyRate,
      date,
      obj.startTime,
      obj.endTime,
      Formatting.formatCash(obj.totalBreaks),
      obj.type,
    );
  }

  private constructor(status: string, hourlyRate: number, date: string, startTime: string, endTime: string, totalBreaks: string, type: string) {
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