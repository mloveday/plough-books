import {StaffRole} from "../StaffRole/StaffRole";
import {StaffRoleApiType} from "../StaffRole/StaffRoleTypes";
import {ApiType, EntityType, InputType, UpdateType} from "../TypeWithNumericalInputs";

export abstract class StaffMemberAbstract<T, R> {
  public readonly name: string;
  public readonly currentHourlyRate: T;
  public readonly role: R;
  public readonly status: string;
  public readonly defaultOffFloor: boolean;

  constructor(name: string, currentHourlyRate: T, role: R, status: string, defaultOffFloor: boolean) {
    this.name = name;
    this.currentHourlyRate = currentHourlyRate;
    this.role = role;
    this.status = status;
    this.defaultOffFloor = defaultOffFloor;
  }
}
export type StaffMemberApiType = ApiType<StaffMemberAbstract<number, StaffRoleApiType>>;
export type StaffMemberUpdateType = UpdateType<StaffMemberAbstract<string, StaffRole>>;
export type StaffMemberInputType = InputType<StaffMemberAbstract<string, undefined>>;
export type StaffMemberType = EntityType<StaffMemberAbstract<number, StaffRole>, StaffMemberAbstract<string, undefined>>;