import {IDenominationsApiObject, IDenominationsUpdateObject} from "./Denominations";

export class DenominationsInputs implements IDenominationsApiObject<string> {
  public static default() {
    return new DenominationsInputs(
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
    );
  }

  public readonly fiftyPounds: string;
  public readonly twentyPounds: string;
  public readonly tenPounds: string;
  public readonly fivePounds: string;
  public readonly pounds: string;
  public readonly fiftyPence: string;
  public readonly twentyPence: string;
  public readonly tenPence: string;
  public readonly fivePence: string;

  constructor(fiftyPounds: string, twentyPounds: string, tenPounds: string, fivePounds: string, pounds: string, fiftyPence: string, twentyPence: string, tenPence: string, fivePence: string) {
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

  public with(obj: IDenominationsUpdateObject<string>): DenominationsInputs {
    return Object.assign(
      new DenominationsInputs(this.fiftyPounds, this.twentyPounds, this.tenPounds, this.fivePounds, this.pounds, this.fiftyPence, this.twentyPence, this.tenPence, this.fivePence),
      obj
    );
  }
}