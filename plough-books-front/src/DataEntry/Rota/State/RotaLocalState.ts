import * as moment from "moment";
import {CashManipulation} from "../../../Util/CashManipulation";
import {ActualShift} from "./ActualShift";
import {Constants} from "./Constants";
import {PlannedShift} from "./PlannedShift";

export class RotaLocalState {
  public static default() {
    return new RotaLocalState(
      moment(),
      0,
      0,
      Constants.default(),
      'draft',
      'bar',
      [],
      [],
    );
  }

  public readonly id: number;
  public readonly date: moment.Moment;
  public readonly forecastRevenue: number;
  public readonly targetLabourRate: number;
  public readonly constants: Constants;
  public readonly status: string;
  public readonly type: string;
  public readonly plannedShifts: PlannedShift[];
  public readonly actualShifts: ActualShift[];

  constructor(date: moment.Moment, forecastRevenue: number, targetLabourRate: number, constants: Constants, status: string, type: string, plannedShifts: PlannedShift[], actualShifts: ActualShift[]) {
    this.date = date;
    this.forecastRevenue = forecastRevenue;
    this.targetLabourRate = targetLabourRate;
    this.constants = constants;
    this.status = status;
    this.type = type;
    this.plannedShifts = plannedShifts;
    this.actualShifts = actualShifts;
  }
  
  public with(obj: any): RotaLocalState {
    obj.date = obj.date ? moment(obj.date) : this.date.clone();
    obj.constants = obj.constants ? this.constants.with(obj.constants) : this.constants.with({});
    obj.plannedShifts = (obj.plannedShifts
      ? obj.plannedShifts.map((plannedShift: any) => PlannedShift.default().with(plannedShift))
      : this.plannedShifts.map(plannedShift => plannedShift.with({})))
      .sort((a: PlannedShift, b: PlannedShift) => a.staffMember.name > b.staffMember.name ? 1 : -1);
    obj.actualShifts = (obj.actualShifts
      ? obj.actualShifts.map((actualShift: any) => ActualShift.default().with(actualShift))
      : this.actualShifts.map(actualShift => actualShift.with({})))
      .sort((a: ActualShift, b: ActualShift) => a.staffMember.name > b.staffMember.name ? 1 : -1);
    return Object.assign(
      new RotaLocalState(
        this.date,
        this.forecastRevenue,
        this.targetLabourRate,
        this.constants,
        this.status,
        this.type,
        this.plannedShifts,
        this.actualShifts,
      ),
      {id: this.id},
      obj
    );
  }

  public getVatAdjustedForecastRevenue() {
    return CashManipulation.calculateVatAdjustedRevenue(this.forecastRevenue, this.constants.vatMultiplier);
  }

  public getLabourRate(weeklyForecastRevenue: number): number {
    return CashManipulation.calculateLabourRate(
      this.getTotalLabourCost(weeklyForecastRevenue),
      this.getProportionOfForecastRevenue(),
      this.constants.vatMultiplier
    );
  }

  public getTotalLabourCost(weeklyForecastRevenue: number): number {
    const rawCost = this.plannedShifts
      .reduce<number>((a, b) => a + b.getRawCost(), 0);
    return CashManipulation.calculateTotalLabourCost(rawCost, this.forecastRevenue, weeklyForecastRevenue, this.type, this.constants);
  }

  private getProportionOfForecastRevenue() {
    return this.forecastRevenue*CashManipulation.getProportionOfRevenue(this.type, this.constants);
  }
}