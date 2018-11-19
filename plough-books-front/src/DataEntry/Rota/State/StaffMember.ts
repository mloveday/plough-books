import {StaffRole} from "./StaffRole";

export class StaffMember {

  public static default() {
    return new StaffMember(
      '',
      0,
      StaffRole.default(),
    );
  }

  public readonly id: number;
  public readonly name: string;
  public readonly currentHourlyRate: number;
  public readonly role: StaffRole;

  constructor(name: string, currentHourlyRate: number, role: StaffRole) {
    this.name = name;
    this.currentHourlyRate = currentHourlyRate;
    this.role = role;
  }

  public with(obj: any) {
    obj.role = obj.role ? this.role.with(obj.role) : obj.role;
    return Object.assign(
      new StaffMember(
        this.name,
        this.currentHourlyRate,
        this.role,
      ),
      {id: this.id},
      obj,
    );
  }
}