import {validateInt} from "../../Util/Validation";
import {EditableEntity} from "../EditableEntity";
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
    return new RotaStaffingTemplate([],0,WorkTypes.BAR,0, RotaStaffingTemplateInputs.default(), -1);
  }

  public static fromApi(obj: RotaStaffingTemplateApiType) {
    return new RotaStaffingTemplate(
      obj.staffLevels,
      obj.revenue,
      obj.workType,
      obj.dayOfWeek,
      RotaStaffingTemplateInputs.fromApi(obj),
      obj.id,
    );
  }

  public readonly id?: number;
  public readonly inputs: RotaStaffingTemplateInputs;

  constructor(staffLevels: number[], revenue: number, workType: WorkTypes, dayOfWeek: number, inputs: RotaStaffingTemplateInputs, id?: number) {
    super(staffLevels, revenue, workType, dayOfWeek);
    this.inputs = inputs;
    this.id = id;
  }

  public with(obj: RotaStaffingTemplateUpdateType): RotaStaffingTemplate {
    return new RotaStaffingTemplate(
      obj.staffLevels !== undefined ? obj.staffLevels.map((sl, i) => validateInt(sl, this.staffLevels[i])) : this.staffLevels,
      obj.revenue !== undefined ? validateInt(obj.revenue, this.revenue) : this.revenue,
      obj.workType !== undefined ? obj.workType : this.workType,
      obj.dayOfWeek !== undefined ? obj.dayOfWeek : this.dayOfWeek,
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