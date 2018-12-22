export class Formatting {
  public static formatCash(value: number): string {
    return '£'+value.toLocaleString('en', {maximumFractionDigits: 2});
  }
  public static formatPercent(value: number): string {
    return (100*value).toLocaleString('en', {maximumFractionDigits: 2})+'%';
  }
}