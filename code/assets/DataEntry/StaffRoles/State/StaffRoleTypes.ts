import {ApiType, EntityType, InputType, UpdateType} from "../../../State/TypeWithNumericalInputs";

export abstract class StaffRoleAbstract<T> {
  public readonly role: string;
  public readonly orderInRota: T;
  public readonly status: string;
  public readonly type: string;

  constructor(role: string, orderInRota: T, status: string, type: string) {
    this.role = role;
    this.orderInRota = orderInRota;
    this.status = status;
    this.type = type;
  }
}
export type StaffRoleApiType = ApiType<StaffRoleAbstract<number>>;
export type StaffRoleUpdateType = UpdateType<StaffRoleAbstract<string>>;
export type StaffRoleInputType = InputType<StaffRoleAbstract<string>>;
export type StaffRoleType = EntityType<StaffRoleAbstract<number>, StaffRoleAbstract<string>>;