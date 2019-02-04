import {StaffMemberStatus} from "../../../Enum/StaffMemberStatus";
import {EditableEntity} from "../../../State/EditableEntity";
import {IApiStaffRoleNotPersistedObject, StaffRoleNotPersisted} from "../../Rota/State/StaffRoleNotPersisted";

export interface IApiStaffMemberNotPersistedObject {
  name?: string;
  currentHourlyRate?: number;
  role?: IApiStaffRoleNotPersistedObject;
  status?: string;
}

export class StaffMemberNotPersisted extends EditableEntity {

  public static default() {
    return new StaffMemberNotPersisted(
      '',
      0,
      StaffRoleNotPersisted.default(),
      StaffMemberStatus.ACTIVE,
    );
  }

  public readonly name: string;
  public readonly currentHourlyRate: number;
  public readonly role: StaffRoleNotPersisted;
  public readonly status: string;

  constructor(name: string, currentHourlyRate: number, role: StaffRoleNotPersisted, status: string) {
    super();
    this.name = name;
    this.currentHourlyRate = currentHourlyRate;
    this.role = role;
    this.status = status;
  }

  public with(obj: IApiStaffMemberNotPersistedObject) {
    return new StaffMemberNotPersisted(
      obj.name ? obj.name : this.name,
      obj.currentHourlyRate ? obj.currentHourlyRate : this.currentHourlyRate,
      obj.role ? this.role.with(obj.role) : this.role,
      obj.status ? obj.status : this.status,
    );
  }

  public get entityId() {
    return -1;
  }

  public isActive() {
    return this.status === StaffMemberStatus.ACTIVE;
  }
}