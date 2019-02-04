import {StaffMemberStatus} from "../../../Enum/StaffMemberStatus";
import {EditableEntity} from "../../../State/EditableEntity";
import {StaffRole} from "./StaffRole";
import {IApiStaffRoleNotPersistedObject, StaffRoleNotPersisted} from "./StaffRoleNotPersisted";

export interface IApiStaffMemberObject {
  id?: number;
  name?: string;
  currentHourlyRate?: number;
  role?: IApiStaffRoleNotPersistedObject;
  status?: string;
}

export class StaffMember extends EditableEntity {

  public static default() {
    return new StaffMember(
      '',
      0,
      StaffRoleNotPersisted.default(),
      StaffMemberStatus.ACTIVE,
    );
  }

  public readonly id: number;
  public readonly name: string;
  public readonly currentHourlyRate: number;
  public readonly role: StaffRole;
  public readonly status: string;

  constructor(name: string, currentHourlyRate: number, role: StaffRole, status: string) {
    super();
    this.name = name;
    this.currentHourlyRate = currentHourlyRate;
    this.role = role;
    this.status = status;
  }

  public with(obj: IApiStaffMemberObject) {
    obj.role = obj.role ? this.role.with(obj.role) : this.role;
    return Object.assign(
      new StaffMember(
        this.name,
        this.currentHourlyRate,
        this.role,
        this.status,
      ),
      {id: this.id},
      obj,
    );
  }

  public get entityId() {
    return this.id;
  }

  public isActive() {
    return this.status === StaffMemberStatus.ACTIVE;
  }
}