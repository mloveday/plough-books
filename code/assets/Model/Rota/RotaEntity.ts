import * as moment from "moment";
import {CashManipulation} from "../../Util/CashManipulation";
import {DateFormats} from "../../Util/DateFormats";
import {getTimePeriods, momentFromDate, momentFromDateAndTime} from "../../Util/DateUtils";
import {validateCash, validateInt, validatePercentageToDecimal} from "../../Util/Validation";
import {Constants} from "../Constants/Constants";
import {RotaStatus} from "../Enum/RotaStatus";
import {WorkType, WorkTypes} from "../Enum/WorkTypes";
import {RotaStaffingTemplate} from "../RotaStaffingTemplate/RotaStaffingTemplate";
import {Shift} from "../Shift/Shift";
import {RotaEntityInputs} from "./RotaEntityInputs";
import {RotaAbstract, RotaApiType, RotaType, RotaUpdateType} from "./RotaTypes";

export class RotaEntity extends RotaAbstract<number, Constants, Shift> implements RotaType {

  public static DEFAULT_LABOUR_RATES = [0.32, 0.32, 0.28, 0.27, 0.25, 0.26, 0.29];
  
  public static default(date: moment.Moment) {
    date = date.clone().startOf('day');
    const timePeriods = getTimePeriods(moment.utc().format(DateFormats.API_DATE));
    return new RotaEntity(date,
                          0,
                          RotaEntity.DEFAULT_LABOUR_RATES[date.isoWeekday() - 1],
                          Constants.default(),
                          RotaStatus.NEW,
                          [],
                          [],
                          false,
                          RotaStaffingTemplate.default(),
                          RotaStaffingTemplate.default(),
                          timePeriods.map(p => 0),
                          RotaEntityInputs.default(
                            date));
  }

  public static fromApi(obj: RotaApiType): RotaEntity {
    const date = momentFromDate(obj.date);
    const plannedShifts = obj.plannedShifts.map(plannedShift => Shift.fromApi(plannedShift, date.format(DateFormats.API_DATE)))
      .sort((a: Shift, b: Shift) => a.staffMember.name > b.staffMember.name ? 1 : -1);
    const actualShifts = obj.actualShifts.map(actualShift => Shift.fromApi(actualShift, date.format(DateFormats.API_DATE)))
      .sort((a: Shift, b: Shift) => a.staffMember.name > b.staffMember.name ? 1 : -1);
    return new RotaEntity(date,
                          obj.forecastRevenue,
                          obj.targetLabourRate,
                          Constants.fromApi(obj.constants),
                          obj.status as RotaStatus,
                          plannedShifts,
                          actualShifts,
                          false,
                          RotaStaffingTemplate.default(),
                          RotaStaffingTemplate.default(),
                          obj.staffLevelModifiers,
                          RotaEntityInputs.fromApi(
                            obj),
                          obj.id);
  }

  public readonly id?: number;
  public readonly inputs: RotaEntityInputs;
  public readonly barRotaTemplate: RotaStaffingTemplate;
  public readonly kitchenRotaTemplate: RotaStaffingTemplate;
  private readonly startOfDay: moment.Moment;

  constructor(date: moment.Moment,
              forecastRevenue: number,
              targetLabourRate: number,
              constants: Constants,
              status: RotaStatus,
              plannedShifts: Shift[],
              actualShifts: Shift[],
              touched: boolean,
              barRotaTemplate: RotaStaffingTemplate,
              kitchenRotaTemplate: RotaStaffingTemplate,
              staffLevelModifiers: number[],
              inputs: RotaEntityInputs,
              id?: number) {
    super(date.format(DateFormats.API_DATE),
          forecastRevenue,
          targetLabourRate,
          constants,
          status,
          plannedShifts,
          actualShifts,
          touched,
          staffLevelModifiers);
    this.id = id;
    this.inputs = inputs;
    this.barRotaTemplate = barRotaTemplate;
    this.kitchenRotaTemplate = kitchenRotaTemplate;
    this.startOfDay = momentFromDateAndTime(this.date, '06:00');
  }

  public updateTouched(o: RotaUpdateType): RotaEntity {
    return this.update(Object.assign({touched: true, status: this.status === RotaStatus.NEW ? RotaStatus.DRAFT : this.status}, o));
  }

  public clone() {
    return new RotaEntity(this.getDate(),
                          this.forecastRevenue,
                          this.targetLabourRate,
                          this.constants.with({}),
                          this.status,
                          this.plannedShifts.map(
                            shift => shift.clone()),
                          this.actualShifts.map(
                            shift => shift.clone()),
                          this.touched,
                          this.barRotaTemplate,
                          this.kitchenRotaTemplate,
                          this.staffLevelModifiers,
                          this.inputs.clone(),
                          this.id)
  }

  public update(obj: RotaUpdateType): RotaEntity {
    const constants = obj.constants ? obj.constants : this.constants.with({});
    const plannedShifts = (obj.plannedShifts ? obj.plannedShifts : this.plannedShifts.map((shift: Shift) => shift.clone()))
      .sort((a: Shift, b: Shift) => a.staffMember.name > b.staffMember.name ? 1 : -1);
    const actualShifts = (obj.actualShifts ? obj.actualShifts : this.actualShifts.map((shift: Shift) => shift.clone()))
      .sort((a: Shift, b: Shift) => a.staffMember.name > b.staffMember.name ? 1 : -1);
    return new RotaEntity(obj.date !== undefined ? momentFromDate(obj.date) : this.getDate(),
                          obj.forecastRevenue !== undefined ? validateCash(
                            obj.forecastRevenue,
                            this.forecastRevenue) : this.forecastRevenue,
                          obj.targetLabourRate !== undefined ? validatePercentageToDecimal(obj.targetLabourRate,
                                                                                           this.targetLabourRate) : this.targetLabourRate,
                          constants,
                          obj.status !== undefined ? obj.status : this.status,
                          plannedShifts,
                          actualShifts,
                          obj.touched !== undefined ? obj.touched : this.touched,
                          obj.barRotaTemplate !== undefined ? obj.barRotaTemplate : this.barRotaTemplate,
                          obj.kitchenRotaTemplate !== undefined ? obj.kitchenRotaTemplate : this.kitchenRotaTemplate,
                          obj.staffLevelModifiers !== undefined ? obj.staffLevelModifiers.map((sl, i) => validateInt(sl, this.staffLevelModifiers[i])) : this.staffLevelModifiers,
                          this.inputs.update(
                            obj),
                          this.id);
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

  public getCombinedPredictedLabourRate(weeklyForecastRevenue: number, getGrossWeeklyForUser: (id: number) => number): number {
    return CashManipulation.calculateLabourRate(
      this.getTotalPredictedLabourCost(weeklyForecastRevenue, WorkTypes.BAR, getGrossWeeklyForUser)
      + this.getTotalPredictedLabourCost(weeklyForecastRevenue, WorkTypes.KITCHEN, getGrossWeeklyForUser)
      + this.getTotalPredictedLabourCost(weeklyForecastRevenue, WorkTypes.ANCILLARY, getGrossWeeklyForUser),
      this.forecastRevenue,
      this.constants.vatMultiplier
    );
  }

  public getPredictedLabourRate(weeklyForecastRevenue: number, type: string, getGrossWeeklyForUser: (id: number) => number): number {
    return CashManipulation.calculateLabourRate(
      this.getTotalPredictedLabourCost(weeklyForecastRevenue, type, getGrossWeeklyForUser),
      this.getProportionOfForecastRevenue(type),
      this.constants.vatMultiplier
    );
  }

  public getTotalPredictedLabourCost(weeklyForecastRevenue: number, type: string, getGrossWeeklyForUser: (id: number) => number): number {
    const shiftsOfType = this.plannedShifts.filter(s => s.type === type);
    const staffMembers = shiftsOfType
      .map(shift => shift.staffMember)
      .filter((v, i, a) => a.indexOf(v) === i);
    const staffMemberCosts = staffMembers.map(staffMember =>({
      staffMemberId: staffMember.id === undefined ? 0 : staffMember.id,
      grossCost: shiftsOfType.filter(shift => shift.staffMember.id === staffMember.id).reduce((prev, curr) => prev + curr.getRawCost(), 0)
    }));
    return CashManipulation.calculateFixedCosts(this.forecastRevenue, weeklyForecastRevenue, type, this.constants)
      + staffMemberCosts.reduce((prev, curr) => prev + CashManipulation.calculateTotalLabourCostForStaffMember(curr.grossCost,
                                                                                                               this.forecastRevenue,
                                                                                                               weeklyForecastRevenue,
                                                                                                               type,
                                                                                                               this.constants,
                                                                                                               getGrossWeeklyForUser(curr.staffMemberId)), 0);
  }

  public getActualLabourRate(revenueToday: number, weeklyRevenue: number, type: string, getGrossWeeklyForUser: (id: number) => number): number {
    return CashManipulation.calculateLabourRate(
      this.getTotalActualLabourCost(revenueToday, weeklyRevenue, type, getGrossWeeklyForUser),
      revenueToday*CashManipulation.getProportionOfRevenue(type, this.constants),
      this.constants.vatMultiplier
    );
  }

  public getCombinedActualLabourRate(revenueToday: number, weeklyRevenue: number, getGrossWeeklyForUser: (id: number) => number): number {
    return CashManipulation.calculateLabourRate(
      this.getTotalActualLabourCost(revenueToday, weeklyRevenue, WorkTypes.BAR, getGrossWeeklyForUser)
      + this.getTotalActualLabourCost(revenueToday, weeklyRevenue, WorkTypes.KITCHEN, getGrossWeeklyForUser)
      + this.getTotalActualLabourCost(revenueToday, weeklyRevenue, WorkTypes.ANCILLARY, getGrossWeeklyForUser),
      revenueToday,
      this.constants.vatMultiplier
    );
  }

  public getTotalActualLabourCost(revenueToday: number, weeklyRevenue: number, type: string, getGrossWeeklyForUser: (id: number) => number): number {
    const shiftsOfType = this.actualShifts.filter(s => s.type === type);
    const staffMembers = shiftsOfType
      .map(shift => shift.staffMember)
      .filter((v, i, a) => a.indexOf(v) === i);
    const staffMemberCosts = staffMembers.map(staffMember =>({
      staffMemberId: staffMember.id === undefined ? 0 : staffMember.id,
      grossCost: shiftsOfType
        .filter(shift => shift.staffMember.id === staffMember.id)
        .reduce((prev, curr) => prev + curr.getRawCost(), 0)
    }));
    return CashManipulation.calculateFixedCosts(revenueToday, weeklyRevenue, type, this.constants)
      + staffMemberCosts.reduce((prev, curr) => prev + CashManipulation.calculateTotalLabourCostForStaffMember(curr.grossCost,
                                                                                                               revenueToday,
                                                                                                               weeklyRevenue,
                                                                                                               type,
                                                                                                               this.constants,
                                                                                                               getGrossWeeklyForUser(curr.staffMemberId)), 0);
  }

  public getCombinedRunningLabourRate(runningRevenueToday: number, weeklyRevenue: number, getGrossWeeklyForUser: (id: number) => number): number {
    return CashManipulation.calculateLabourRate(
      this.getCombinedRunningLabourCost(runningRevenueToday, weeklyRevenue, getGrossWeeklyForUser),
      runningRevenueToday,
      this.constants.vatMultiplier
    );
  }

  public getCombinedRunningLabourCost(revenueToday: number, weeklyRevenue: number, getGrossWeeklyForUser: (id: number) => number): number {
    return this.getTotalRunningLabourCost(revenueToday, weeklyRevenue, WorkTypes.BAR, getGrossWeeklyForUser)
      + this.getTotalRunningLabourCost(revenueToday, weeklyRevenue, WorkTypes.KITCHEN, getGrossWeeklyForUser)
      + this.getTotalRunningLabourCost(revenueToday, weeklyRevenue, WorkTypes.ANCILLARY, getGrossWeeklyForUser)
    ;
  }

  public getCombinedTargetLabourCost(): number {
    return CashManipulation.calculateTargetLabourCost(
      this.targetLabourRate,
      this.forecastRevenue,
      this.constants.vatMultiplier
    );
  }

  public getTotalRunningLabourCost(revenueToday: number, weeklyRevenue: number, type: string, getGrossWeeklyForUser: (id: number) => number): number {
    const shiftsOfType = (this.actualShifts.length > 0 ? this.actualShifts : this.plannedShifts)
      .filter(s => s.type === type);
    const staffMembers = shiftsOfType
      .map(shift => shift.staffMember)
      .filter((v, i, a) => a.indexOf(v) === i);
    const staffMemberCosts = staffMembers.map(staffMember => ({
      staffMemberId: staffMember.id === undefined ? 0 : staffMember.id,
      grossCost: shiftsOfType
        .filter(shift => shift.staffMember.id === staffMember.id)
        .reduce((prev, curr) => prev + curr.getRawCost(),0)
    }));
    return CashManipulation.calculateFixedCosts(revenueToday, weeklyRevenue, type, this.constants)
      + staffMemberCosts.reduce((prev, curr) => prev + CashManipulation.calculateTotalLabourCostForStaffMember(curr.grossCost,
                                                                                                               revenueToday,
                                                                                                               weeklyRevenue,
                                                                                                               type,
                                                                                                               this.constants,
                                                                                                               getGrossWeeklyForUser(curr.staffMemberId)), 0);
  }

  public getActualGrossLabour = (smId: number): number => this.actualShifts.filter(s => s.staffMember.id === smId).reduce((prev, curr) => prev + curr.getRawCost(), 0);
  public getPlannedGrossLabour = (smId: number): number => this.plannedShifts.filter(s => s.staffMember.id === smId).reduce((prev, curr) => prev + curr.getRawCost(), 0);

  public canEditRota() {
    return this.status === RotaStatus.DRAFT || this.status === RotaStatus.NEW;
  }

  public canEditSignIn() {
    return this.status === RotaStatus.ROTA_COMPLETE;
  }

  public getDate(): moment.Moment {
    return momentFromDate(this.date);
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
    if (dateTime.isBefore(this.startOfDay)) {
      dateTime.add(1, 'days');
    }
    return this.plannedShifts.filter(shift => shift.type === type && !shift.offFloor && shift.isWorkingAtTime(dateTime)).length;
  }

  public getTotalPlannedHoursOfType(workType: WorkType): number {
    return this.plannedShifts
      .filter(s => s.type === workType)
      .reduce((prev, curr) => prev + curr.getHoursWorking(), 0);
  }

  public getTotalActualHoursOfType(workType: WorkType): number {
    return this.actualShifts
      .filter(s => s.type === workType)
      .reduce((prev, curr) => prev + curr.getHoursWorking(), 0);
  }

  private getProportionOfForecastRevenue(type: string) {
    return this.forecastRevenue*CashManipulation.getProportionOfRevenue(type, this.constants);
  }
}