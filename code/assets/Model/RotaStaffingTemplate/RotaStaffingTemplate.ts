import * as moment from "moment";
import {DateFormats} from "../../Util/DateFormats";
import {getTimePeriods} from "../../Util/DateUtils";
import {validateInt} from "../../Util/Validation";
import {EditableEntity} from "../EditableEntity";
import {RotaStaffingTemplateStatus} from "../Enum/RotaStaffingTemplateStatus";
import {WorkTypes} from "../Enum/WorkTypes";
import {RotaStaffingTemplateInputs} from "./RotaStaffingTemplateInputs";
import {
  RotaStaffingTemplateAbstract,
  RotaStaffingTemplateApiType,
  RotaStaffingTemplateType,
  RotaStaffingTemplateUpdateType
} from "./RotaStaffingTemplateTypes";

export class RotaStaffingTemplate extends RotaStaffingTemplateAbstract<number> implements RotaStaffingTemplateType, EditableEntity {

  public static default() {
    const timePeriods = getTimePeriods(moment.utc().format(DateFormats.API_DATE));
    return new RotaStaffingTemplate(timePeriods.map(p => 0),0,WorkTypes.BAR,0, RotaStaffingTemplateStatus.INACTIVE, RotaStaffingTemplateInputs.default(), undefined);
  }

  public static fromApi(obj: RotaStaffingTemplateApiType) {
    return new RotaStaffingTemplate(
      obj.staffLevels,
      obj.revenue,
      obj.workType,
      obj.dayOfWeek,
      obj.status,
      RotaStaffingTemplateInputs.fromApi(obj),
      obj.id,
    );
  }

  public readonly id?: number;
  public readonly inputs: RotaStaffingTemplateInputs;

  constructor(staffLevels: number[], revenue: number, workType: string, dayOfWeek: number, status: RotaStaffingTemplateStatus, inputs: RotaStaffingTemplateInputs, id?: number) {
    super(staffLevels, revenue, workType, dayOfWeek, status);
    this.inputs = inputs;
    this.id = id;
  }

  public with(obj: RotaStaffingTemplateUpdateType): RotaStaffingTemplate {
    return new RotaStaffingTemplate(
      obj.staffLevels !== undefined ? obj.staffLevels.map((sl, i) => validateInt(sl, this.staffLevels[i])) : this.staffLevels,
      obj.revenue !== undefined ? validateInt(obj.revenue, this.revenue) : this.revenue,
      obj.workType !== undefined ? obj.workType : this.workType,
      obj.dayOfWeek !== undefined ? obj.dayOfWeek : this.dayOfWeek,
      obj.status !== undefined ? obj.status : this.status,
      this.inputs.with(obj),
      this.id,
    );
  }

  public clone(): RotaStaffingTemplate {
    return this.with({});
  }

  public get entityId() {
    return this.id ? this.id : -1;
  }
}