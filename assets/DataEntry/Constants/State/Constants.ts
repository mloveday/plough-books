import * as moment from "moment";
import {ConstantsNotPersisted, IApiConstantsNotPersistedObject} from "./ConstantsNotPersisted";

export interface IConstantsUpdateObject extends IApiConstantsNotPersistedObject {
  id?: number;
}

export interface IConstantsApiObject {
  id: number;
  date: moment.Moment|string;
  fixedCosts: number;
  labourRate: number;
  vatMultiplier: number;
  barProportionOfRevenue: number;
  hoursPerShortBreak: number;
  shortBreakDuration: number;
  hoursPerLongBreak: number;
  longBreakDuration: number;
  ersThreshold: number;
  ersPercentAboveThreshold: number;
  holidayLinearPercent: number;
  pensionLinearPercent: number;
}

export class Constants extends ConstantsNotPersisted {

  public static fromResponse(obj: IConstantsApiObject): Constants {
    return new Constants(
      moment.utc(obj.date),
      obj.fixedCosts,
      obj.labourRate,
      obj.vatMultiplier,
      obj.barProportionOfRevenue,
      obj.hoursPerShortBreak,
      obj.shortBreakDuration,
      obj.hoursPerLongBreak,
      obj.longBreakDuration,
      obj.ersThreshold,
      obj.ersPercentAboveThreshold,
      obj.holidayLinearPercent,
      obj.pensionLinearPercent,
      obj.id,
    );
  }

  public static placeholder() {
    return new Constants(moment.utc(), 0,0,0,0,0,0,0,0,0,0,0,0,-1);
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

  constructor(date: moment.Moment, fixedCosts: number, labourRate: number, vatMultiplier: number, barProportionOfRevenue: number, hoursPerShortBreak: number, shortBreakDuration: number, hoursPerLongBreak: number, longBreakDuration: number, ersThreshold: number, ersPercentAboveThreshold: number, holidayLinearPercent: number, pensionLinearPercent: number, id: number) {
    super(date, fixedCosts, labourRate, vatMultiplier, barProportionOfRevenue, hoursPerShortBreak, shortBreakDuration, hoursPerLongBreak, longBreakDuration, ersThreshold, ersPercentAboveThreshold, holidayLinearPercent, pensionLinearPercent);
    this.id = id;
  }

  public with(obj: IConstantsUpdateObject): Constants {
    return new Constants(
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
      obj.pensionLinearPercent ? obj.pensionLinearPercent : this.pensionLinearPercent,
      obj.id ? obj.id : this.id,
      );
  }

  public get entityId() {
    return this.id;
  }
}