import {WorkTypes} from "../Enum/WorkTypes";

export class RotaTemplate {
  public static templateFor(day: number, forecastRevenue: number, workType: WorkTypes): RotaTemplate {
    switch (day) { // 0 => Sunday
      case 7:
      case 0:
        if (forecastRevenue < 13250) {
          return workType === WorkTypes.BAR
          ? new RotaTemplate([0, 0, 0, 0, 2, 3, 5, 5, 8, 8, 10, 10, 12, 12, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 15, 15, 15, 15, 15, 15, 13, 12, 10, 9, 9, 9, 9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) // Sunday Bar : 12000
          : new RotaTemplate([0, 0, 0, 0, 2, 3, 5, 5, 8, 8, 10, 10, 12, 12, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 15, 15, 15, 15, 15, 15, 13, 12, 10, 9, 9, 9, 9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Sunday Kitchen : 12000
        } else if (forecastRevenue < 16250) {
          return workType === WorkTypes.BAR
          ? new RotaTemplate([0, 0, 0, 0, 2, 3, 5, 5, 10, 10, 12, 12, 14, 14, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 15, 14, 12, 12, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) // Sunday Bar : 14500
          : new RotaTemplate([0, 0, 0, 0, 2, 3, 5, 5, 10, 10, 12, 12, 14, 14, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 15, 14, 12, 12, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Sunday Kitchen : 14500
        } else {
          return workType === WorkTypes.BAR
          ? new RotaTemplate([0, 0, 0, 0, 2, 3, 5, 7, 10, 10, 12, 12, 16, 16, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 16, 15, 14, 12, 12, 12, 12, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) // Sunday Bar : 18000
          : new RotaTemplate([0, 0, 0, 0, 2, 3, 5, 7, 10, 10, 12, 12, 16, 16, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 16, 15, 14, 12, 12, 12, 12, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Sunday Kitchen : 18000
        }

      case 1:
        if (forecastRevenue < 7250) {
          return workType === WorkTypes.BAR
          ? new RotaTemplate([0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 7, 7, 9, 9, 9, 9, 9, 8, 8, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) // Monday Bar : 6500
          : new RotaTemplate([0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 7, 7, 9, 9, 9, 9, 9, 8, 8, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Monday Kitchen : 6500
        } else if (forecastRevenue < 9000) {
          return workType === WorkTypes.BAR
          ? new RotaTemplate([0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 8, 8, 11, 11, 11, 11, 11, 11, 10, 8, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) // Monday Bar : 8000
          : new RotaTemplate([0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 8, 8, 11, 11, 11, 11, 11, 11, 10, 8, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Monday Kitchen : 8000
        } else if (forecastRevenue < 11000) {
          return workType === WorkTypes.BAR
          ? new RotaTemplate([0, 0, 2, 2, 2, 2, 2, 2, 3, 3, 4, 4, 6, 6, 8, 8, 8, 8, 8, 6, 6, 6, 8, 8, 10, 10, 14, 14, 14, 14, 14, 12, 12, 10, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) // Monday Bar : 10000
          : new RotaTemplate([0, 0, 2, 2, 2, 2, 2, 2, 3, 3, 4, 4, 6, 6, 8, 8, 8, 8, 8, 6, 6, 6, 8, 8, 10, 10, 14, 14, 14, 14, 14, 12, 12, 10, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Monday Kitchen : 10000
        } else {
          return workType === WorkTypes.BAR
          ? new RotaTemplate([0, 0, 0, 0, 2, 3, 5, 5, 9, 9, 12, 12, 14, 14, 15, 15, 15, 15, 13, 13, 13, 13, 14, 14, 15, 15, 15, 15, 15, 15, 15, 13, 12, 10, 9, 9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) // Bank Holiday Monday Bar : 12000
          : new RotaTemplate([0, 0, 0, 0, 2, 3, 5, 5, 9, 9, 12, 12, 14, 14, 15, 15, 15, 15, 13, 13, 13, 13, 14, 14, 15, 15, 15, 15, 15, 15, 15, 13, 12, 10, 9, 9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Bank Holiday Monday Kitchen : 12000
        }

      case 2:
        if (forecastRevenue < 7250) {
          return workType === WorkTypes.BAR
          ? new RotaTemplate([0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 7, 7, 9, 9, 9, 9, 9, 8, 8, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) // Tuesday Bar : 6500
          : new RotaTemplate([0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 7, 7, 9, 9, 9, 9, 9, 8, 8, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Tuesday Kitchen : 6500
        } else if (forecastRevenue < 9000) {
          return workType === WorkTypes.BAR
          ? new RotaTemplate([0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 8, 8, 11, 11, 11, 11, 11, 11, 10, 8, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) // Tuesday Bar : 8000
          : new RotaTemplate([0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 8, 8, 11, 11, 11, 11, 11, 11, 10, 8, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Tuesday Kitchen : 8000
        } else {
          return workType === WorkTypes.BAR
          ? new RotaTemplate([0, 0, 2, 2, 2, 2, 2, 2, 3, 3, 4, 4, 6, 6, 8, 8, 8, 8, 8, 6, 6, 6, 8, 8, 10, 10, 14, 14, 14, 14, 14, 12, 12, 10, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) // Tuesday Bar : 10000
          : new RotaTemplate([0, 0, 2, 2, 2, 2, 2, 2, 3, 3, 4, 4, 6, 6, 8, 8, 8, 8, 8, 6, 6, 6, 8, 8, 10, 10, 14, 14, 14, 14, 14, 12, 12, 10, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Tuesday Kitchen : 10000
        }

      case 3:
        if (forecastRevenue < 7250) {
          return workType === WorkTypes.BAR
          ? new RotaTemplate([0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 7, 7, 9, 9, 9, 9, 9, 8, 8, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) // Wednesday Bar : 6500
          : new RotaTemplate([0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 7, 7, 9, 9, 9, 9, 9, 8, 8, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Wednesday Kitchen : 6500
        } else if (forecastRevenue < 9000) {
          return workType === WorkTypes.BAR
          ? new RotaTemplate([0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 8, 8, 11, 11, 11, 11, 11, 11, 10, 8, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) // Wednesday Bar : 8000
          : new RotaTemplate([0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 8, 8, 11, 11, 11, 11, 11, 11, 10, 8, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Wednesday Kitchen : 8000
        } else {
          return workType === WorkTypes.BAR
          ? new RotaTemplate([0, 0, 2, 2, 2, 2, 2, 2, 3, 3, 4, 4, 6, 6, 8, 8, 8, 8, 8, 6, 6, 6, 8, 8, 10, 10, 14, 14, 14, 14, 14, 12, 12, 10, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) // Wednesday Bar : 10000
          : new RotaTemplate([0, 0, 2, 2, 2, 2, 2, 2, 3, 3, 4, 4, 6, 6, 8, 8, 8, 8, 8, 6, 6, 6, 8, 8, 10, 10, 14, 14, 14, 14, 14, 12, 12, 10, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Wednesday Kitchen : 10000

        }
      case 4:
        if (forecastRevenue < 8500) {
          return workType === WorkTypes.BAR
          ? new RotaTemplate([0, 0, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 5, 5, 5, 5, 5, 5, 5, 4, 4, 4, 5, 5, 6, 6, 10, 10, 10, 10, 10, 10, 10, 7, 7, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) // Thursday Bar : 7500
          : new RotaTemplate([0, 0, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 5, 5, 5, 5, 5, 5, 5, 4, 4, 4, 5, 5, 6, 6, 10, 10, 10, 10, 10, 10, 10, 7, 7, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Thursday Kitchen : 7500
        } else if (forecastRevenue < 10750) {
          return workType === WorkTypes.BAR
          ? new RotaTemplate([0, 0, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 5, 5, 6, 6, 6, 6, 6, 4, 4, 4, 5, 5, 7, 7, 10, 10, 10, 10, 10, 10, 10, 8, 8, 8, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) // Thursday Bar : 9500
          : new RotaTemplate([0, 0, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 5, 5, 6, 6, 6, 6, 6, 4, 4, 4, 5, 5, 7, 7, 10, 10, 10, 10, 10, 10, 10, 8, 8, 8, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Thursday Kitchen : 9500
        } else {
          return workType === WorkTypes.BAR
          ? new RotaTemplate([0, 0, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 6, 6, 10, 10, 10, 10, 8, 8, 8, 8, 8, 10, 12, 12, 14, 14, 14, 14, 14, 14, 13, 12, 12, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) // Thursday Bar : 12000
          : new RotaTemplate([0, 0, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 6, 6, 10, 10, 10, 10, 8, 8, 8, 8, 8, 10, 12, 12, 14, 14, 14, 14, 14, 14, 13, 12, 12, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Thursday Kitchen : 12000
        }

      case 5:
        if (forecastRevenue < 12000) {
          return workType === WorkTypes.BAR
          ? new RotaTemplate([0, 0, 2, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6, 6, 6, 6, 4, 4, 4, 4, 7, 7, 10, 10, 14, 14, 14, 14, 14, 14, 13, 12, 12, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) // Friday Bar : 10000
          : new RotaTemplate([0, 0, 2, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6, 6, 6, 6, 4, 4, 4, 4, 7, 7, 10, 10, 14, 14, 14, 14, 14, 14, 13, 12, 12, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Friday Kitchen : 10000
        } else if (forecastRevenue < 16000) {
          return workType === WorkTypes.BAR
          ? new RotaTemplate([0, 0, 2, 2, 2, 3, 4, 4, 5, 5, 5, 5, 6, 7, 8, 8, 8, 8, 6, 6, 6, 6, 8, 8, 12, 12, 14, 14, 14, 14, 14, 14, 13, 12, 12, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) // Friday Bar : 14000
          : new RotaTemplate([0, 0, 2, 2, 2, 3, 4, 4, 5, 5, 5, 5, 6, 7, 8, 8, 8, 8, 6, 6, 6, 6, 8, 8, 12, 12, 14, 14, 14, 14, 14, 14, 13, 12, 12, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Friday Kitchen : 14000
        } else {
          return workType === WorkTypes.BAR
          ? new RotaTemplate([0, 0, 2, 2, 2, 3, 4, 4, 5, 5, 6, 6, 8, 8, 10, 10, 10, 10, 8, 8, 8, 8, 10, 10, 14, 14, 16, 16, 18, 18, 18, 18, 16, 15, 12, 12, 12, 12, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) // Friday Bar : 18000
          : new RotaTemplate([0, 0, 2, 2, 2, 3, 4, 4, 5, 5, 6, 6, 8, 8, 10, 10, 10, 10, 8, 8, 8, 8, 10, 10, 14, 14, 16, 16, 18, 18, 18, 18, 16, 15, 12, 12, 12, 12, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Friday Kitchen : 18000
        }

      case 6:
        if (forecastRevenue < 13500) {
          return workType === WorkTypes.BAR
          ? new RotaTemplate([0, 0, 0, 0, 2, 3, 5, 5, 8, 8, 10, 10, 14, 14, 14, 14, 14, 14, 14, 14, 12, 12, 12, 15, 15, 15, 15, 15, 15, 15, 15, 13, 12, 12, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) // Saturday Bar : 12000
          : new RotaTemplate([0, 0, 0, 0, 2, 3, 5, 5, 8, 8, 10, 10, 14, 14, 14, 14, 14, 14, 14, 14, 12, 12, 12, 15, 15, 15, 15, 15, 15, 15, 15, 13, 12, 12, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Saturday Kitchen : 12000
        } else if (forecastRevenue < 17500) {
          return workType === WorkTypes.BAR
          ? new RotaTemplate([0, 0, 0, 0, 2, 3, 5, 7, 10, 10, 12, 12, 14, 14, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 15, 14, 12, 12, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) // Saturday Bar : 15000
          : new RotaTemplate([0, 0, 0, 0, 2, 3, 5, 7, 10, 10, 12, 12, 14, 14, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 15, 14, 12, 12, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Saturday Kitchen : 15000
        } else {
          return workType === WorkTypes.BAR
          ? new RotaTemplate([0, 0, 0, 0, 2, 3, 5, 8, 10, 10, 13, 13, 16, 16, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 20, 20, 20, 20, 20, 18, 15, 14, 12, 12, 12, 12, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) // Saturday Bar : 20000
          : new RotaTemplate([0, 0, 0, 0, 2, 3, 5, 8, 10, 10, 13, 13, 16, 16, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 20, 20, 20, 20, 20, 18, 15, 14, 12, 12, 12, 12, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Saturday Kitchen : 20000
        }

    }
    throw new Error(`day with index ${day} does not exist`);
  }
  // quick & dirty: index = number of 30 mins since 06:00
  private readonly staffLevels: number[];

  constructor(staffLevels: number[]) {
    this.staffLevels = staffLevels;
  }

  public staffRequired(interval: number): number {
    return this.staffLevels[interval];
  }
}