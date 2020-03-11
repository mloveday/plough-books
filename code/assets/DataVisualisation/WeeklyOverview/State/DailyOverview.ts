import * as moment from 'moment';
import {CashUpEntity} from "../../../Model/CashUp/CashUpEntity";
import {RotaEntity} from "../../../Model/Rota/RotaEntity";
import {CashManipulation} from "../../../Util/CashManipulation";

export class DailyOverview {
  public readonly cashUp: CashUpEntity;
  public readonly rota: RotaEntity;
  public readonly date: moment.Moment;

  public getActualWeeklyGrossPayForUser: (smId: number) => number;
  public getPlannedWeeklyGrossPayForUser: (smId: number) => number;

  private readonly rotasForWeek: RotaEntity[];

  constructor(cashUp: CashUpEntity, rota: RotaEntity, date: moment.Moment, rotasForWeek: RotaEntity[]) {
    this.cashUp = cashUp;
    this.rota = rota;
    this.date = date;
    this.rotasForWeek = rotasForWeek;
    this.getActualWeeklyGrossPayForUser = CashManipulation.getActualWeeklyGrossPayForUser(this.rotasForWeek);
    this.getPlannedWeeklyGrossPayForUser = CashManipulation.getPlannedWeeklyGrossPayForUser(this.rotasForWeek);
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

  public getRunningLabourCost(runningRevenueForecast: number) {
    return this.rota.getCombinedRunningLabourCost(this.cashUp.getTotalRevenue(), runningRevenueForecast, this.getActualWeeklyGrossPayForUser); // TODO figure out how to handle running gross
  }

  public getRunningRevenue() {
    const cashUpRevenue = this.cashUp.getTotalRevenue();
    return cashUpRevenue === 0 ? this.rota.forecastRevenue : cashUpRevenue;
  }
}