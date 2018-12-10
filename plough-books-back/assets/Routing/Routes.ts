import * as moment from "moment";
import {accountingWeek, accountingYear} from "../Util/DateUtils";

export class Routes {
  public static readonly INDEX = "/";
  public static readonly CASH_UP = "/cash-up";
  public static readonly ROTA = "/rota";
  public static readonly SIGN_IN_SHEET = "/sign-in";
  public static readonly WEEKLY_OVERVIEW = "/weekly-overview";
  public static readonly STAFF_MEMBERS = "/staff/members";
  public static readonly STAFF_ROLES = "/staff/roles";
  public static readonly USERS = "/admin/users";
  public static readonly ROLES = "/admin/roles";
  public static readonly WEEKLY_PLANNING = "/weekly-planning";
  public static readonly DATE_FINDER = [Routes.dateRoutes(), Routes.weekRoutes(), Routes.INDEX];

  public static cashUpUrl(date: moment.Moment) {
    return `${this.CASH_UP}/${date.format("Y-MM-DD")}`;
  }

  public static cashUpRoute() {
    return `${this.CASH_UP}/:date`;
  }

  public static rotaUrl(date: moment.Moment, type: string) {
    return `${this.ROTA}/${date.format("Y-MM-DD")}/${type}`;
  }

  public static rotaRoute() {
    return `${this.ROTA}/:date/:type(bar|kitchen)`;
  }

  public static signInUrl(date: moment.Moment, type: string) {
    return `${this.SIGN_IN_SHEET}/${date.format("Y-MM-DD")}/${type}`;
  }

  public static signInRoute() {
    return `${this.SIGN_IN_SHEET}/:date/:type(bar|kitchen)`;
  }

  public static weeklyOverviewUrl(date: moment.Moment) {
    return `${this.WEEKLY_OVERVIEW}/${accountingYear(date)}/${accountingWeek(date)}`;
  }

  public static weeklyOverviewRoute() {
    return `${this.WEEKLY_OVERVIEW}/:year/:weekNumber`;
  }

  public static weeklyPlanningUrl(date: moment.Moment) {
    return `${this.WEEKLY_PLANNING}/${accountingYear(date)}/${accountingWeek(date)}`;
  }

  public static weeklyPlanningRoute() {
    return `${this.WEEKLY_PLANNING}/:year/:weekNumber`;
  }

  private static dateRoutes() {
    return `:route(${this.CASH_UP}|${this.ROTA}|${this.SIGN_IN_SHEET})/:date`;
  }

  private static weekRoutes() {
    return `:route(${this.WEEKLY_OVERVIEW}|${this.WEEKLY_PLANNING})/:year/:weekNumber`;
  }
}