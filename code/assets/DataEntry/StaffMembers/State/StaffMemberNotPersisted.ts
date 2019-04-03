import {StaffMemberStatus} from "../../../Enum/StaffMemberStatus";
import {EditableEntity} from "../../../State/EditableEntity";
import {validateCash} from "../../../Util/Validation";
import {IStaffRoleUpdateObject} from "../../StaffRoles/State/StaffRole";
import {StaffRoleNotPersisted} from "../../StaffRoles/State/StaffRoleNotPersisted";

export interface IStaffMemberNotPersistedUpdateObject {
  name?: string;
  currentHourlyRate?: number;
  currentHourlyRateInput?: string; // todo replace with proper typing
  role?: IStaffRoleUpdateObject;
  status?: string;
}

export class StaffMemberNotPersisted extends EditableEntity {

  public static default() {
    return new StaffMemberNotPersisted('', 0, '', StaffRoleNotPersisted.default(), StaffMemberStatus.ACTIVE);
  }

  public readonly name: string;
  public readonly currentHourlyRate: number;
  public readonly currentHourlyRateInput: string; // todo replace with proper typing
  public readonly role: StaffRoleNotPersisted;
  public readonly status: string;

  constructor(name: string, currentHourlyRate: number, currentHourlyRateInput: string, role: StaffRoleNotPersisted, status: string) {
    super();
    this.name = name;
    this.currentHourlyRate = currentHourlyRate;
    this.currentHourlyRateInput = currentHourlyRateInput;
    this.role = role;
    this.status = status;
  }

  public with(obj: IStaffMemberNotPersistedUpdateObject) {
    return new StaffMemberNotPersisted(
      obj.name ? obj.name : this.name,
      obj.currentHourlyRate ? obj.currentHourlyRate : (obj.currentHourlyRateInput ? validateCash(obj.currentHourlyRateInput, this.currentHourlyRate) : this.currentHourlyRate),
      obj.currentHourlyRateInput ? obj.currentHourlyRateInput : this.currentHourlyRateInput,
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