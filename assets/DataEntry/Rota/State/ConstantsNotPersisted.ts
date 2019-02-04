import * as moment from "moment";
import {EditableEntity} from "../../../State/EditableEntity";

export interface IApiConstantsNotPersistedObject {
  date?: moment.Moment|string;
  fixedCosts?: number;
  labourRate?: number;
  vatMultiplier?: number;
  barProportionOfRevenue?: number;
  hoursPerShortBreak?: number;
  shortBreakDuration?: number;
  hoursPerLongBreak?: number;
  longBreakDuration?: number;
  ersThreshold?: number;
  ersPercentAboveThreshold?: number;
  holidayLinearPercent?: number;
  pensionLinearPercent?: number;
}

export class ConstantsNotPersisted extends EditableEntity {

  public static default() {
    return new ConstantsNotPersisted(
      moment.utc().startOf('day'),
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    );
  }

  public readonly id: number;
  public readonly date: moment.Moment;
  public readonly fixedCosts: number;
  public readonly labourRate: number;
  public readonly vatMultiplier: number;
  public readonly barProportionOfRevenue: number;
  public readonly hoursPerShortBreak: number;
  public readonly shortBreakDuration: number;
  public readonly hoursPerLongBreak: number;
  public readonly longBreakDuration: number;
  public readonly ersThreshold: number;
  public readonly ersPercentAboveThreshold: number;
  public readonly holidayLinearPercent: number;
  public readonly pensionLinearPercent: number;

  constructor(date: moment.Moment, fixedCosts: number, labourRate: number, vatMultiplier: number, barProportionOfRevenue: number, hoursPerShortBreak: number, shortBreakDuration: number, hoursPerLongBreak: number, longBreakDuration: number, ersThreshold: number, ersPercentAboveThreshold: number, holidayLinearPercent: number, pensionLinearPercent: number) {
    super();
    this.date = date;
    this.fixedCosts = fixedCosts;
    this.labourRate = labourRate;
    this.vatMultiplier = vatMultiplier;
    this.barProportionOfRevenue = barProportionOfRevenue;
    this.hoursPerShortBreak = hoursPerShortBreak;
    this.shortBreakDuration = shortBreakDuration;
    this.hoursPerLongBreak = hoursPerLongBreak;
    this.longBreakDuration = longBreakDuration;
    this.ersThreshold = ersThreshold;
    this.ersPercentAboveThreshold = ersPercentAboveThreshold;
    this.holidayLinearPercent = holidayLinearPercent;
    this.pensionLinearPercent = pensionLinearPercent;
  }

  public with(obj: IApiConstantsNotPersistedObject) {
    return new ConstantsNotPersisted(
      obj.date ? moment.utc(obj.date) : this.date.clone(),
      obj.fixedCosts ? obj.fixedCosts : this.fixedCosts,
      obj.labourRate ? obj.labourRate : this.labourRate,
      obj.vatMultiplier ? obj.vatMultiplier : this.vatMultiplier,
      obj.barProportionOfRevenue ? obj.barProportionOfRevenue : this.barProportionOfRevenue,
      obj.hoursPerShortBreak ? obj.hoursPerShortBreak : this.hoursPerShortBreak,
      obj.shortBreakDuration ? obj.shortBreakDuration : this.shortBreakDuration,
      obj.hoursPerLongBreak ? obj.hoursPerLongBreak : this.hoursPerLongBreak,
      obj.longBreakDuration ? obj.longBreakDuration : this.longBreakDuration,
      obj.ersThreshold ? obj.ersThreshold : this.ersThreshold,
      obj.ersPercentAboveThreshold ? obj.ersPercentAboveThreshold : this.ersPercentAboveThreshold,
      obj.holidayLinearPercent ? obj.holidayLinearPercent : this.holidayLinearPercent,
      obj.pensionLinearPercent ? obj.pensionLinearPercent : this.pensionLinearPercent
    );
  }

  public get entityId() {
    return -1;
  }
}