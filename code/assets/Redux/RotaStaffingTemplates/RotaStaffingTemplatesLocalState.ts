import {RotaStaffingTemplate} from "../../Model/RotaStaffingTemplate/RotaStaffingTemplate";
import {EditableLocalState, IApiEditableLocalState} from "../EditableLocalState";

export class RotaStaffingTemplatesLocalState extends EditableLocalState<RotaStaffingTemplate> {
  public static default() {
    return new RotaStaffingTemplatesLocalState();
  }

  public constructor() {
    super((a: RotaStaffingTemplate, b: RotaStaffingTemplate) => 0);
  }
  
  public with(obj: IApiEditableLocalState<RotaStaffingTemplate>): RotaStaffingTemplatesLocalState {
    return Object.assign(
      new RotaStaffingTemplatesLocalState(),
      this,
      obj
    );
  }

  public withEntities(obj: RotaStaffingTemplate[], editingEntityId: number = EditableLocalState.NOT_EDITING_ID): RotaStaffingTemplatesLocalState {
    return this.with(this.getUpdatedEntitiesObject(obj, editingEntityId));
  }
  public withEntity(obj: RotaStaffingTemplate, editingEntityId: number = EditableLocalState.NOT_EDITING_ID): RotaStaffingTemplatesLocalState {
    return this.with(this.getUpdatedEntityObject(obj));
  }
  public withNewEntity(obj: RotaStaffingTemplate): RotaStaffingTemplatesLocalState {
    return this.with(this.getNewEntityObject(obj));
  }
}