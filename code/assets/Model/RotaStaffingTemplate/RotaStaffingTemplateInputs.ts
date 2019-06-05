import * as moment from "moment";
import {DateFormats} from "../../Util/DateFormats";
import {getTimePeriods} from "../../Util/DateUtils";
import {RotaStaffingTemplateStatus} from "../Enum/RotaStaffingTemplateStatus";
import {WorkTypes} from "../Enum/WorkTypes";
import {
  RotaStaffingTemplateAbstract,
  RotaStaffingTemplateApiType,
  RotaStaffingTemplateUpdateType
} from "./RotaStaffingTemplateTypes";

export class RotaStaffingTemplateInputs extends RotaStaffingTemplateAbstract<string> {
  public static default() {
    const timePeriods = getTimePeriods(moment.utc().format(DateFormats.API_DATE));
    return new RotaStaffingTemplateInputs(timePeriods.map(t => ''),'',WorkTypes.BAR,0, RotaStaffingTemplateStatus.ACTIVE);
  }
  
  public static fromApi(obj: RotaStaffingTemplateApiType) {
    return new RotaStaffingTemplateInputs(
      obj.staffLevels.map(sl => sl.toString()),
      obj.revenue.toString(),
      obj.workType,
      obj.dayOfWeek,
      obj.status,
    );
  }
  
  public with(obj: RotaStaffingTemplateUpdateType): RotaStaffingTemplateInputs {
    return new RotaStaffingTemplateInputs(
      obj.staffLevels !== undefined ? obj.staffLevels : this.staffLevels,
      obj.revenue !== undefined ? obj.revenue : this.revenue,
      obj.workType !== undefined ? obj.workType : this.workType,
      obj.dayOfWeek !== undefined ? obj.dayOfWeek : this.dayOfWeek,
      obj.status !== undefined ? obj.status : this.status,
    );
  }
}