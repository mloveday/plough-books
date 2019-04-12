import * as moment from "moment";
import {DateFormats} from "../../Util/DateFormats";
import {CashUpEntity} from "./CashUpEntity";
import {CashUpEntityApiType} from "./CashUpEntityTypes";

export class CashUpsForWeek {
  public static default() {
    return new CashUpsForWeek([]);
  }

  public static defaultForWeek(dayInWeek: moment.Moment) {
    const startOfWeek = dayInWeek.clone().startOf('isoWeek');
    const dates = [
      CashUpEntity.default(startOfWeek.clone().add(0, 'days')),
      CashUpEntity.default(startOfWeek.clone().add(1, 'days')),
      CashUpEntity.default(startOfWeek.clone().add(2, 'days')),
      CashUpEntity.default(startOfWeek.clone().add(3, 'days')),
      CashUpEntity.default(startOfWeek.clone().add(4, 'days')),
      CashUpEntity.default(startOfWeek.clone().add(5, 'days')),
      CashUpEntity.default(startOfWeek.clone().add(6, 'days')),
    ];
    return CashUpsForWeek.default().update(dates);
  }

  public readonly cashUps: CashUpEntity[] = [];

  constructor(cashUps: CashUpEntity[]) {
    this.cashUps = cashUps;
  }

  public update(newCashUps: CashUpEntity[]): CashUpsForWeek {
    return this.updateCashUps(newCashUps);
  }

  public fromApi(obj: CashUpEntityApiType[]): CashUpsForWeek {
    const newCashUps = obj.map(apiCashUp => CashUpEntity.fromApi(apiCashUp));
    return this.updateCashUps(newCashUps);
  }

  public getTotalRevenue(currentDate: moment.Moment): number {
    return this.getCashUpsForWeek(currentDate).reduce((prev, curr) => prev + curr.getTotalRevenue(), 0)
  }

  public getCashUpForDay(date: moment.Moment): CashUpEntity {
    const day = date.format(DateFormats.API_DATE);
    const result = this.cashUps.find((cashUp) => day === cashUp.date);
    return result === undefined ? CashUpEntity.default(moment.utc(date)) : result;
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
    return dates.map( date => this.getCashUpForDay(date));
  }

  private updateCashUps(newCashUps: CashUpEntity[]): CashUpsForWeek {
    let cashUps = this.cashUps.map(cashUp => cashUp.clone());
    newCashUps.forEach((newCashUp, key) => {
      const existingCashUp = cashUps.find(cashUp => cashUp.date === newCashUp.date);
      if (existingCashUp) {
        cashUps = cashUps.map(cashUp => cashUp.date === newCashUp.date ? newCashUp : cashUp);
      } else {
        cashUps.push(newCashUp);
      }
    });
    return new CashUpsForWeek(cashUps);
  }
}