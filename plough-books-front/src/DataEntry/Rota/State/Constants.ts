import * as moment from "moment";

export class Constants {

  public static default() {
    return new Constants(
      moment(),
      0,
      0,
      0,
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

  public with(obj: any) {
    obj.date = obj.date ? moment(obj.date) : this.date.clone();
    return Object.assign(
      new Constants(
        this.date,
        this.fixedCosts,
        this.labourRate,
        this.vatMultiplier,
        this.barProportionOfRevenue,
        this.hoursPerShortBreak,
        this.shortBreakDuration,
        this.hoursPerLongBreak,
        this.longBreakDuration,
        this.ersThreshold,
        this.ersPercentAboveThreshold,
        this.holidayLinearPercent,
        this.pensionLinearPercent,
      ),
      {id: this.id},
      obj
    );
  }
}