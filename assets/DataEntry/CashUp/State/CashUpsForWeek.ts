import * as moment from "moment";
import {DateFormats} from "../../../Util/DateFormats";
import {CashUpEntity} from "./CashUpEntity";

export class CashUpsForWeek {
  public static default() {
    return new CashUpsForWeek();
  }

  public static defaultForWeek(dayInWeek: moment.Moment) {
    const startOfWeek = dayInWeek.clone().startOf('isoWeek');
    const dates = [
      {'date': startOfWeek.clone().add(0, 'days')},
      {'date': startOfWeek.clone().add(1, 'days')},
      {'date': startOfWeek.clone().add(2, 'days')},
      {'date': startOfWeek.clone().add(3, 'days')},
      {'date': startOfWeek.clone().add(4, 'days')},
      {'date': startOfWeek.clone().add(5, 'days')},
      {'date': startOfWeek.clone().add(6, 'days')},
    ];
    return CashUpsForWeek.default().with(dates);
  }

  public readonly cashUps: Map<string, CashUpEntity> = new Map<string, CashUpEntity>();

  public with(obj: any[]|undefined): CashUpsForWeek {
    const newCashUps = new Map<string, CashUpEntity>();
    if (obj !== undefined) {
      obj.forEach(v => {
        const date = moment.utc(v.date);
        newCashUps.set(date.format(DateFormats.API), CashUpEntity.fromBackend(v))
      });
    }
    const cashUps = new Map<string, CashUpEntity>();
    this.cashUps.forEach((v, k) => {
      const cashUp = newCashUps.get(k);
      cashUps.set(k, cashUp ? cashUp : v.with({}));
    });
    newCashUps.forEach((v,k) => cashUps.set(k, v));
    return Object.assign(
      new CashUpsForWeek(),
      {cashUps}
      );
  }

  public getTotalRevenue(currentDate: moment.Moment): number {
    return this.getCashUpsForWeek(currentDate).reduce((prev, curr) => prev + curr.getTotalRevenue(), 0)
  }

  private getCashUpsForWeek(currentDate: moment.Moment): CashUpEntity[] {
    const startOfWeek = currentDate.clone().startOf('isoWeek');
    const dates = [
      startOfWeek.clone().add(0, 'days'),
      startOfWeek.clone().add(1, 'days'),
      startOfWeek.clone().add(2, 'days'),
      startOfWeek.clone().add(3, 'days'),
      startOfWeek.clone().add(4, 'days'),
      startOfWeek.clone().add(5, 'days'),
      startOfWeek.clone().add(6, 'days'),
    ];
    return dates.map( date => {
      const cashUp = this.cashUps.get(date.format(DateFormats.API));
      if (cashUp === undefined || cashUp === null) {
        return CashUpEntity.default(date)
      }
      return cashUp;
    });
  }
}