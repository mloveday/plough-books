import * as moment from "moment";
import {DateFormats} from "../../Util/DateFormats";
import {StaffMember} from "../StaffMember/StaffMember";
import {HolidayAbstract, HolidayApiType, HolidayInputType, HolidayUpdateType} from "./HolidayTypes";

export class HolidayInput extends HolidayAbstract implements HolidayInputType {
  public static fromApi(obj: HolidayApiType) {
    return new HolidayInput(obj.staffId, obj.startDate, obj.endDate);
  }

  public static defaultFor(staffMember: StaffMember) {
    if (staffMember.id === undefined) {
      throw new Error('Can not set a holiday for a non-persisted staff member');
    }
    const today = moment.utc().format(DateFormats.API_DATE);
    return new HolidayInput(staffMember.id, today, today);
  }

  public with(obj: HolidayUpdateType): HolidayInput {
    return new HolidayInput(
      obj.staffId !== undefined ? obj.staffId : this.staffId,
      obj.startDate !== undefined ? obj.startDate : this.startDate,
      obj.endDate !== undefined ? obj.endDate : this.endDate,
    );
  }

  public clone(): HolidayInput {
    return this.with({});
  }
}