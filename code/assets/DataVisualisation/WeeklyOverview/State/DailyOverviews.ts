import * as moment from 'moment';
import {CashUpsForWeek} from "../../../Model/CashUp/CashUpsForWeek";
import {PlaceholderCashUp} from "../../../DataEntry/CashUp/State/PlaceholderCashUp";
import {RotaEntity} from "../../../Model/Rota/RotaEntity";
import {RotasForWeek} from "../../../Model/Rota/RotasForWeek";
import {WorkTypes} from "../../../Enum/WorkTypes";
import {DailyOverview} from "./DailyOverview";

export class DailyOverviews {
  public readonly overviews: DailyOverview[];
  public readonly startOfWeek: moment.Moment;
  public readonly actualRevenue: number;
  public readonly runningRevenueForecast: number;
  public readonly vatAdjustedActualRevenue: number;
  public readonly forecastRevenue: number;
  public readonly vatAdjustedForecastRevenue: number;
  public readonly actualBarLabour: number;
  public readonly runningBarLabour: number;
  public readonly forecastBarLabour: number;
  public readonly actualKitchenLabour: number;
  public readonly runningKitchenLabour: number;
  public readonly forecastKitchenLabour: number;

  constructor(startOfWeek: moment.Moment, rotas: RotasForWeek, cashUps: CashUpsForWeek) {
    this.startOfWeek = startOfWeek;
    this.overviews = this.getDailyOverviews(rotas, cashUps);
    this.actualRevenue = cashUps.getTotalRevenue(startOfWeek);
    this.runningRevenueForecast = this.overviews.reduce((prev, curr) => prev + curr.getTotalRevenueOrForecast(), 0);
    this.forecastRevenue = rotas.getTotalForecastRevenue(startOfWeek);
    this.forecastBarLabour = rotas.getTotalPredictedBarLabour(startOfWeek, this.forecastRevenue);
    this.forecastKitchenLabour = rotas.getTotalPredictedKitchenLabour(startOfWeek, this.forecastRevenue);
    this.actualBarLabour = this.getTotalActualBarLabour();
    this.actualKitchenLabour = this.getTotalActualKitchenLabour();
    this.runningBarLabour = this.getTotalRunningBarLabour();
    this.runningKitchenLabour = this.getTotalRunningKitchenLabour();
    this.vatAdjustedActualRevenue = this.overviews.reduce((prev, curr) => prev + curr.getVatAdjustedRevenue(), 0);
    this.vatAdjustedForecastRevenue = rotas.getTotalVatAdjustedForecastRevenue(startOfWeek);
  }

  public getForecastLabour() {
    return this.forecastKitchenLabour + this.forecastBarLabour;
  }

  public getActualLabour() {
    return this.actualKitchenLabour + this.actualBarLabour;
  }

  public getRunningLabour() {
    return this.runningBarLabour + this.runningKitchenLabour;
  }

  public getCombinedForecastLabourRate() {
    return this.getForecastLabour()/this.vatAdjustedForecastRevenue;
  }

  public getCombinedActualLabourRate() {
    return this.getActualLabour()/this.vatAdjustedActualRevenue;
  }

  public getCombinedRunningLabourRate() {
    return this.getRunningLabour()/this.vatAdjustedActualRevenue;
  }

  public getForecastBarLabourRate() {
    return this.forecastBarLabour/this.vatAdjustedForecastRevenue;
  }

  public getActualBarLabourRate() {
    return this.actualBarLabour/this.vatAdjustedActualRevenue;
  }

  public getForecastKitchenLabourRate() {
    return this.forecastKitchenLabour/this.vatAdjustedForecastRevenue;
  }

  public getActualKitchenLabourRate() {
    return this.actualKitchenLabour/this.vatAdjustedActualRevenue;
  }

  private getDailyOverviews(rotas: RotasForWeek, cashUps: CashUpsForWeek): DailyOverview[] {
    const date = this.startOfWeek;
    const days = [
      date.clone().add(0, 'days'),
      date.clone().add(1, 'days'),
      date.clone().add(2, 'days'),
      date.clone().add(3, 'days'),
      date.clone().add(4, 'days'),
      date.clone().add(5, 'days'),
      date.clone().add(6, 'days'),
    ];
    const overviews: DailyOverview[] = [];
    days.forEach(day => {
      const cashUp = cashUps.getCashUpForDay(day);
      const rota = rotas.getRotaForDate(day);
      if (!cashUp.isDefault && rota) {
        overviews.push(new DailyOverview(
          cashUp,
          rota,
          day
        ));
      } else if (cashUp.isDefault && rota) {
        overviews.push(new DailyOverview(
          PlaceholderCashUp.default(day),
          rota,
          day
        ));
      } else if (!cashUp.isDefault){
        overviews.push(new DailyOverview(
          cashUp,
          RotaEntity.default(day),
          day
        ));
      } else {
        overviews.push(new DailyOverview(
          PlaceholderCashUp.default(day),
          RotaEntity.default(day),
          day
        ));
      }
    });
    return overviews;
  }

  private getTotalActualBarLabour(): number {
    return this.overviews.reduce((prev, curr) => curr.rota.getTotalActualLabourCost(curr.cashUp.getTotalRevenue(), this.actualRevenue, WorkTypes.BAR) + prev, 0);
  }

  private getTotalActualKitchenLabour(): number {
    return this.overviews.reduce((prev, curr) => curr.rota.getTotalActualLabourCost(curr.cashUp.getTotalRevenue(), this.actualRevenue, WorkTypes.KITCHEN) + prev, 0);
  }

  private getTotalRunningBarLabour(): number {
    return this.overviews.reduce((prev, curr) => curr.rota.getTotalRunningLabourCost(curr.cashUp.getTotalRevenue(), this.runningRevenueForecast, WorkTypes.BAR) + prev, 0);
  }

  private getTotalRunningKitchenLabour(): number {
    return this.overviews.reduce((prev, curr) => curr.rota.getTotalRunningLabourCost(curr.cashUp.getTotalRevenue(), this.runningRevenueForecast, WorkTypes.KITCHEN) + prev, 0);
  }
}