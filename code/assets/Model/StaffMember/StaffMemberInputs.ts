import {StaffMemberStatus} from "../Enum/StaffMemberStatus";
import {StaffMemberAbstract, StaffMemberApiType, StaffMemberInputType, StaffMemberUpdateType} from "./StaffMemberTypes";

export class StaffMemberInputs extends StaffMemberAbstract<string, undefined> implements StaffMemberInputType {
  public static default() {
    return new StaffMemberInputs('', '', undefined, StaffMemberStatus.INACTIVE, false, '2');
  }

  public static fromApi(obj: StaffMemberApiType) {
    return new StaffMemberInputs(obj.name, obj.currentHourlyRate.toString(), undefined, obj.status, obj.defaultOffFloor, obj.orderInRota.toString());
  }

  public with(obj: StaffMemberUpdateType) {
    return new StaffMemberInputs(
      obj.name !== undefined ? obj.name : this.name,
      obj.currentHourlyRate !== undefined ? obj.currentHourlyRate : this.currentHourlyRate,
      undefined,
      obj.status !== undefined ? obj.status : this.status,
      obj.defaultOffFloor !== undefined ? obj.defaultOffFloor : this.defaultOffFloor,
      obj.orderInRota !== undefined ? obj.orderInRota : this.orderInRota,
    );
  }

  public isActive() {
    return this.status === StaffMemberStatus.ACTIVE;
  }
}