import {WorkTypes} from "../../Model/Enum/WorkTypes";

export class RotaStaffingTemplateFilters {
  public weekDay: number;
  public workType: WorkTypes;

  constructor(weekDay: number, workType: WorkTypes) {
    this.weekDay = weekDay;
    this.workType = workType;
  }

  public withWeekDay(weekDay: number) {
    return new RotaStaffingTemplateFilters(weekDay, this.workType);
  }

  public withWorkType(workType: WorkTypes) {
    return new RotaStaffingTemplateFilters(this.weekDay, workType);
  }
}