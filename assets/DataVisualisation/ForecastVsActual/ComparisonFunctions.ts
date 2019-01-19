export class ComparisonFunctions {
  public static biggerBetter(f:number, a:number): number {
    if (a > f) {
      return 1;
    } else if (a < f) {
      return -1;
    }
    return 0;
  }

  public static smallerBetter(f:number, a:number): number {
    if (a < f) {
      return 1;
    } else if (a > f) {
      return -1;
    }
    return 0;
  }
}