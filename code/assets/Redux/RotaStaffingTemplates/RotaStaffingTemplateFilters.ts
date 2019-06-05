import {RotaStaffingTemplateStatus} from "../../Model/Enum/RotaStaffingTemplateStatus";
import {WorkTypes} from "../../Model/Enum/WorkTypes";

export class RotaStaffingTemplateFilters {
  public readonly weekDay: number;
  public readonly workType: WorkTypes;
  public readonly status: RotaStaffingTemplateStatus;

  constructor(weekDay: number, workType: WorkTypes, status: RotaStaffingTemplateStatus) {
    this.weekDay = weekDay;
    this.workType = workType;
    this.status = status;
  }

  public withWeekDay(weekDay: number) {
    return new RotaStaffingTemplateFilters(weekDay, this.workType, this.status);
  }

  public withWorkType(workType: WorkTypes) {
    return new RotaStaffingTemplateFilters(this.weekDay, workType, this.status);
  }

  public withStatus(status: RotaStaffingTemplateStatus) {
    return new RotaStaffingTemplateFilters(this.weekDay, this.workType, status);
  }
}