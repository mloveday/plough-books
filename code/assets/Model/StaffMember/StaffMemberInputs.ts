import {StaffMemberStatus} from "../../Enum/StaffMemberStatus";
import {StaffMemberAbstract, StaffMemberApiType, StaffMemberInputType, StaffMemberUpdateType} from "./StaffMemberTypes";

export class StaffMemberInputs extends StaffMemberAbstract<string, undefined> implements StaffMemberInputType {
  public static default() {
    return new StaffMemberInputs('', '', undefined, '');
  }

  public static fromResponse(obj: StaffMemberApiType) {
    return new StaffMemberInputs(obj.name, obj.currentHourlyRate.toString(), undefined, obj.status);
  }

  public with(obj: StaffMemberUpdateType) {
    return new StaffMemberInputs(
      obj.name ? obj.name : this.name,
      obj.currentHourlyRate ? obj.currentHourlyRate : this.currentHourlyRate,
      undefined,
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