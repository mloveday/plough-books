import {ApiType, EntityType, InputType, UpdateType} from "../../State/TypeWithNumericalInputs";

export abstract class ConstantsAbstract<T> {
  public readonly date: string;
  public readonly fixedCosts: T;
  public readonly labourRate: T;
  public readonly vatMultiplier: T;
  public readonly barProportionOfRevenue: T;
  public readonly hoursPerShortBreak: T;
  public readonly shortBreakDuration: T;
  public readonly hoursPerLongBreak: T;
  public readonly longBreakDuration: T;
  public readonly ersThreshold: T;
  public readonly ersPercentAboveThreshold: T;
  public readonly holidayLinearPercent: T;
  public readonly pensionLinearPercent: T;

  constructor(date: string, fixedCosts: T, labourRate: T, vatMultiplier: T, barProportionOfRevenue: T, hoursPerShortBreak: T, shortBreakDuration: T, hoursPerLongBreak: T, longBreakDuration: T, ersThreshold: T, ersPercentAboveThreshold: T, holidayLinearPercent: T, pensionLinearPercent: T) {
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
}
export type ConstantsApiType = ApiType<ConstantsAbstract<number>>;
export type ConstantsUpdateType = UpdateType<ConstantsAbstract<string>>;
export type ConstantsInputType = InputType<ConstantsAbstract<string>>;
export type ConstantsType = EntityType<ConstantsAbstract<number>, ConstantsAbstract<string>>;