import {RotaStaffingTemplateStatus} from "../../Model/Enum/RotaStaffingTemplateStatus";
import {WorkType} from "../../Model/Enum/WorkTypes";

export class RotaStaffingTemplateFilters {
  public readonly weekDay: number;
  public readonly workType: WorkType;
  public readonly status: RotaStaffingTemplateStatus;

  constructor(weekDay: number, workType: WorkType, status: RotaStaffingTemplateStatus) {
    this.weekDay = weekDay;
    this.workType = workType;
    this.status = status;
  }

  public withWeekDay(weekDay: number) {
    return new RotaStaffingTemplateFilters(weekDay, this.workType, this.status);
  }

  public withWorkType(workType: WorkType) {
    return new RotaStaffingTemplateFilters(this.weekDay, workType, this.status);
  }

  public withStatus(status: RotaStaffingTemplateStatus) {
    return new RotaStaffingTemplateFilters(this.weekDay, this.workType, status);
  }
}