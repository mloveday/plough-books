import * as moment from "moment";
import {RotaStatus} from "../Enum/RotaStatus";
import {WorkTypes} from "../Enum/WorkTypes";
import {CashManipulation} from "../../Util/CashManipulation";
import {DateFormats} from "../../Util/DateFormats";
import {momentFromDateAndTime} from "../../Util/DateUtils";
import {validateCash, validatePercentageToDecimal} from "../../Util/Validation";
import {Constants} from "../Constants/Constants";
import {Shift} from "../Shift/Shift";
import {RotaEntityInputs} from "./RotaEntityInputs";
import {RotaTemplate} from "./RotaTemplate";
import {RotaAbstract, RotaApiType, RotaType, RotaUpdateType} from "./RotaTypes";

export class RotaEntity extends RotaAbstract<number, Constants, Shift> implements RotaType {

  public static DEFAULT_LABOUR_RATES = [0.32, 0.32, 0.28, 0.27, 0.25, 0.26, 0.29];
  
  public static default(date: moment.Moment) {
    date = date.clone().startOf('day');
    return new RotaEntity(
      date,
      0,
      RotaEntity.DEFAULT_LABOUR_RATES[date.isoWeekday()-1],
      Constants.default(),
      RotaStatus.NEW,
      [],
      [],
      false,
      RotaEntityInputs.default(date),
    );
  }

  public static fromApi(obj: RotaApiType): RotaEntity {
    const date = moment.utc(obj.date);
    const plannedShifts = obj.plannedShifts.map(plannedShift => Shift.fromResponse(plannedShift, date.format(DateFormats.API)))
      .sort((a: Shift, b: Shift) => a.staffMember.name > b.staffMember.name ? 1 : -1);
    const actualShifts = obj.actualShifts.map(actualShift => Shift.fromResponse(actualShift, date.format(DateFormats.API)))
      .sort((a: Shift, b: Shift) => a.staffMember.name > b.staffMember.name ? 1 : -1);
    return new RotaEntity(
      date,
      obj.forecastRevenue,
      obj.targetLabourRate,
      Constants.fromResponse(obj.constants),
      obj.status as RotaStatus,
      plannedShifts,
      actualShifts,
      false,
      RotaEntityInputs.fromApi(obj),
      obj.id,
    );
  }

  public readonly id?: number;
  public readonly inputs: RotaEntityInputs;
  public readonly barRotaTemplate: RotaTemplate;
  public readonly kitchenRotaTemplate: RotaTemplate;

  constructor(date: moment.Moment, forecastRevenue: number, targetLabourRate: number, constants: Constants, status: RotaStatus, plannedShifts: Shift[], actualShifts: Shift[], touched: boolean, inputs: RotaEntityInputs, id?: number) {
    super(date.format(DateFormats.API), forecastRevenue, targetLabourRate, constants, status, plannedShifts, actualShifts, touched);
    this.id = id;
    this.inputs = inputs;
    this.barRotaTemplate = RotaTemplate.templateFor(moment.utc(this.date).day(), validateCash(String(forecastRevenue), 0), WorkTypes.BAR);
    this.kitchenRotaTemplate = RotaTemplate.templateFor(moment.utc(this.date).day(), validateCash(String(forecastRevenue), 0), WorkTypes.KITCHEN);
  }

  public updateTouched(o: RotaUpdateType): RotaEntity {
    return this.update(Object.assign({touched: true}, o));
  }

  public clone() {
    return new RotaEntity(
      this.getDate(),
      this.forecastRevenue,
      this.targetLabourRate,
      this.constants.with({}),
      this.status,
      this.plannedShifts.map(shift => shift.clone()),
      this.actualShifts.map(shift => shift.clone()),
      this.touched,
      this.inputs.clone(),
      this.id,
    )
  }

  public update(obj: RotaUpdateType): RotaEntity {
    const constants = obj.constants ? obj.constants : this.constants.with({});
    const plannedShifts = (obj.plannedShifts ? obj.plannedShifts : this.plannedShifts.map((shift: Shift) => shift.clone()))
      .sort((a: Shift, b: Shift) => a.staffMember.name > b.staffMember.name ? 1 : -1);
    const actualShifts = (obj.actualShifts ? obj.actualShifts : this.actualShifts.map((shift: Shift) => shift.clone()))
      .sort((a: Shift, b: Shift) => a.staffMember.name > b.staffMember.name ? 1 : -1);
    return new RotaEntity(
      obj.date ? moment.utc(obj.date) : this.getDate(),
      obj.forecastRevenue ? validateCash(obj.forecastRevenue, this.forecastRevenue) : this.forecastRevenue,
      obj.targetLabourRate ? validatePercentageToDecimal(obj.targetLabourRate, this.targetLabourRate) : this.targetLabourRate,
      constants,
      obj.status ? obj.status : this.status,
      plannedShifts,
      actualShifts,
      obj.touched ? obj.touched : this.touched,
      this.inputs.update(obj),
      this.id,
    );
  }

  public forApi() {
    return Object.assign(
      this.clone(),
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

  public getPlannedNumberWorkingAtTime(time: string, type: string): number {
    const dateTime = momentFromDateAndTime(this.date, time);
    if (dateTime.isBefore(momentFromDateAndTime(this.date, '06:00'))) {
      dateTime.add(1, 'days');
    }
    return this.plannedShifts.filter(shift => shift.type === type && shift.isWorkingAtTime(dateTime)).length;
  }

  private getProportionOfForecastRevenue(type: string) {
    return this.forecastRevenue*CashManipulation.getProportionOfRevenue(type, this.constants);
  }
}