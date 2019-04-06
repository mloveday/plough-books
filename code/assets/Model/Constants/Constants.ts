import * as moment from "moment";
import {DateFormats} from "../../Util/DateFormats";
import {validateCash, validateDecimal, validatePercentageToDecimal} from "../../Util/Validation";
import {EditableEntity} from "../EditableEntity";
import {ConstantsInputs} from "./ConstantsInputs";
import {ConstantsAbstract, ConstantsApiType, ConstantsType, ConstantsUpdateType} from "./ConstantsTypes";

export class Constants extends ConstantsAbstract<number> implements ConstantsType, EditableEntity {

  public static fromApi(obj: ConstantsApiType): Constants {
    return new Constants(
      obj.date,
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
      ConstantsInputs.fromApi(obj),
      obj.id,
    );
  }

  public static default() {
    return new Constants(moment.utc().format(DateFormats.API), 0,0,0,0,0,0,0,0,0,0,0,0,ConstantsInputs.default());
  }

  public readonly id?: number;
  public readonly inputs: ConstantsInputs;

  constructor(date: string, fixedCosts: number, labourRate: number, vatMultiplier: number, barProportionOfRevenue: number, hoursPerShortBreak: number, shortBreakDuration: number, hoursPerLongBreak: number, longBreakDuration: number, ersThreshold: number, ersPercentAboveThreshold: number, holidayLinearPercent: number, pensionLinearPercent: number, inputs: ConstantsInputs, id?: number) {
    super(date, fixedCosts, labourRate, vatMultiplier, barProportionOfRevenue, hoursPerShortBreak, shortBreakDuration, hoursPerLongBreak, longBreakDuration, ersThreshold, ersPercentAboveThreshold, holidayLinearPercent, pensionLinearPercent);
    this.inputs = inputs;
    this.id = id;
  }

  public with(obj: ConstantsUpdateType): Constants {
    return new Constants(
      obj.date ? obj.date : this.date,
      obj.fixedCosts ? validateCash(obj.fixedCosts, this.fixedCosts) : this.fixedCosts,
      obj.labourRate ? validatePercentageToDecimal(obj.labourRate, this.labourRate) : this.labourRate,
      obj.vatMultiplier ? validateDecimal(obj.vatMultiplier, this.vatMultiplier) : this.vatMultiplier,
      obj.barProportionOfRevenue ? validatePercentageToDecimal(obj.barProportionOfRevenue, this.barProportionOfRevenue) : this.barProportionOfRevenue,
      obj.hoursPerShortBreak ? validateDecimal(obj.hoursPerShortBreak, this.hoursPerShortBreak) : this.hoursPerShortBreak,
      obj.shortBreakDuration ? validateDecimal(obj.shortBreakDuration, this.shortBreakDuration) : this.shortBreakDuration,
      obj.hoursPerLongBreak ? validateDecimal(obj.hoursPerLongBreak, this.hoursPerLongBreak) : this.hoursPerLongBreak,
      obj.longBreakDuration ? validateDecimal(obj.longBreakDuration, this.longBreakDuration) : this.longBreakDuration,
      obj.ersThreshold ? validateCash(obj.ersThreshold, this.ersThreshold) : this.ersThreshold,
      obj.ersPercentAboveThreshold ? validatePercentageToDecimal(obj.ersPercentAboveThreshold, this.ersPercentAboveThreshold) : this.ersPercentAboveThreshold,
      obj.holidayLinearPercent ? validatePercentageToDecimal(obj.holidayLinearPercent, this.holidayLinearPercent) : this.holidayLinearPercent,
      obj.pensionLinearPercent ? validatePercentageToDecimal(obj.pensionLinearPercent, this.pensionLinearPercent) : this.pensionLinearPercent,
      this.inputs.with(obj),
      this.id,
      );
  }

  public clone(): Constants {
    return this.with({});
  }

  public get entityId() {
    return this.id ? this.id : -1;
  }
}