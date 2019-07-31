import * as moment from "moment";
import {DateFormats} from "../../Util/DateFormats";
import {ApiType, EntityType, InputType, UpdateType} from "../TypeWithNumericalInputs";

export abstract class HolidayAbstract {
  public readonly staffId: number;
  public readonly startDate: string;
  public readonly endDate: string;

  constructor(staffId: number,
              startDate: string,
              endDate: string) {
    this.staffId = staffId;
    this.startDate = moment.utc(startDate).format(DateFormats.API_DATE);
    this.endDate = moment.utc(endDate).format(DateFormats.API_DATE);
  }
}
export type HolidayApiType = ApiType<HolidayAbstract>;
export type HolidayUpdateType = UpdateType<HolidayAbstract & {readonly isOutgoing: boolean;}>;
export type HolidayInputType = InputType<HolidayAbstract>;
export type HolidayType = EntityType<HolidayAbstract, HolidayAbstract>;