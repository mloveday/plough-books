import {StaffMember} from "../../Model/StaffMember/StaffMember";
import {StaffMemberApiType} from "../../Model/StaffMember/StaffMemberTypes";
import {EditableLocalState, IApiEditableLocalState} from "../EditableLocalState";

export class StaffMembersLocalState extends EditableLocalState<StaffMember> {
  public static default() {
    return new StaffMembersLocalState();
  }

  public constructor() {
    super(
      (obj: StaffMemberApiType) => StaffMember.fromResponse(obj),
      (a: StaffMember, b: StaffMember) => a.name > b.name ? 1 : -1
    );
  }

  public with(obj: IApiEditableLocalState<StaffMember>) {
    return Object.assign(
      new StaffMembersLocalState(),
      this,
      obj,
    );
  }

  public withEntities(obj: StaffMember[], editingEntityId: number = EditableLocalState.NOT_EDITING_ID): StaffMembersLocalState {
    return this.with(this.getUpdatedEntitiesObject(obj, editingEntityId));
  }
  public withEntity(obj: StaffMember, editingEntityId: number = EditableLocalState.NOT_EDITING_ID): StaffMembersLocalState {
    return this.with(this.getUpdatedEntityObject(obj));
  }
  public withNewEntity(obj: StaffMember): StaffMembersLocalState {
    return this.with(this.getNewEntityObject(obj));
  }
}