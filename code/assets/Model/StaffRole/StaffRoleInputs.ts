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
      obj.role !== undefined ? obj.role : this.role,
      obj.orderInRota !== undefined ? obj.orderInRota : this.orderInRota,
      obj.status !== undefined ? obj.status : this.status,
      obj.type !== undefined ? obj.type : this.type,
    );
  }
}
