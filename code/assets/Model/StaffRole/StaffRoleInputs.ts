import {StaffRoleStatus} from "../Enum/StaffRoleStatus";
import {WorkTypes} from "../Enum/WorkTypes";
import {StaffRoleAbstract, StaffRoleApiType, StaffRoleInputType, StaffRoleUpdateType} from "./StaffRoleTypes";

export class StaffRoleInputs extends StaffRoleAbstract<string> implements StaffRoleInputType {
  
  public static fromApi(obj: StaffRoleApiType) {
    return new StaffRoleInputs(
      obj.role,
      obj.orderInRota.toString(),
      obj.status,
      obj.type,
    );
  }

  public static default() {
    return new StaffRoleInputs('','-1', StaffRoleStatus.INACTIVE, WorkTypes.BAR,);
  }

  public with(obj: StaffRoleUpdateType) {
    return new StaffRoleInputs(
      obj.role ? obj.role : this.role,
      obj.orderInRota ? obj.orderInRota : this.orderInRota,
      obj.status ? obj.status : this.status,
      obj.type ? obj.type : this.type,
    );
  }
}
