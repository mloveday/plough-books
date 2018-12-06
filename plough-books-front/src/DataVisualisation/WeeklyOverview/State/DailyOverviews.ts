import * as moment from 'moment';
import {CashUpsForWeek} from "../../../DataEntry/CashUp/State/CashUpsForWeek";
import {RotasForWeek} from "../../../DataEntry/Rota/State/RotasForWeek";
import {WorkTypes} from "../../../Enum/WorkTypes";
import {DateFormats} from "../../../Util/DateFormats";
import {DailyOverview} from "./DailyOverview";

export class DailyOverviews {
  public readonly overviews: DailyOverview[];
  public readonly startOfWeek: moment.Moment;
  public readonly actualRevenue: number;
  public readonly vatAdjustedActualRevenue: number;
  public readonly forecastRevenue: number;
  public readonly vatAdjustedForecastRevenue: number;
  public readonly actualBarLabour: number;
  public readonly forecastBarLabour: number;
  public readonly actualKitchenLabour: number;
  public readonly forecastKitchenLabour: number;

  constructor(startOfWeek: moment.Moment, rotas: RotasForWeek, cashUps: CashUpsForWeek) {
    this.startOfWeek = startOfWeek;
    this.overviews = this.getDailyOverviews(rotas, cashUps);
    this.actualRevenue = cashUps.getTotalRevenue();
    this.forecastRevenue = rotas.getTotalForecastRevenue();
    this.forecastBarLabour = rotas.getTotalPredictedBarLabour(this.forecastRevenue);
    this.forecastKitchenLabour = rotas.getTotalPredictedKitchenLabour(this.forecastRevenue);
    this.actualBarLabour = this.getTotalActualBarLabour();
    this.actualKitchenLabour = this.getTotalActualKitchenLabour();
    this.vatAdjustedActualRevenue = this.overviews.reduce((prev, curr) => prev + curr.getVatAdjustedRevenue(), 0);
    this.vatAdjustedForecastRevenue = rotas.getTotalVatAdjustedForecastRevenue();
  }

  public getForecastLabour() {
    return this.forecastKitchenLabour + this.forecastBarLabour;
  }

  public getActualLabour() {
    return this.actualKitchenLabour + this.actualBarLabour;
  }

  public getCombinedForecastLabourRate() {
    return this.getForecastLabour()/this.vatAdjustedForecastRevenue;
  }

  public getCombinedActualLabourRate() {
    return this.getActualLabour()/this.vatAdjustedActualRevenue;
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
      const cashUp = cashUps.cashUps.get(day.format(DateFormats.API));
      const rota = rotas.rotas.get(day.format(DateFormats.API));
      if (cashUp && rota) {
        overviews.push(new DailyOverview(
          cashUp,
          rota,
          day
        ))
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
}