import * as moment from "moment";
import {DateFormats} from "../../Util/DateFormats";
import {getTimePeriods} from "../../Util/DateUtils";
import {Formatting} from "../../Util/Formatting";
import {RotaStatus} from "../Enum/RotaStatus";
import {RotaEntity} from "./RotaEntity";
import {RotaAbstract, RotaApiType, RotaUpdateType} from "./RotaTypes";

export class RotaEntityInputs extends RotaAbstract<string, undefined, undefined> implements RotaEntityInputs {

  public static default(date: moment.Moment) {
    date = date.clone().startOf('day');
    const timePeriods = getTimePeriods(moment.utc().format(DateFormats.API_DATE));
    return new RotaEntityInputs(
      date.format(DateFormats.API_DATE),
      '',
      Formatting.formatPercent(RotaEntity.DEFAULT_LABOUR_RATES[date.isoWeekday()-1], 2, false),
      undefined,
      RotaStatus.NEW,
      [],
      [],
      false,
      timePeriods.map(p => ''),
    );
  }

  public static fromApi(obj: RotaApiType): RotaEntityInputs {
    return new RotaEntityInputs(
      obj.date,
      obj.forecastRevenue.toString(),
      Formatting.formatPercent(obj.targetLabourRate, 2, false),
      undefined,
      obj.status as RotaStatus,
      [],
      [],
      false,
      obj.staffLevelModifiers.map(slm => slm.toString()),
    );
  }

  public clone() {
    return new RotaEntityInputs(
      this.date,
      this.forecastRevenue,
      this.targetLabourRate,
      undefined,
      this.status,
      [],
      [],
      this.touched,
      this.staffLevelModifiers,
    )
  }

  public update(obj: RotaUpdateType): RotaEntityInputs {
    return new RotaEntityInputs(
      obj.date !== undefined ? obj.date : this.date,
      obj.forecastRevenue !== undefined ? obj.forecastRevenue : this.forecastRevenue,
      obj.targetLabourRate !== undefined ? obj.targetLabourRate : this.targetLabourRate,
      undefined,
      obj.status !== undefined ? obj.status : this.status,
      [],
      [],
      obj.touched !== undefined ? obj.touched : this.touched,
      obj.staffLevelModifiers ? obj.staffLevelModifiers : this.staffLevelModifiers,
    );
  }
}