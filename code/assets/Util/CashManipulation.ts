import {Constants} from "../Model/Constants/Constants";
import {WorkTypes} from "../Model/Enum/WorkTypes";

export class CashManipulation {
  public static calculateVatAdjustedRevenue(revenue: number, vatMultiplier: number) {
    return revenue/vatMultiplier;
  }

  public static calculateLabourRate = (labourCost: number, forecastRevenue: number, vatMultiplier: number): number => {
    return labourCost / CashManipulation.calculateVatAdjustedRevenue(forecastRevenue, vatMultiplier);
  };

  public static calculateTotalLabourCost = (rawCost: number, forecastRevenue: number, weekForecastRevenue: number, type: string, constants: Constants): number => {
    return constants.fixedCosts * (forecastRevenue / weekForecastRevenue) * CashManipulation.getProportionOfRevenue(type, constants) + rawCost + CashManipulation.getErsWithHoliday(rawCost, constants) + rawCost * constants.holidayLinearPercent + rawCost * constants.pensionLinearPercent;
  };

  public static getErsWithHoliday = (cost: number, constants: Constants) => {
    return Math.max(0, cost - constants.ersThreshold) * constants.ersPercentAboveThreshold * (1 + constants.holidayLinearPercent);
  };

  public static getProportionOfRevenue = (type: string, constants: Constants) => {
    switch (type) {
      case WorkTypes.BAR:
        return constants.barProportionOfRevenue;
      case WorkTypes.KITCHEN:
        return 1 - constants.barProportionOfRevenue;
      case WorkTypes.ANCILLARY:
      default: return 0;
    }
  };
}