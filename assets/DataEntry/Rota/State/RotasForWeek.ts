import * as moment from "moment";
import {WorkTypes} from "../../../Enum/WorkTypes";
import {CashManipulation} from "../../../Util/CashManipulation";
import {DateFormats} from "../../../Util/DateFormats";
import {RotaEntity} from "./RotaEntity";

export class RotasForWeek {
  public static default() {
    return new RotasForWeek([]);
  }

  public static defaultForWeek(dayInWeek: moment.Moment) {
    const startOfWeek = moment.utc(dayInWeek).startOf('isoWeek');
    const dates = [
      RotaEntity.fromApi({'date': startOfWeek.clone().add(0, 'days').format(DateFormats.API)}),
      RotaEntity.fromApi({'date': startOfWeek.clone().add(1, 'days').format(DateFormats.API)}),
      RotaEntity.fromApi({'date': startOfWeek.clone().add(2, 'days').format(DateFormats.API)}),
      RotaEntity.fromApi({'date': startOfWeek.clone().add(3, 'days').format(DateFormats.API)}),
      RotaEntity.fromApi({'date': startOfWeek.clone().add(4, 'days').format(DateFormats.API)}),
      RotaEntity.fromApi({'date': startOfWeek.clone().add(5, 'days').format(DateFormats.API)}),
      RotaEntity.fromApi({'date': startOfWeek.clone().add(6, 'days').format(DateFormats.API)}),
    ];
    return RotasForWeek.default().update(dates);
  }

  private readonly rotas: RotaEntity[] = [];

  constructor(rotas: RotaEntity[]) {
    this.rotas = rotas;
  }

  public hasRotaForDate(date: moment.Moment): boolean {
    return this.getRotaForDate(date) !== undefined;
  }

  public getRotaForDate(date: moment.Moment): RotaEntity|undefined {
    return this.rotas.find(rota => rota.date === date.format(DateFormats.API));
  }

  public getTotalForecastRevenue(date: moment.Moment): number {
    return this.getRotasForWeek(date)
      .reduce((prev, curr) => prev + curr.forecastRevenue, 0);
  }

  public getTotalVatAdjustedForecastRevenue(date: moment.Moment): number {
    return this.getRotasForWeek(date)
      .reduce((prev, curr) => prev + CashManipulation.calculateVatAdjustedRevenue(curr.forecastRevenue, curr.constants.vatMultiplier), 0);
  }

  public getTotalPredictedBarLabour(date: moment.Moment, totalForecastBarRevenue: number): number {
    return this.getRotasForWeek(date)
      .reduce((prev, curr) => curr.getTotalPredictedLabourCost(totalForecastBarRevenue, WorkTypes.BAR) + prev, 0);
  }

  public getTotalPredictedKitchenLabour(date: moment.Moment, totalForecastKitchenRevenue: number): number {
    return this.getRotasForWeek(date)
      .reduce((prev, curr) => curr.getTotalPredictedLabourCost(totalForecastKitchenRevenue, WorkTypes.KITCHEN) + prev, 0);
  }

  public getTargetLabourRateForWeek(date: moment.Moment) {
    return this.getRotasForWeek(date)
      .reduce((prev, curr) => prev + curr.targetLabourRate*curr.forecastRevenue, 0) / this.getTotalForecastRevenue(date);
  }

  public getRotasForWeek(currentDate: moment.Moment): RotaEntity[] {
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
      const rota = this.getRotaForDate(date);
      if (rota === undefined) {
        return RotaEntity.default()
      }
      return rota;
    });
  }

  public populateWeekFromApi(date: moment.Moment, obj: any[]) {
    return this
      .update(RotasForWeek.defaultForWeek(moment.utc(date)).rotas) // ensure week is populated
      .update(this.rotas) // ensure we are not overwriting any existing data
      .fromApi(obj); // now overwrite anything fromApi new data
  }

  public update(newRotas: RotaEntity[]): RotasForWeek {
    return this.updateRotas(newRotas);
  }

  private fromApi(obj: any[]): RotasForWeek {
    const newRotas = obj.map(apiRota => RotaEntity.fromApi(apiRota));
    return this.updateRotas(newRotas);
  }

  private updateRotas(newRotas: RotaEntity[]) {
    let rotas = this.rotas.map(rota => rota.clone());
    newRotas.forEach((newRota, key) => {
      const existingRota = rotas.find(rota => rota.date === newRota.date);
      if (existingRota) {
        rotas = rotas.map(rota => rota.date === newRota.date ? newRota : rota);
      } else {
        rotas.push(newRota);
      }
    });
    return new RotasForWeek(rotas);
  }
}