import * as moment from "moment";
import {DateFormats} from "../../Util/DateFormats";
import {validateDateString} from "../../Util/DateUtils";
import {EditableEntity} from "../EditableEntity";
import {StaffMember} from "../StaffMember/StaffMember";
import {HolidayInput} from "./HolidayInput";
import {HolidayAbstract, HolidayApiType, HolidayType, HolidayUpdateType} from "./HolidayTypes";

export class Holiday extends HolidayAbstract implements HolidayType, EditableEntity {
  public static fromApi(obj: HolidayApiType) {
    return new Holiday(obj.staffId, obj.startDate, obj.endDate, HolidayInput.fromApi(obj), obj.id);
  }

  public static defaultFor(staffMember: StaffMember) {
    if (staffMember.id === undefined) {
      throw new Error('Can not set a holiday for a non-persisted staff member');
    }
    const today = moment.utc().format(DateFormats.API_DATE);
    return new Holiday(staffMember.id, today, today, HolidayInput.defaultFor(staffMember));
  }

  public readonly id?: number;
  public readonly inputs: HolidayInput;

  constructor(staffId: number,
              startDate: string,
              endDate: string,
              inputs: HolidayInput,
              id?: number) {
    super(staffId, startDate, endDate);
    this.inputs = inputs;
    this.id = id;
  }

  public with(obj: HolidayUpdateType): Holiday {
    return new Holiday(obj.staffId !== undefined ? obj.staffId : this.staffId,
                       obj.startDate !== undefined ? validateDateString(obj.startDate, this.startDate) : this.startDate,
                       obj.endDate !== undefined ? validateDateString(obj.endDate, this.endDate) : this.endDate,
                       this.inputs.with(obj),
                       this.id);
  }

  public clone(): Holiday {
    return this.with({});
  }

  public get entityId() {
    return this.id ? this.id : -1;
  }
}