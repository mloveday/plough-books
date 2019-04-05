import * as moment from "moment";
import {RotaStatus} from "../../Enum/RotaStatus";
import {ApiType, EntityType, InputType, UpdateType} from "../../State/TypeWithNumericalInputs";
import {DateFormats} from "../../Util/DateFormats";
import {Constants} from "../Constants/Constants";
import {ConstantsApiType} from "../Constants/ConstantsTypes";
import {IShiftApiObject, Shift} from "../Shift/Shift";

export abstract class RotaAbstract<T extends string|number, C,S> {
  public readonly date: string;
  public readonly forecastRevenue: T;
  public readonly targetLabourRate: T;
  public readonly constants: C;
  public readonly status: RotaStatus;
  public readonly plannedShifts: S[];
  public readonly actualShifts: S[];
  public readonly touched: boolean = false;

  constructor(date: string, forecastRevenue: T, targetLabourRate: T, constants: C, status: RotaStatus, plannedShifts: S[], actualShifts: S[], touched: boolean) {
    this.date = moment.utc(date).format(DateFormats.API);
    this.forecastRevenue = forecastRevenue;
    this.targetLabourRate = targetLabourRate;
    this.constants = constants;
    this.status = status;
    this.plannedShifts = plannedShifts;
    this.actualShifts = actualShifts;
    this.touched = touched;
  }
}

export type RotaApiType = ApiType<RotaAbstract<number, ConstantsApiType, IShiftApiObject>>;
export type RotaUpdateType = UpdateType<RotaAbstract<string, Constants, Shift>>;
export type RotaInputType = InputType<RotaAbstract<string, undefined, undefined>>;
export type RotaType = EntityType<RotaAbstract<number, Constants, Shift>, RotaAbstract<string, undefined, undefined>>;