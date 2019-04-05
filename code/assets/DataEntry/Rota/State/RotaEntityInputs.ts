import * as moment from "moment";
import {RotaStatus} from "../../../Enum/RotaStatus";
import {DateFormats} from "../../../Util/DateFormats";
import {RotaEntity} from "./RotaEntity";
import {RotaAbstract, RotaApiType, RotaUpdateType} from "./RotaTypes";

export class RotaEntityInputs extends RotaAbstract<string, undefined, undefined> implements RotaEntityInputs {

  public static default(date: moment.Moment) {
    date = date.clone().startOf('day');
    return new RotaEntityInputs(
      date.format(DateFormats.API),
      '',
      RotaEntity.DEFAULT_LABOUR_RATES[date.isoWeekday()-1].toString(),
      undefined,
      RotaStatus.NEW,
      [],
      [],
      false
    );
  }

  public static fromApi(obj: RotaApiType): RotaEntityInputs {
    return new RotaEntityInputs(
      obj.date,
      obj.forecastRevenue.toString(),
      obj.targetLabourRate.toString(),
      undefined,
      obj.status as RotaStatus,
      [],
      [],
      false,
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
    )
  }

  public update(obj: RotaUpdateType): RotaEntityInputs {
    return new RotaEntityInputs(
      obj.date ? obj.date : this.date,
      obj.forecastRevenue ? obj.forecastRevenue : this.forecastRevenue,
      obj.targetLabourRate ? obj.targetLabourRate : this.targetLabourRate,
      undefined,
      obj.status ? obj.status : this.status,
      [],
      [],
      obj.touched ? obj.touched : this.touched,
    );
  }
}