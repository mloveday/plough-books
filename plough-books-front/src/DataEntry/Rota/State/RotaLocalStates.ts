import * as moment from "moment";
import {CashManipulation} from "../../../Util/CashManipulation";
import {RotaLocalState} from "./RotaLocalState";

export class RotaLocalStates {
  public static default() {
    return new RotaLocalStates();
  }

  public static defaultForWeek(dayInWeek: moment.Moment) {
    const startOfWeek = dayInWeek.clone().startOf('isoWeek');
    const dates = [
      {'date': startOfWeek.clone().add(0, 'days')},
      {'date': startOfWeek.clone().add(1, 'days')},
      {'date': startOfWeek.clone().add(2, 'days')},
      {'date': startOfWeek.clone().add(3, 'days')},
      {'date': startOfWeek.clone().add(4, 'days')},
      {'date': startOfWeek.clone().add(5, 'days')},
      {'date': startOfWeek.clone().add(6, 'days')},
    ];
    return RotaLocalStates.default().with(dates);
  }

  public readonly rotas: Map<string, RotaLocalState> = new Map<string, RotaLocalState>();

  public with(obj: any[]|undefined): RotaLocalStates {
    const newRotas = new Map<string, RotaLocalState>();
    if (obj !== undefined) {
      obj.forEach(v => {
        newRotas.set(moment(v.date).format('YYYY-MM-DD'), RotaLocalState.default().with(v))
      });
    }
    const rotas = new Map<string, RotaLocalState>();
    this.rotas.forEach((v, k) => {
      const rota = newRotas.get(k);
      rotas.set(k, rota ? rota : v.with({}));
    });
    newRotas.forEach((v,k) => rotas.set(k, v));
    return Object.assign(
      new RotaLocalStates(),
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

  public getTotalBarLabour(totalForecastBarRevenue: number): number {
    return Array.from(this.rotas.values())
      .reduce((prev, curr) => curr.getTotalLabourCost(totalForecastBarRevenue, 'bar') + prev, 0);
  }

  public getTotalKitchenLabour(totalForecastKitchenRevenue: number): number {
    return Array.from(this.rotas.values())
      .reduce((prev, curr) => curr.getTotalLabourCost(totalForecastKitchenRevenue, 'kitchen') + prev, 0);
  }
}