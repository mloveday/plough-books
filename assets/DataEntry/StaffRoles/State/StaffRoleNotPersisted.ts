import {StaffRoleStatus} from "../../../Enum/StaffRoleStatus";
import {WorkTypes} from "../../../Enum/WorkTypes";
import {EditableEntity} from "../../../State/EditableEntity";

export interface IApiStaffRoleNotPersistedObject {
  role?: string;
  orderInRota?: number;
  status?: string;
  type?: string;
}

export class StaffRoleNotPersisted extends EditableEntity {

  public static default() {
    return new StaffRoleNotPersisted(
      '',
      0,
      StaffRoleStatus.ACTIVE,
      WorkTypes.BAR,
    );
  }

  public readonly role: string;
  public readonly orderInRota: number;
  public readonly status: string;
  public readonly type: string;

  constructor(role: string, orderInRota: number, status: string, type: string) {
    super();
    this.role = role;
    this.orderInRota = orderInRota;
    this.status = status;
    this.type = type;
  }

  public with(obj: IApiStaffRoleNotPersistedObject) {
    return new StaffRoleNotPersisted(
      obj.role ? obj.role : this.role,
      obj.orderInRota ? obj.orderInRota : this.orderInRota,
      obj.status ? obj.status : this.status,
      obj.type ? obj.type : this.type,
    );
  }

  public get entityId(): number {
    return -1;
  }

  public isValid() {
    return false;
  }
}
