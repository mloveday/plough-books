export class Formatting {
  public static formatCashForDisplay(value: number, includePoundSign: boolean = true): string {
    const isNegative = value < 0;
    const sign = isNegative ? '-' : '';
    return `${sign}${includePoundSign ? ' £' : ''}${Math.abs(value).toLocaleString('en', {maximumFractionDigits: 2})}`.trim();
  }
  public static formatCashForInput(value: number): string {
    const isNegative = value < 0;
    const sign = isNegative ? '-' : '';
    return `${sign}${Math.abs(value).toLocaleString('en', {maximumFractionDigits: 2, useGrouping: false})}`.trim();
  }
  public static formatPercent(value: number, decimals: number = 2, includePercent: boolean = true): string {
    return ((100*value).toLocaleString('en', {maximumFractionDigits: decimals})+(includePercent ? '%' : '')).trim();
  }
  public static formatNumber(value: number, decimals: number = 2): string {
    return value.toLocaleString('en', {maximumFractionDigits: decimals}).trim();
  }
}