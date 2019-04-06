import {EditableEntity} from "../EditableEntity";
import {StaffRoleInputs} from "./StaffRoleInputs";
import {StaffRoleAbstract, StaffRoleApiType, StaffRoleType, StaffRoleUpdateType} from "./StaffRoleTypes";

export class StaffRole extends StaffRoleAbstract<number> implements EditableEntity, StaffRoleType {
  
  public static fromResponse(obj: StaffRoleApiType) {
    return new StaffRole(
      obj.role,
      obj.orderInRota,
      obj.status,
      obj.type,
      StaffRoleInputs.fromResponse(obj),
      obj.id,
    );
  }

  public static default() {
    return new StaffRole('',-1,'','',StaffRoleInputs.default(), -1);
  }
  
  public readonly id?: number;
  public readonly inputs: StaffRoleInputs;

  constructor(role: string, orderInRota: number, status: string, type: string, inputs: StaffRoleInputs, id?: number) {
    super(role, orderInRota, status, type);
    this.inputs = inputs;
    this.id = id;
  }

  public with(obj: StaffRoleUpdateType): StaffRole {
    return new StaffRole(
      obj.role ? obj.role : this.role,
      obj.orderInRota ? parseInt(obj.orderInRota, 10) : this.orderInRota,
      obj.status ? obj.status : this.status,
      obj.type ? obj.type : this.type,
      this.inputs.with(obj),
      this.id,
    );
  }

  public get entityId(): number {
    return this.id ? this.id : -1;
  }

  public isValid() {
    return this.id !== -1;
  }
}
