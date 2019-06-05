import {WorkTypes} from "../Enum/WorkTypes";
import {
  RotaStaffingTemplateAbstract,
  RotaStaffingTemplateApiType,
  RotaStaffingTemplateUpdateType
} from "./RotaStaffingTemplateTypes";

export class RotaStaffingTemplateInputs extends RotaStaffingTemplateAbstract<string> {
  public static default() {
    return new RotaStaffingTemplateInputs([],'',WorkTypes.BAR,0);
  }
  
  public static fromApi(obj: RotaStaffingTemplateApiType) {
    return new RotaStaffingTemplateInputs(
      obj.staffLevels.map(sl => sl.toString()),
      obj.revenue.toString(),
      obj.workType,
      obj.dayOfWeek,
    );
  }
  
  public with(obj: RotaStaffingTemplateUpdateType): RotaStaffingTemplateInputs {
    return new RotaStaffingTemplateInputs(
      obj.staffLevels !== undefined ? obj.staffLevels : this.staffLevels,
      obj.revenue !== undefined ? obj.revenue : this.revenue,
      obj.workType !== undefined ? obj.workType : this.workType,
      obj.dayOfWeek !== undefined ? obj.dayOfWeek : this.dayOfWeek,
    );
  }
}