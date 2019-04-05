import {Routes} from "../Routing/Routes";
import {User} from "../../Model/User/User";

export const routeAllowed = (route: string, user: User): boolean => {
  switch (route) {
    case Routes.INDEX:
    case Routes.CASH_UP:
    case Routes.ROTA:
    case Routes.SIGN_IN_SHEET:
    case Routes.WEEKLY_OVERVIEW:
    case Routes.WEEKLY_PLANNING:
    case Routes.WEEKLY_SIGN_IN:
    case Routes.WEEKLY_ROTA:
    case Routes.STAFF_MEMBERS:
    case Routes.STAFF_ROLES:
    case Routes.CONSTANTS:
    case Routes.TEST_RESULTS:
    case Routes.TEST_COVERAGE:
      return true;
    case Routes.USERS:
    case Routes.ROLES:
      return user.role.managesUsers;
    default:
      return false;
  }
};