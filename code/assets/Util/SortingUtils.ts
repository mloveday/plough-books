import {StaffRole} from "../Model/StaffRole/StaffRole";
import {WorkTypes} from "../Enum/WorkTypes";

export const getStaffRoleOrder = (role: StaffRole) => {
  switch (role.type) {
    case WorkTypes.BAR:
      return Number(`1.${role.orderInRota}`);
    case WorkTypes.KITCHEN:
      return Number(`2.${role.orderInRota}`);
    default:
      return Number(`3.${role.orderInRota}`);
  }
};