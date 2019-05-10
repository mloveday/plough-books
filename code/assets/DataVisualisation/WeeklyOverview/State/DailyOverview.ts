import * as moment from 'moment';
import {CashUpEntity} from "../../../Model/CashUp/CashUpEntity";
import {RotaEntity} from "../../../Model/Rota/RotaEntity";

export class DailyOverview {
  public readonly cashUp: CashUpEntity;
  public readonly rota: RotaEntity;
  public readonly date: moment.Moment;

  constructor(cashUp: CashUpEntity, rota: RotaEntity, date: moment.Moment) {
    this.cashUp = cashUp;
    this.rota = rota;
    this.date = date;
  }

  public getVatAdjustedRevenue() {
    return this.cashUp.getTotalRevenue() / this.rota.constants.vatMultiplier;
  }

  public getVatAdjustedRunningRevenue() {
    const actualRevenue = this.getTotalRevenueOrForecast();
    return (actualRevenue === 0 ? this.rota.forecastRevenue : actualRevenue) / this.rota.constants.vatMultiplier;
  }

  public getTotalRevenueOrForecast() {
    return this.cashUp.isValid() ? this.cashUp.getTotalRevenue() : this.rota.forecastRevenue;
  }
}