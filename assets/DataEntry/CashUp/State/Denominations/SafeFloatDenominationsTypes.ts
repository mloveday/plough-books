import {ApiType, EntityType, InputType, UpdateType} from "../../../../State/TypeWithNumericalInputs";
import {DenominationsAbstract} from "./DenominationsAbstract";

export abstract class SafeFloatDenominationsAbstract<T> extends DenominationsAbstract<T> {
  public readonly initials: string;
  constructor(fiftyPounds: T, twentyPounds: T, tenPounds: T, fivePounds: T, pounds: T, fiftyPence: T, twentyPence: T, tenPence: T, fivePence: T, initials: string) {
    super(fiftyPounds, twentyPounds, tenPounds, fivePounds, pounds, fiftyPence, twentyPence, tenPence, fivePence);
    this.initials = initials;
  }
}
export type SafeFloatDenominationsApiType = ApiType<SafeFloatDenominationsAbstract<number>>;
export type SafeFloatDenominationsUpdateType = UpdateType<SafeFloatDenominationsAbstract<string>>;
export type SafeFloatDenominationsInputType = InputType<SafeFloatDenominationsAbstract<string>>;
export type SafeFloatDenominationsType = EntityType<SafeFloatDenominationsAbstract<number>, SafeFloatDenominationsAbstract<string>>;