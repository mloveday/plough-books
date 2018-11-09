import {Routes} from "../Routing/Routes";
import {User} from "./Model/User";

export const routeAllowed = (route: string, user: User): boolean => {
  switch (route) {
    case Routes.INDEX:
    case Routes.CASH_UP:
    case Routes.ROTA:
    case Routes.SIGN_IN_SHEET:
    case Routes.WEEKLY_OVERVIEW:
      return true;
    case Routes.USERS:
      return user.role.managesUsers;
    default:
      return false;
  }
};