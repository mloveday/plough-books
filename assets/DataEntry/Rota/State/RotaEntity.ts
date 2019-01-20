import * as moment from "moment";
import {RotaStatus} from "../../../Enum/RotaStatus";
import {WorkTypes} from "../../../Enum/WorkTypes";
import {CashManipulation} from "../../../Util/CashManipulation";
import {DateFormats} from "../../../Util/DateFormats";
import {Constants} from "./Constants";
import {Shift} from "./Shift";

export class RotaEntity {

  public static DEFAULT_LABOUR_RATES = [0.32, 0.32, 0.28, 0.27, 0.25, 0.26, 0.29];
  public static default() {
    return new RotaEntity(
      moment.utc().startOf('day'),
      0,
      0,
      Constants.default(),
      RotaStatus.NEW,
      [],
      [],
    ).with({});
  }

  public readonly id: number;
  public readonly date: string;
  public readonly forecastRevenue: number;
  public readonly targetLabourRate: number;
  public readonly constants: Constants;
  public readonly status: RotaStatus;
  public readonly plannedShifts: Shift[];
  public readonly actualShifts: Shift[];
  public readonly touched: boolean = false;

  constructor(date: moment.Moment, forecastRevenue: number, targetLabourRate: number, constants: Constants, status: RotaStatus, plannedShifts: Shift[], actualShifts: Shift[]) {
    this.date = date.format(DateFormats.API);
    this.forecastRevenue = forecastRevenue;
    this.targetLabourRate = targetLabourRate;
    this.constants = constants;
    this.status = status;
    this.plannedShifts = plannedShifts;
    this.actualShifts = actualShifts;
  }

  public touchedWith(o: any): RotaEntity {
    return this.with(Object.assign({touched: true}, o));
  }
  
  public with(o: any): RotaEntity {
    const obj = Object.assign({}, o);
    obj.date = obj.date ? moment.utc(obj.date).format(DateFormats.API) : this.date;
    obj.constants = obj.constants ? this.constants.with(obj.constants) : this.constants.with({});
    obj.plannedShifts = (obj.plannedShifts
      ? obj.plannedShifts.map((plannedShift: any) => Shift.default().with(Object.assign({date: obj.date}, plannedShift)))
      : this.plannedShifts.map(plannedShift => plannedShift.with({})))
      .sort((a: Shift, b: Shift) => a.staffMember.name > b.staffMember.name ? 1 : -1);
    obj.actualShifts = (obj.actualShifts
      ? obj.actualShifts.map((actualShift: any) => Shift.default().with(Object.assign({date: obj.date}, actualShift)))
      : this.actualShifts.map(actualShift => actualShift.with({})))
      .sort((a: Shift, b: Shift) => a.staffMember.name > b.staffMember.name ? 1 : -1);
    if (!obj.targetLabourRate && this.targetLabourRate === 0) {
      obj.targetLabourRate = RotaEntity.DEFAULT_LABOUR_RATES[moment.utc(obj.date).isoWeekday()-1];
    }
    return Object.assign(
      new RotaEntity(
        this.getDate(),
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
        plannedShifts: this.plannedShifts.map(plannedShift => plannedShift.forApi()),
      }
    );
  }

  public getVatAdjustedForecastRevenue() {
    return CashManipulation.calculateVatAdjustedRevenue(this.forecastRevenue, this.constants.vatMultiplier);
  }

  public getPredictedLabourRate(weeklyForecastRevenue: number, type: string): number {
    return CashManipulation.calculateLabourRate(
      this.getTotalPredictedLabourCost(weeklyForecastRevenue, type),
      this.getProportionOfForecastRevenue(type),
      this.constants.vatMultiplier
    );
  }

  public getTotalPredictedLabourCost(weeklyForecastRevenue: number, type: string): number {
    const rawCost = this.plannedShifts
      .filter(s => s.type === type)
      .reduce<number>((a, b) => a + b.getRawCost(), 0);
    return CashManipulation.calculateTotalLabourCost(rawCost, this.forecastRevenue, weeklyForecastRevenue, type, this.constants);
  }

  public getActualLabourRate(revenueToday: number, weeklyRevenue: number, type: string): number {
    return CashManipulation.calculateLabourRate(
      this.getTotalActualLabourCost(revenueToday, weeklyRevenue, type),
      revenueToday*CashManipulation.getProportionOfRevenue(type, this.constants),
      this.constants.vatMultiplier
    );
  }

  public getCombinedActualLabourRate(revenueToday: number, weeklyRevenue: number): number {
    return CashManipulation.calculateLabourRate(
      this.getTotalActualLabourCost(revenueToday, weeklyRevenue, WorkTypes.BAR) + this.getTotalActualLabourCost(revenueToday, weeklyRevenue, WorkTypes.KITCHEN),
      revenueToday,
      this.constants.vatMultiplier
    );
  }

  public getTotalActualLabourCost(revenueToday: number, weeklyRevenue: number, type: string): number {
    const rawCost = this.actualShifts
      .filter(s => s.type === type)
      .reduce<number>((a, b) => a + b.getRawCost(), 0);
    return CashManipulation.calculateTotalLabourCost(rawCost, revenueToday, weeklyRevenue, type, this.constants);
  }

  public getCombinedRunningLabourRate(revenueToday: number, weeklyRevenue: number): number {
    return CashManipulation.calculateLabourRate(
      this.getTotalRunningLabourCost(revenueToday, weeklyRevenue, WorkTypes.BAR) + this.getTotalRunningLabourCost(revenueToday, weeklyRevenue, WorkTypes.KITCHEN),
      revenueToday,
      this.constants.vatMultiplier
    );
  }

  public getTotalRunningLabourCost(revenueToday: number, weeklyRevenue: number, type: string): number {
    const shifts = (this.actualShifts.length > 0 ? this.actualShifts : this.plannedShifts);
    const rawCost = shifts
      .filter(s => s.type === type)
      .reduce<number>((a, b) => a + b.getRawCost(), 0);
    return CashManipulation.calculateTotalLabourCost(rawCost, revenueToday, weeklyRevenue, type, this.constants);
  }

  public canEditRota() {
    return this.status === RotaStatus.DRAFT || this.status === RotaStatus.NEW;
  }

  public canEditSignIn() {
    return this.status === RotaStatus.ROTA_COMPLETE;
  }

  public getDate(): moment.Moment {
    return moment.utc(this.date);
  }

  public getReadableStatus() {
    switch (this.status) {
      case RotaStatus.NEW: return 'New';
      case RotaStatus.DRAFT: return 'Draft';
      case RotaStatus.ROTA_COMPLETE: return 'Rota Complete';
      case RotaStatus.SIGN_IN_COMPLETE: return 'Sign In Complete';
      case RotaStatus.IMPORTED: return 'Imported';
    }
    return '-';
  }

  private getProportionOfForecastRevenue(type: string) {
    return this.forecastRevenue*CashManipulation.getProportionOfRevenue(type, this.constants);
  }
}