import {DateFormats} from "../../Util/DateFormats";
import {momentFromDate} from "../../Util/DateUtils";
import {Constants} from "../Constants/Constants";
import {ConstantsApiType} from "../Constants/ConstantsTypes";
import {RotaStatus} from "../Enum/RotaStatus";
import {RotaStaffingTemplate} from "../RotaStaffingTemplate/RotaStaffingTemplate";
import {Shift} from "../Shift/Shift";
import {ShiftApiType} from "../Shift/ShiftTypes";
import {ApiType, EntityType, InputType, UpdateType} from "../TypeWithNumericalInputs";

export abstract class RotaAbstract<T extends string|number, C,S> {
  public readonly date: string;
  public readonly forecastRevenue: T;
  public readonly targetLabourRate: T;
  public readonly constants: C;
  public readonly status: RotaStatus;
  public readonly plannedShifts: S[];
  public readonly actualShifts: S[];
  public readonly touched: boolean = false;
  public readonly staffLevelModifiers: T[];

  constructor(date: string,
              forecastRevenue: T,
              targetLabourRate: T,
              constants: C,
              status: RotaStatus,
              plannedShifts: S[],
              actualShifts: S[],
              touched: boolean,
              staffLevelModifiers: T[]) {
    this.date = momentFromDate(date).format(DateFormats.API_DATE);
    this.forecastRevenue = forecastRevenue;
    this.targetLabourRate = targetLabourRate;
    this.constants = constants;
    this.status = status;
    this.plannedShifts = plannedShifts;
    this.actualShifts = actualShifts;
    this.touched = touched;
    this.staffLevelModifiers = staffLevelModifiers;
  }
}

interface Templates {
  readonly barRotaTemplate?: RotaStaffingTemplate;
  readonly kitchenRotaTemplate?: RotaStaffingTemplate;
}

export type RotaApiType = ApiType<RotaAbstract<number, ConstantsApiType, ShiftApiType>>;
export type RotaUpdateType = UpdateType<RotaAbstract<string, Constants, Shift>> & Partial<Templates>;
export type RotaInputType = InputType<RotaAbstract<string, undefined, undefined>>;
export type RotaType = EntityType<RotaAbstract<number, Constants, Shift>, RotaAbstract<string, undefined, undefined>>;