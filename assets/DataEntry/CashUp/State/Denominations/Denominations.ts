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

export abstract class Denominations<T> implements IDenominationsApiObject<T> {
  public readonly fiftyPounds: T;
  public readonly twentyPounds: T;
  public readonly tenPounds: T;
  public readonly fivePounds: T;
  public readonly pounds: T;
  public readonly fiftyPence: T;
  public readonly twentyPence: T;
  public readonly tenPence: T;
  public readonly fivePence: T;

  constructor(fiftyPounds: T, twentyPounds: T, tenPounds: T, fivePounds: T, pounds: T, fiftyPence: T, twentyPence: T, tenPence: T, fivePence: T) {
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

  public abstract with(obj: IDenominationsUpdateObject<string>): Denominations<T>;

  public abstract clone(): Denominations<T>;
}