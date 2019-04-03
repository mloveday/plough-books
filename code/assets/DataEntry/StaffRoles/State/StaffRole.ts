import {IStaffRoleNotPersistedUpdateObject, StaffRoleNotPersisted} from "./StaffRoleNotPersisted";

export interface IStaffRoleUpdateObject extends IStaffRoleNotPersistedUpdateObject {
  id?: number;
}

export interface IStaffRoleApiObject {
  id: number;
  role: string;
  orderInRota: number;
  status: string;
  type: string;
}

export class StaffRole extends StaffRoleNotPersisted {
  
  public static fromResponse(obj: IStaffRoleApiObject) {
    return new StaffRole(
      obj.role,
      obj.orderInRota,
      obj.status,
      obj.type,
      obj.id,
    );
  }

  public static placeholder() {
    return new StaffRole('',-1,'','',-1);
  }
  
  public readonly id: number;
  public readonly role: string;
  public readonly orderInRota: number;
  public readonly status: string;
  public readonly type: string;

  constructor(role: string, orderInRota: number, status: string, type: string, id: number) {
    super(role, orderInRota, status, type);
    this.id = id;
  }

  public with(obj: IStaffRoleUpdateObject) {
    return new StaffRole(
      obj.role ? obj.role : this.role,
      obj.orderInRota ? obj.orderInRota : this.orderInRota,
      obj.status ? obj.status : this.status,
      obj.type ? obj.type : this.type,
      obj.id ? obj.id : this.id,
    );
  }

  public get entityId(): number {
    return this.id;
  }

  public isValid() {
    return true;
  }
}
