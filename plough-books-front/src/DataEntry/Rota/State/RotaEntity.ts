import * as moment from "moment";
import {CashManipulation} from "../../../Util/CashManipulation";
import {DateFormats} from "../../../Util/DateFormats";
import {ActualShift} from "./ActualShift";
import {Constants} from "./Constants";
import {PlannedShift} from "./PlannedShift";

export class RotaEntity {
  public static default() {
    return new RotaEntity(
      moment(),
      0,
      0,
      Constants.default(),
      'draft',
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
  public readonly plannedShifts: PlannedShift[];
  public readonly actualShifts: ActualShift[];

  constructor(date: moment.Moment, forecastRevenue: number, targetLabourRate: number, constants: Constants, status: string, plannedShifts: PlannedShift[], actualShifts: ActualShift[]) {
    this.date = moment(date);
    this.forecastRevenue = forecastRevenue;
    this.targetLabourRate = targetLabourRate;
    this.constants = constants;
    this.status = status;
    this.plannedShifts = plannedShifts;
    this.actualShifts = actualShifts;
  }
  
  public with(o: any): RotaEntity {
    const obj = Object.assign({}, o);
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
      new RotaEntity(
        this.date,
        this.forecastRevenue,
        this.targetLabourRate,
        this.constants,
        this.status,
        this.plannedShifts,
        this.actualShifts,
      ),
      {id: this.id},
      obj
    );
  }

  public forApi() {
    return Object.assign(
      this,
      {
        actualShifts: this.actualShifts.map(actualShift => actualShift.forApi()),
        date: this.date.format(DateFormats.API),
        plannedShifts: this.plannedShifts.map(plannedShift => plannedShift.forApi()),
      }
    );
  }

  public getVatAdjustedForecastRevenue() {
    return CashManipulation.calculateVatAdjustedRevenue(this.forecastRevenue, this.constants.vatMultiplier);
  }

  public getLabourRate(weeklyForecastRevenue: number, type: string): number {
    return CashManipulation.calculateLabourRate(
      this.getTotalLabourCost(weeklyForecastRevenue, type),
      this.getProportionOfForecastRevenue(type),
      this.constants.vatMultiplier
    );
  }

  public getTotalLabourCost(weeklyForecastRevenue: number, type: string): number {
    const rawCost = this.plannedShifts
      .filter(s => s.type === type)
      .reduce<number>((a, b) => a + b.getRawCost(), 0);
    return CashManipulation.calculateTotalLabourCost(rawCost, this.forecastRevenue, weeklyForecastRevenue, type, this.constants);
  }

  private getProportionOfForecastRevenue(type: string) {
    return this.forecastRevenue*CashManipulation.getProportionOfRevenue(type, this.constants);
  }
}