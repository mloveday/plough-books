import {RotaStaffingTemplateStatus} from "../Enum/RotaStaffingTemplateStatus";
import {ApiType, EntityType, InputType, UpdateType} from "../TypeWithNumericalInputs";

export abstract class RotaStaffingTemplateAbstract<T> {
  public readonly staffLevels: T[];
  public readonly revenue: T;
  public readonly workType: string; // work type
  public readonly dayOfWeek: number;
  public readonly status: RotaStaffingTemplateStatus;

  constructor(staffLevels: T[], revenue: T, workType: string, dayOfWeek: number, status: RotaStaffingTemplateStatus) {
    this.staffLevels = staffLevels;
    this.revenue = revenue;
    this.workType = workType;
    this.dayOfWeek = dayOfWeek;
    this.status = status;
  }
}
export type RotaStaffingTemplateApiType = ApiType<RotaStaffingTemplateAbstract<number>>;
export type RotaStaffingTemplateUpdateType = UpdateType<RotaStaffingTemplateAbstract<string>>;
export type RotaStaffingTemplateInputType = InputType<RotaStaffingTemplateAbstract<string>>;
export type RotaStaffingTemplateType = EntityType<RotaStaffingTemplateAbstract<number>, RotaStaffingTemplateAbstract<string>>;