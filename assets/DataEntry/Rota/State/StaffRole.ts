import {IApiStaffRoleNotPersistedObject, StaffRoleNotPersisted} from "./StaffRoleNotPersisted";

export interface IApiStaffRoleObject extends IApiStaffRoleNotPersistedObject {
  id?: number;
}

export class StaffRole extends StaffRoleNotPersisted {
  
  public static fromResponse(obj: any) {
    return new StaffRole(
      obj.role,
      obj.orderInRota,
      obj.status,
      obj.type,
      obj.id,
    );
  }
  
  public readonly id: number;
  public readonly role: string;
  public readonly orderInRota: number;
  public readonly status: string;
  public readonly type: string;

  constructor(role: string, orderInRota: number, status: string, type: string, id: number) {
    super(role, orderInRota, status, type);
  }

  public with(obj: IApiStaffRoleObject) {
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
