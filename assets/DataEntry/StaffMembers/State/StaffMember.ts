import {StaffMemberStatus} from "../../../Enum/StaffMemberStatus";
import {IApiStaffMemberNotPersistedObject, StaffMemberNotPersisted} from "./StaffMemberNotPersisted";
import {IApiStaffRoleObject, StaffRole} from "../../Rota/State/StaffRole";

export interface IApiStaffMemberObject extends IApiStaffMemberNotPersistedObject {
  id?: number;
  role?: IApiStaffRoleObject;
}

export class StaffMember extends StaffMemberNotPersisted {

  public static fromResponse(obj: any) {
    return new StaffMember(
      obj.name,
      obj.currentHourlyRate,
      StaffRole.fromResponse(obj.role),
      obj.status,
      obj.id,
    );
  }

  public readonly id: number;
  public readonly role: StaffRole;

  constructor(name: string, currentHourlyRate: number, role: StaffRole, status: string, id: number) {
    super(name, currentHourlyRate, role, status);
    this.id = id;
  }

  public with(obj: IApiStaffMemberObject) {
    return new StaffMember(
      obj.name ? obj.name : this.name,
      obj.currentHourlyRate ? obj.currentHourlyRate : this.currentHourlyRate,
      obj.role ? StaffRole.fromResponse(obj.role) : this.role,
      obj.status ? obj.status : this.status,
      obj.id ? obj.id : this.id,
    );
  }

  public get entityId() {
    return this.id;
  }

  public isActive() {
    return this.status === StaffMemberStatus.ACTIVE;
  }
}