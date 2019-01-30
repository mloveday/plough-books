import * as moment from "moment";
import {WorkTypes} from "../../../Enum/WorkTypes";
import {CashManipulation} from "../../../Util/CashManipulation";
import {DateFormats} from "../../../Util/DateFormats";
import {RotaEntity} from "./RotaEntity";

export class RotasForWeek {
  public static default() {
    return new RotasForWeek(new Map<string, RotaEntity>());
  }

  public static defaultForWeek(dayInWeek: moment.Moment) {
    const startOfWeek = moment.utc(dayInWeek).startOf('isoWeek');
    const dates = [
      RotaEntity.default().fromApi({'date': startOfWeek.clone().add(0, 'days').format(DateFormats.API)}),
      RotaEntity.default().fromApi({'date': startOfWeek.clone().add(1, 'days').format(DateFormats.API)}),
      RotaEntity.default().fromApi({'date': startOfWeek.clone().add(2, 'days').format(DateFormats.API)}),
      RotaEntity.default().fromApi({'date': startOfWeek.clone().add(3, 'days').format(DateFormats.API)}),
      RotaEntity.default().fromApi({'date': startOfWeek.clone().add(4, 'days').format(DateFormats.API)}),
      RotaEntity.default().fromApi({'date': startOfWeek.clone().add(5, 'days').format(DateFormats.API)}),
      RotaEntity.default().fromApi({'date': startOfWeek.clone().add(6, 'days').format(DateFormats.API)}),
    ];
    return RotasForWeek.default().update(dates);
  }

  private readonly rotas: Map<string, RotaEntity> = new Map<string, RotaEntity>();

  constructor(rotas: Map<string, RotaEntity>) {
    this.rotas = rotas;
  }

  public hasRotaForDate(date: moment.Moment) {
    return this.rotas.has(date.format(DateFormats.API));
  }

  public getRotaForDate(date: moment.Moment) {
    return this.rotas.get(date.format(DateFormats.API));
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
      const rota = this.rotas.get(date.format(DateFormats.API));
      if (rota === undefined || rota === null) {
        return RotaEntity.default()
      }
      return rota;
    });
  }

  public populateWeekFromApi(date: moment.Moment, obj: any[]) {
    return this
      .update(Array.from(RotasForWeek.defaultForWeek(moment.utc(date)).rotas.values())) // ensure week is populated
      .update(Array.from(this.rotas.values())) // ensure we are not overwriting any existing data
      .fromApi(obj); // now overwrite anything fromApi new data
  }

  public update(newRotas: RotaEntity[]): RotasForWeek {
    const rotas = this.getClonedRotas();
    newRotas.forEach((rota, key) => rotas.set(rota.date, rota));
    return new RotasForWeek(rotas);
  }

  private fromApi(o: any[]): RotasForWeek {
    const obj = o ? o.map(d => Object.assign({}, d, {date: moment.utc(d.date)})) : [];
    const newRotas = this.getNewRotasFromApiObject(obj);
    const rotas = this.getClonedRotas();
    newRotas.forEach((rota, key) => rotas.set(key, rota));
    return new RotasForWeek(rotas);
  }

  private getNewRotasFromApiObject(obj: any[]) {
    const newRotas = new Map<string, RotaEntity>();
    obj.forEach(v => {
      newRotas.set(moment.utc(v.date).format(DateFormats.API), RotaEntity.default().fromApi(v))
    });
    return newRotas;
  }

  private getClonedRotas() {
    const rotas = new Map<string, RotaEntity>();
    this.rotas.forEach((rota, key) => {
      rotas.set(key, rota.clone());
    });
    return rotas;
  }
}