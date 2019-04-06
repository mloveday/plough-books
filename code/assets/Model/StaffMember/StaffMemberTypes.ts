import {ApiType, EntityType, InputType, UpdateType} from "../TypeWithNumericalInputs";
import {StaffRole} from "../StaffRole/StaffRole";
import {StaffRoleApiType} from "../StaffRole/StaffRoleTypes";

export abstract class StaffMemberAbstract<T, R> {
  public readonly name: string;
  public readonly currentHourlyRate: T;
  public readonly role: R;
  public readonly status: string;

  constructor(name: string, currentHourlyRate: T, role: R, status: string) {
    this.name = name;
    this.currentHourlyRate = currentHourlyRate;
    this.role = role;
    this.status = status;
  }
}
export type StaffMemberApiType = ApiType<StaffMemberAbstract<number, StaffRoleApiType>>;
export type StaffMemberUpdateType = UpdateType<StaffMemberAbstract<string, StaffRole>>;
export type StaffMemberInputType = InputType<StaffMemberAbstract<string, undefined>>;
export type StaffMemberType = EntityType<StaffMemberAbstract<number, StaffRole>, StaffMemberAbstract<string, undefined>>;