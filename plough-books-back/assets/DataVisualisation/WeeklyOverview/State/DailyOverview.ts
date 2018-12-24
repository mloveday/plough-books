import * as moment from 'moment';
import {CashUpEntity} from "../../../DataEntry/CashUp/State/CashUpEntity";
import {RotaEntity} from "../../../DataEntry/Rota/State/RotaEntity";

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

  public getTotalRevenueOrForecast() {
    return this.cashUp.isValid() ? this.cashUp.getTotalRevenue() : this.rota.forecastRevenue;
  }
}