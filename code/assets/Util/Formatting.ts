export class Formatting {
  public static formatCash(value: number, includePoundSign: boolean = true): string {
    const isNegative = value < 0;
    const sign = isNegative ? '-' : '';
    return `${sign}${includePoundSign ? ' £' : ''}${Math.abs(value).toLocaleString('en', {maximumFractionDigits: 2})}`.trim();
  }
  public static formatPercent(value: number, decimals: number = 2, includePercent: boolean = true): string {
    return (100*value).toLocaleString('en', {maximumFractionDigits: decimals})+(includePercent ? '%' : '').trim();
  }
}