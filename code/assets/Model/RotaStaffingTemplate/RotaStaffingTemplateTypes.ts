import {WorkTypes} from "../Enum/WorkTypes";
import {ApiType, EntityType, InputType, UpdateType} from "../TypeWithNumericalInputs";

export abstract class RotaStaffingTemplateAbstract<T> {
  public readonly staffLevels: T[];
  public readonly revenue: T;
  public readonly workType: WorkTypes;
  public readonly dayOfWeek: number;

  constructor(staffLevels: T[], revenue: T, workType: WorkTypes, dayOfWeek: number) {
    this.staffLevels = staffLevels;
    this.revenue = revenue;
    this.workType = workType;
    this.dayOfWeek = dayOfWeek;
  }
}
export type RotaStaffingTemplateApiType = ApiType<RotaStaffingTemplateAbstract<number>>;
export type RotaStaffingTemplateUpdateType = UpdateType<RotaStaffingTemplateAbstract<string>>;
export type RotaStaffingTemplateInputType = InputType<RotaStaffingTemplateAbstract<string>>;
export type RotaStaffingTemplateType = EntityType<RotaStaffingTemplateAbstract<number>, RotaStaffingTemplateAbstract<string>>;