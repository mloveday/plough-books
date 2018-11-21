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

  public readonly bar: Map<string, RotaLocalState> = new Map<string, RotaLocalState>();
  public readonly kitchen: Map<string, RotaLocalState> = new Map<string, RotaLocalState>();

  public with(obj: any[]|undefined): RotaLocalStates {
    const newBarRotas = new Map<string, RotaLocalState>();
    const newKitchenRotas = new Map<string, RotaLocalState>();
    if (obj !== undefined) {
      obj.forEach(v => {
        if (v.type === 'bar') {
          newBarRotas.set(moment(v.date).format('YYYY-MM-DD'), RotaLocalState.default().with(v))
        } else if (v.type === 'kitchen') {
          newKitchenRotas.set(moment(v.date).format('YYYY-MM-DD'), RotaLocalState.default().with(v))
        }
      });
    }
    const bar = new Map<string, RotaLocalState>();
    const kitchen = new Map<string, RotaLocalState>();
    this.bar.forEach((v, k) => {
      const rota = newBarRotas.get(k);
      bar.set(k, rota ? rota : v.with({}));
    });
    this.kitchen.forEach((v, k) => {
      const rota = newKitchenRotas.get(k);
      kitchen.set(k, rota ? rota : v.with({}));
    });
    newBarRotas.forEach((v,k) => bar.set(k, v));
    newKitchenRotas.forEach((v,k) => kitchen.set(k, v));
    return Object.assign(
      new RotaLocalStates(),
      {bar, kitchen}
      );
  }

  public getTotalForecastBarRevenue(): number {
    return Array.from(this.bar.values())
      .reduce((prev, curr) => prev + curr.forecastRevenue, 0);
  }

  public getTotalForecastKitchenRevenue(): number {
    return Array.from(this.kitchen.values())
      .reduce((prev, curr) => prev + curr.forecastRevenue, 0);
  }

  public getTotalVatAdjustedForecastBarRevenue(): number {
    return Array.from(this.bar.values())
      .reduce((prev, curr) => prev + CashManipulation.calculateVatAdjustedRevenue(curr.forecastRevenue, curr.constants.vatMultiplier), 0);
  }

  public getTotalVatAdjustedForecastKitchenRevenue(): number {
    return Array.from(this.kitchen.values())
      .reduce((prev, curr) => prev + CashManipulation.calculateVatAdjustedRevenue(curr.forecastRevenue, curr.constants.vatMultiplier), 0);
  }

  public getTotalBarLabour(totalForecastBarRevenue: number): number {
    return Array.from(this.bar.values())
      .reduce((prev, curr) => curr.getTotalLabourCost(totalForecastBarRevenue) + prev, 0);
  }

  public getTotalKitchenLabour(totalForecastKitchenRevenue: number): number {
    return Array.from(this.kitchen.values())
      .reduce((prev, curr) => curr.getTotalLabourCost(totalForecastKitchenRevenue) + prev, 0);
  }
}