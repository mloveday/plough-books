import {ApiType, EntityType, InputType, UpdateType} from "../TypeWithNumericalInputs";

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
  public readonly kitchenHoursPerShortBreak: T;
  public readonly kitchenShortBreakDuration: T;
  public readonly kitchenHoursPerLongBreak: T;
  public readonly kitchenLongBreakDuration: T;
  public readonly ersThreshold: T; // weekly threshold
  public readonly ersPercentAboveThreshold: T;
  public readonly holidayLinearPercent: T;
  public readonly pensionLinearPercent: T;

  constructor(date: string, fixedCosts: T, labourRate: T, vatMultiplier: T, barProportionOfRevenue: T, hoursPerShortBreak: T, shortBreakDuration: T, hoursPerLongBreak: T, longBreakDuration: T, kitchenHoursPerShortBreak: T, kitchenShortBreakDuration: T, kitchenHoursPerLongBreak: T, kitchenLongBreakDuration: T, ersThreshold: T, ersPercentAboveThreshold: T, holidayLinearPercent: T, pensionLinearPercent: T) {
    this.date = date;
    this.fixedCosts = fixedCosts;
    this.labourRate = labourRate;
    this.vatMultiplier = vatMultiplier;
    this.barProportionOfRevenue = barProportionOfRevenue;
    this.hoursPerShortBreak = hoursPerShortBreak;
    this.shortBreakDuration = shortBreakDuration;
    this.hoursPerLongBreak = hoursPerLongBreak;
    this.longBreakDuration = longBreakDuration;
    this.kitchenHoursPerShortBreak = kitchenHoursPerShortBreak;
    this.kitchenShortBreakDuration = kitchenShortBreakDuration;
    this.kitchenHoursPerLongBreak = kitchenHoursPerLongBreak;
    this.kitchenLongBreakDuration = kitchenLongBreakDuration;
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