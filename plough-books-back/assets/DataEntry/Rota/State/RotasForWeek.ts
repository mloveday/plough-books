import * as moment from "moment";
import {WorkTypes} from "../../../Enum/WorkTypes";
import {CashManipulation} from "../../../Util/CashManipulation";
import {DateFormats} from "../../../Util/DateFormats";
import {RotaEntity} from "./RotaEntity";

export class RotasForWeek {
  public static default() {
    return new RotasForWeek();
  }

  public static defaultForWeek(dayInWeek: moment.Moment) {
    const startOfWeek = moment(dayInWeek).startOf('isoWeek');
    const dates = [
      {'date': startOfWeek.clone().add(0, 'days')},
      {'date': startOfWeek.clone().add(1, 'days')},
      {'date': startOfWeek.clone().add(2, 'days')},
      {'date': startOfWeek.clone().add(3, 'days')},
      {'date': startOfWeek.clone().add(4, 'days')},
      {'date': startOfWeek.clone().add(5, 'days')},
      {'date': startOfWeek.clone().add(6, 'days')},
    ];
    return RotasForWeek.default().with(dates);
  }

  public readonly rotas: Map<string, RotaEntity> = new Map<string, RotaEntity>();

  public with(o: any[]|undefined): RotasForWeek {
    const obj = o ? o.map(d => Object.assign({date: moment(d.date)}, d)) : undefined;
    const newRotas = new Map<string, RotaEntity>();
    if (obj !== undefined) {
      obj.forEach(v => {
        newRotas.set(moment(v.date).format(DateFormats.API), RotaEntity.default().with(v))
      });
    }
    const rotas = new Map<string, RotaEntity>();
    this.rotas.forEach((v, k) => {
      const rota = newRotas.get(k);
      rotas.set(k, rota ? rota : v.with({}));
    });
    newRotas.forEach((v,k) => rotas.set(k, v));
    return Object.assign(
      new RotasForWeek(),
      {rotas}
      );
  }

  public getTotalForecastRevenue(): number {
    return Array.from(this.rotas.values())
      .reduce((prev, curr) => prev + curr.forecastRevenue, 0);
  }

  public getTotalVatAdjustedForecastRevenue(): number {
    return Array.from(this.rotas.values())
      .reduce((prev, curr) => prev + CashManipulation.calculateVatAdjustedRevenue(curr.forecastRevenue, curr.constants.vatMultiplier), 0);
  }

  public getTotalPredictedBarLabour(totalForecastBarRevenue: number): number {
    return Array.from(this.rotas.values())
      .reduce((prev, curr) => curr.getTotalPredictedLabourCost(totalForecastBarRevenue, WorkTypes.BAR) + prev, 0);
  }

  public getTotalPredictedKitchenLabour(totalForecastKitchenRevenue: number): number {
    return Array.from(this.rotas.values())
      .reduce((prev, curr) => curr.getTotalPredictedLabourCost(totalForecastKitchenRevenue, WorkTypes.KITCHEN) + prev, 0);
  }

  public getTargetLabourRateForWeek() {
    return Array.from(this.rotas.values()).reduce((prev, curr) => prev + curr.targetLabourRate*curr.forecastRevenue, 0) / this.getTotalForecastRevenue();
  }
}