import {Constants} from "../Model/Constants/Constants";
import {WorkTypes} from "../Model/Enum/WorkTypes";

export class CashManipulation {
  public static calculateVatAdjustedRevenue(revenue: number, vatMultiplier: number) {
    return revenue/vatMultiplier;
  }

  public static calculateLabourRate = (labourCost: number, forecastRevenue: number, vatMultiplier: number): number => {
    return labourCost / CashManipulation.calculateVatAdjustedRevenue(forecastRevenue, vatMultiplier);
  };

  public static calculateTargetLabourCost = (labourRate: number, forecastRevenue: number, vatMultiplier: number): number => {
    return labourRate * CashManipulation.calculateVatAdjustedRevenue(forecastRevenue, vatMultiplier);
  };

  public static calculateTotalLabourCostForStaffMember = (gross: number, constants: Constants): number => {
    return gross + CashManipulation.getErs(gross, constants) + gross * constants.holidayLinearPercent + gross * constants.pensionLinearPercent;
  };

  public static calculateFixedCosts(forecastRevenue: number, weekForecastRevenue: number, type: string, constants: Constants) {
    return constants.fixedCosts * (forecastRevenue / weekForecastRevenue) * CashManipulation.getProportionOfRevenue(type, constants)
  }

  public static getErs = (cost: number, constants: Constants) => {
    return Math.max(0, cost - constants.ersThreshold) * constants.ersPercentAboveThreshold;
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