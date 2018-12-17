import {WorkTypes} from "../../../Enum/WorkTypes";

export class StaffRole {

  public static default() {
    return new StaffRole(
      '',
      0,
      'inactive',
      WorkTypes.BAR,
    );
  }

  public readonly id: number;
  public readonly role: string;
  public readonly orderInRota: number;
  public readonly status: string;
  public readonly type: string;

  constructor(role: string, orderInRota: number, status: string, type: string) {
    this.role = role;
    this.orderInRota = orderInRota;
    this.status = status;
    this.type = type;
  }

  public with(obj: any) {
    return Object.assign(
      new StaffRole(
        this.role,
        this.orderInRota,
        this.status,
        this.type,
      ),
      {id: this.id},
      obj,
    );
  }
}