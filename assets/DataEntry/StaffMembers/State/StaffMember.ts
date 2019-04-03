import {StaffMemberStatus} from "../../../Enum/StaffMemberStatus";
import {validateCash} from "../../../Util/Validation";
import {IStaffRoleApiObject, IStaffRoleUpdateObject, StaffRole} from "../../StaffRoles/State/StaffRole";
import {IStaffMemberNotPersistedUpdateObject, StaffMemberNotPersisted} from "./StaffMemberNotPersisted";

export interface IStaffMemberUpdateObject extends IStaffMemberNotPersistedUpdateObject {
  id?: number;
  role?: IStaffRoleUpdateObject;
}

export interface IStaffMemberApiObject {
  name: string;
  currentHourlyRate: number;
  role: IStaffRoleApiObject;
  status: string;
  id: number;
}

export class StaffMember extends StaffMemberNotPersisted {

  public static fromResponse(obj: IStaffMemberApiObject) {
    return new StaffMember(obj.name, obj.currentHourlyRate, obj.currentHourlyRate.toString(), StaffRole.fromResponse(obj.role), obj.status, obj.id);
  }

  public static placeholder() {
    return new StaffMember('', 0, '', StaffRole.placeholder(), '', -1);
  }

  public readonly id: number;
  public readonly role: StaffRole;

  constructor(name: string, currentHourlyRate: number, currentHourlyRateInput: string, role: StaffRole, status: string, id: number) {
    super(name, currentHourlyRate, currentHourlyRateInput, role, status);
    this.id = id;
  }

  public with(obj: IStaffMemberUpdateObject) {
    return new StaffMember(
      obj.name ? obj.name : this.name,
      obj.currentHourlyRate ? obj.currentHourlyRate : (obj.currentHourlyRateInput ? validateCash(obj.currentHourlyRateInput, this.currentHourlyRate) : this.currentHourlyRate),
      obj.currentHourlyRateInput ? obj.currentHourlyRateInput : this.currentHourlyRateInput,
      obj.role ? this.role.with(obj.role) : this.role,
      obj.status ? obj.status : this.status,
      obj.id ? obj.id : this.id
    );
  }

  public get entityId() {
    return this.id;
  }

  public isActive() {
    return this.status === StaffMemberStatus.ACTIVE;
  }
}