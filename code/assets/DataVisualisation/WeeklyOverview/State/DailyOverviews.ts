import * as moment from 'moment';
import {CashUpsForWeek} from "../../../Model/CashUp/CashUpsForWeek";
import {PlaceholderCashUp} from "../../../Model/CashUp/PlaceholderCashUp";
import {WorkType, WorkTypes} from "../../../Model/Enum/WorkTypes";
import {RotaEntity} from "../../../Model/Rota/RotaEntity";
import {RotasForWeek} from "../../../Model/Rota/RotasForWeek";
import {DailyOverview} from "./DailyOverview";

export class DailyOverviews {
  public readonly overviews: DailyOverview[];
  public readonly startOfWeek: moment.Moment;
  public readonly actualRevenue: number;
  public readonly runningRevenueForecast: number;
  public readonly vatAdjustedActualRevenue: number;
  public readonly vatAdjustedRunningRevenue: number;
  public readonly forecastRevenue: number;
  public readonly vatAdjustedForecastRevenue: number;

  public readonly actualBarLabour: number;
  public readonly runningBarLabour: number;
  public readonly forecastBarLabour: number;
  public readonly forecastBarHours: number;
  public readonly actualBarHours: number;

  public readonly actualKitchenLabour: number;
  public readonly runningKitchenLabour: number;
  public readonly forecastKitchenLabour: number;
  public readonly forecastKitchenHours: number;
  public readonly actualKitchenHours: number;

  public readonly actualAncillaryLabour: number;
  public readonly runningAncillaryLabour: number;
  public readonly forecastAncillaryLabour: number;
  public readonly forecastAncillaryHours: number;
  public readonly actualAncillaryHours: number;

  constructor(startOfWeek: moment.Moment, rotas: RotasForWeek, cashUps: CashUpsForWeek) {
    this.startOfWeek = startOfWeek;
    this.overviews = this.getDailyOverviews(rotas, cashUps);
    this.actualRevenue = cashUps.getTotalRevenue(startOfWeek);
    this.runningRevenueForecast = this.overviews.reduce((prev, curr) => prev + curr.getTotalRevenueOrForecast(), 0);
    this.forecastRevenue = rotas.getTotalForecastRevenue(startOfWeek);

    this.forecastBarLabour = rotas.getTotalPredictedBarLabour(startOfWeek, this.forecastRevenue);
    this.forecastKitchenLabour = rotas.getTotalPredictedKitchenLabour(startOfWeek, this.forecastRevenue);
    this.forecastAncillaryLabour = rotas.getTotalPredictedAncillaryLabour(startOfWeek, this.forecastRevenue);

    this.actualBarLabour = this.getTotalActualBarLabour();
    this.actualKitchenLabour = this.getTotalActualKitchenLabour();
    this.actualAncillaryLabour = this.getTotalActualAncillaryLabour();

    this.runningBarLabour = this.getTotalRunningBarLabour();
    this.runningKitchenLabour = this.getTotalRunningKitchenLabour();
    this.runningAncillaryLabour = this.getTotalRunningAncillaryLabour();

    this.vatAdjustedActualRevenue = this.overviews.reduce((prev, curr) => prev + curr.getVatAdjustedRevenue(), 0);
    this.vatAdjustedForecastRevenue = rotas.getTotalVatAdjustedForecastRevenue(startOfWeek);
    this.vatAdjustedRunningRevenue = this.overviews.reduce((prev, curr) => prev + curr.getVatAdjustedRunningRevenue(), 0);

    this.actualBarHours = this.getTotalActualHoursOfType(WorkTypes.BAR);
    this.actualKitchenHours = this.getTotalActualHoursOfType(WorkTypes.KITCHEN);
    this.actualAncillaryHours = this.getTotalActualHoursOfType(WorkTypes.ANCILLARY);

    this.forecastBarHours = this.getTotalPlannedHoursOfType(WorkTypes.BAR);
    this.forecastKitchenHours = this.getTotalPlannedHoursOfType(WorkTypes.KITCHEN);
    this.forecastAncillaryHours = this.getTotalPlannedHoursOfType(WorkTypes.ANCILLARY);
  }

  public getCombinedForecastLabour() {
    return this.forecastKitchenLabour + this.forecastBarLabour + this.forecastAncillaryLabour;
  }

  public getCombinedActualLabour() {
    return this.actualKitchenLabour + this.actualBarLabour + this.actualAncillaryLabour;
  }

  public getCombinedRunningLabour() {
    return this.runningBarLabour + this.runningKitchenLabour + this.runningAncillaryLabour;
  }

  public getCombinedForecastLabourRate() {
    return this.getCombinedForecastLabour()/this.vatAdjustedForecastRevenue;
  }

  public getCombinedActualLabourRate() {
    return this.getCombinedActualLabour()/this.vatAdjustedActualRevenue;
  }

  public getCombinedRunningLabourRate() {
    return this.getCombinedRunningLabour()/this.vatAdjustedRunningRevenue;
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
    const rotasForWeek = rotas.getRotasForWeek(date);
    const overviews: DailyOverview[] = [];
    days.forEach(day => {
      const cashUp = cashUps.getCashUpForDay(day);
      const rota = rotas.getRotaForDate(day);
      if (!cashUp.isDefault && rota) {
        overviews.push(new DailyOverview(
          cashUp,
          rota,
          day,
          rotasForWeek
        ));
      } else if (cashUp.isDefault && rota) {
        overviews.push(new DailyOverview(
          PlaceholderCashUp.default(day),
          rota,
          day,
          rotasForWeek
        ));
      } else if (!cashUp.isDefault){
        overviews.push(new DailyOverview(
          cashUp,
          RotaEntity.default(day),
          day,
          rotasForWeek
        ));
      } else {
        overviews.push(new DailyOverview(
          PlaceholderCashUp.default(day),
          RotaEntity.default(day),
          day,
          rotasForWeek
        ));
      }
    });
    return overviews;
  }

  private getTotalActualBarLabour(): number {
    return this.overviews.reduce((prev, curr) => curr.rota.getTotalActualLabourCost(curr.cashUp.getTotalRevenue(), this.actualRevenue, WorkTypes.BAR, curr.getActualWeeklyGrossPayForUser) + prev, 0);
  }

  private getTotalActualKitchenLabour(): number {
    return this.overviews.reduce((prev, curr) => curr.rota.getTotalActualLabourCost(curr.cashUp.getTotalRevenue(), this.actualRevenue, WorkTypes.KITCHEN, curr.getActualWeeklyGrossPayForUser) + prev, 0);
  }

  private getTotalActualAncillaryLabour(): number {
    return this.overviews.reduce((prev, curr) => curr.rota.getTotalActualLabourCost(curr.cashUp.getTotalRevenue(), this.actualRevenue, WorkTypes.ANCILLARY, curr.getActualWeeklyGrossPayForUser) + prev, 0);
  }

  private getTotalRunningBarLabour(): number {
    return this.overviews.reduce((prev, curr) => {
      const actualRevenue = curr.cashUp.getTotalRevenue();
      return curr.rota.getTotalRunningLabourCost(actualRevenue === 0 ? curr.rota.forecastRevenue : actualRevenue, this.runningRevenueForecast, WorkTypes.BAR, curr.getRunningWeeklyGrossPayForUser) + prev
    }, 0);
  }

  private getTotalRunningKitchenLabour(): number {
    return this.overviews.reduce((prev, curr) => {
      const actualRevenue = curr.cashUp.getTotalRevenue();
      return curr.rota.getTotalRunningLabourCost(actualRevenue === 0 ? curr.rota.forecastRevenue : actualRevenue, this.runningRevenueForecast, WorkTypes.KITCHEN, curr.getRunningWeeklyGrossPayForUser) + prev
    }, 0);
  }

  private getTotalRunningAncillaryLabour(): number {
    return this.overviews.reduce((prev, curr) => {
      const actualRevenue = curr.cashUp.getTotalRevenue();
      return curr.rota.getTotalRunningLabourCost(actualRevenue === 0 ? curr.rota.forecastRevenue : actualRevenue, this.runningRevenueForecast, WorkTypes.ANCILLARY, curr.getRunningWeeklyGrossPayForUser) + prev
    }, 0);
  }

  private getTotalPlannedHoursOfType(workType: WorkType): number {
    return this.overviews.reduce((prev, curr) => prev + curr.rota.getTotalPlannedHoursOfType(workType), 0);
  }

  private getTotalActualHoursOfType(workType: WorkType): number {
    return this.overviews.reduce((prev, curr) => prev + curr.rota.getTotalActualHoursOfType(workType), 0);
  }
}