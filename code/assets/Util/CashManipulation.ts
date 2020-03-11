import {Constants} from "../Model/Constants/Constants";
import {WorkTypes} from "../Model/Enum/WorkTypes";
import {RotaEntity} from "../Model/Rota/RotaEntity";

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

  public static calculateTotalLabourCostForStaffMember = (rawCost: number,
                                                          forecastRevenue: number,
                                                          weekForecastRevenue: number,
                                                          type: string,
                                                          constants: Constants,
                                                          weeklyGrossPay: number): number => {
    return rawCost + CashManipulation.getErsWithHoliday(rawCost, constants, weeklyGrossPay) + rawCost * constants.holidayLinearPercent + rawCost * constants.pensionLinearPercent;
  };

  public static calculateFixedCosts(forecastRevenue: number, weekForecastRevenue: number, type: string, constants: Constants) {
    return constants.fixedCosts * (forecastRevenue / weekForecastRevenue) * CashManipulation.getProportionOfRevenue(type, constants)
  }

  public static getErsWithHoliday = (cost: number, constants: Constants, weeklyGrossPay: number) => {
    // split the ERS based on percentage of total cost for week
    return Math.max(0, weeklyGrossPay - constants.ersThreshold) * constants.ersPercentAboveThreshold * (1 + constants.holidayLinearPercent) * (cost / weeklyGrossPay);
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


  public static getActualWeeklyGrossPayForUser = (rotas: RotaEntity[]) => (smId: number): number => rotas.reduce((prev, curr) => prev + curr.getActualGrossLabour(smId), 0);
  public static getPlannedWeeklyGrossPayForUser = (rotas: RotaEntity[]) => (smId: number): number => rotas.reduce((prev, curr) => prev + curr.getPlannedGrossLabour(smId), 0);
}