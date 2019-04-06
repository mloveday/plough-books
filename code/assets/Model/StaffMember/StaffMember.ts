import {validateCash} from "../../Util/Validation";
import {EditableEntity} from "../EditableEntity";
import {StaffMemberStatus} from "../Enum/StaffMemberStatus";
import {StaffRole} from "../StaffRole/StaffRole";
import {StaffMemberInputs} from "./StaffMemberInputs";
import {StaffMemberAbstract, StaffMemberApiType, StaffMemberType, StaffMemberUpdateType} from "./StaffMemberTypes";

export class StaffMember extends StaffMemberAbstract<number, StaffRole> implements EditableEntity, StaffMemberType {
  public static default() {
    return new StaffMember('', 0, StaffRole.default(), '', StaffMemberInputs.default(), -1);
  }

  public static fromApi(obj: StaffMemberApiType) {
    return new StaffMember(obj.name, obj.currentHourlyRate, StaffRole.fromApi(obj.role), obj.status, StaffMemberInputs.fromApi(obj), obj.id);
  }

  public readonly id?: number;
  public readonly inputs: StaffMemberInputs;

  constructor(name: string, currentHourlyRate: number, role: StaffRole, status: string, inputs: StaffMemberInputs, id?: number) {
    super(name, currentHourlyRate, role, status);
    this.inputs = inputs;
    this.id = id;
  }

  public with(obj: StaffMemberUpdateType): StaffMember {
    return new StaffMember(
      obj.name ? obj.name : this.name,
      obj.currentHourlyRate ? validateCash(obj.currentHourlyRate, this.currentHourlyRate) : this.currentHourlyRate,
      obj.role ? obj.role : this.role,
      obj.status ? obj.status : this.status,
      this.inputs.with(obj),
      this.id
    );
  }

  public clone(): StaffMember {
    return this.with({});
  }

  public get entityId() {
    return this.id ? this.id : -1;
  }

  public isActive() {
    return this.status === StaffMemberStatus.ACTIVE;
  }
}