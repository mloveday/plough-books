import * as moment from "moment";
import {DateFormats} from "../../Util/DateFormats";
import {Formatting} from "../../Util/Formatting";
import {ConstantsAbstract, ConstantsApiType, ConstantsUpdateType} from "./ConstantsTypes";

export class ConstantsInputs extends ConstantsAbstract<string> {
  public static default() {
    return new ConstantsInputs(moment.utc().format(DateFormats.API_DATE), '', '', '', '', '', '', '', '', '', '', '', '');
  }
  
  public static fromApi(obj: ConstantsApiType) {
    return new ConstantsInputs(
      obj.date,
      obj.fixedCosts.toString(),
      Formatting.formatPercent(obj.labourRate, 3, false),
      obj.vatMultiplier.toString(),
      Formatting.formatPercent(obj.barProportionOfRevenue, 3, false),
      obj.hoursPerShortBreak.toString(),
      obj.shortBreakDuration.toString(),
      obj.hoursPerLongBreak.toString(),
      obj.longBreakDuration.toString(),
      obj.ersThreshold.toString(),
      Formatting.formatPercent(obj.ersPercentAboveThreshold, 3, false),
      Formatting.formatPercent(obj.holidayLinearPercent, 3, false),
      Formatting.formatPercent(obj.pensionLinearPercent, 3, false)
    );
  }
  
  public with(obj: ConstantsUpdateType): ConstantsInputs {
    return new ConstantsInputs(
      obj.date !== undefined ? obj.date : this.date,
      obj.fixedCosts !== undefined ? obj.fixedCosts : this.fixedCosts,
      obj.labourRate !== undefined ? obj.labourRate : this.labourRate,
      obj.vatMultiplier !== undefined ? obj.vatMultiplier : this.vatMultiplier,
      obj.barProportionOfRevenue !== undefined ? obj.barProportionOfRevenue : this.barProportionOfRevenue,
      obj.hoursPerShortBreak !== undefined ? obj.hoursPerShortBreak : this.hoursPerShortBreak,
      obj.shortBreakDuration !== undefined ? obj.shortBreakDuration : this.shortBreakDuration,
      obj.hoursPerLongBreak !== undefined ? obj.hoursPerLongBreak : this.hoursPerLongBreak,
      obj.longBreakDuration !== undefined ? obj.longBreakDuration : this.longBreakDuration,
      obj.ersThreshold !== undefined ? obj.ersThreshold : this.ersThreshold,
      obj.ersPercentAboveThreshold !== undefined ? obj.ersPercentAboveThreshold : this.ersPercentAboveThreshold,
      obj.holidayLinearPercent !== undefined ? obj.holidayLinearPercent : this.holidayLinearPercent,
      obj.pensionLinearPercent !== undefined ? obj.pensionLinearPercent : this.pensionLinearPercent
    );
  }
}