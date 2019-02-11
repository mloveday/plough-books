export interface IDenominationsApiObject<T> {
  fiftyPounds: T;
  twentyPounds: T;
  tenPounds: T;
  fivePounds: T;
  pounds: T;
  fiftyPence: T;
  twentyPence: T;
  tenPence: T;
  fivePence: T;
}

export interface IDenominationsUpdateObject<T> {
  fiftyPounds?: T;
  twentyPounds?: T;
  tenPounds?: T;
  fivePounds?: T;
  pounds?: T;
  fiftyPence?: T;
  twentyPence?: T;
  tenPence?: T;
  fivePence?: T;
}

export class Denominations implements IDenominationsApiObject<number> {
  public static default() {
    return new Denominations(
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    );
  }

  public readonly fiftyPounds: number;
  public readonly twentyPounds: number;
  public readonly tenPounds: number;
  public readonly fivePounds: number;
  public readonly pounds: number;
  public readonly fiftyPence: number;
  public readonly twentyPence: number;
  public readonly tenPence: number;
  public readonly fivePence: number;

  constructor(fiftyPounds: number, twentyPounds: number, tenPounds: number, fivePounds: number, pounds: number, fiftyPence: number, twentyPence: number, tenPence: number, fivePence: number) {
    this.fiftyPounds = fiftyPounds;
    this.twentyPounds = twentyPounds;
    this.tenPounds = tenPounds;
    this.fivePounds = fivePounds;
    this.pounds = pounds;
    this.fiftyPence = fiftyPence;
    this.twentyPence = twentyPence;
    this.tenPence = tenPence;
    this.fivePence = fivePence;
  }

  public with(obj: IDenominationsUpdateObject<number>): Denominations {
    return Object.assign(
      new Denominations(this.fiftyPounds, this.twentyPounds, this.tenPounds, this.fivePounds, this.pounds, this.fiftyPence, this.twentyPence, this.tenPence, this.fivePence),
      obj
    );
  }

  public clone(): Denominations {
    return this.with({});
  }
  
  public totalCashTaken(): number {
    return this.fiftyPounds + this.twentyPounds + this.tenPounds + this.fivePounds + this.pounds + this.fiftyPence + this.twentyPence + this.tenPence + this.fivePence
  }
}