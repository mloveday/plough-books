import {EditableEntity} from "../../../State/EditableEntity";
import {StaffRole} from "./StaffRole";

export class StaffMember extends EditableEntity {

  public static default() {
    return new StaffMember(
      '',
      0,
      StaffRole.default(),
      '',
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

  public with(obj: any) {
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
}