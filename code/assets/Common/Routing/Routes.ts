import * as moment from "moment";
import {CashUpPage} from "../../Model/Enum/CashUpPage";
import {cashUpPageUrlParamFor} from "../../Model/Enum/CashUpRoute";
import {HOL_DR_ALL, HolidayDateRanges} from "../../Model/Enum/HolidayFilters";
import {DateFormats} from "../../Util/DateFormats";
import {accountingWeek, accountingYear} from "../../Util/DateUtils";

export class Routes {
  public static readonly INDEX = "/";
  public static readonly CASH_UP = "/cash-up";
  public static readonly ROTA = "/rota";
  public static readonly SIGN_IN_SHEET = "/sign-in";
  public static readonly WEEKLY_OVERVIEW = "/weekly-overview";
  public static readonly STAFF_MEMBERS = "/staff/members";
  public static readonly STAFF_ROLES = "/staff/roles";
  public static readonly CONSTANTS = "/constants";
  public static readonly HOLIDAYS = "/holidays";
  public static readonly ROTA_STAFFING_TEMPLATES = "/rota-staffing-templates";
  public static readonly USERS = "/admin/users";
  public static readonly ROLES = "/admin/roles";
  public static readonly WEEKLY_PLANNING = "/weekly-planning";
  public static readonly WEEKLY_ROTA = "/weekly-rota";
  public static readonly WEEKLY_SIGN_IN = "/weekly-sign-in";
  public static readonly TEST_RESULTS = "/test-results";
  public static readonly TEST_COVERAGE = "/test-coverage";
  public static readonly MONTHLY_FIGURES = "/monthly-figures"; // TODO add dates to route

  public static cashUpUrl(date: moment.Moment, page: CashUpPage) {
    return `${this.CASH_UP}/${date.format(DateFormats.API_DATE)}/${cashUpPageUrlParamFor(page)}`;
  }

  public static cashUpRoute() {
    return `${this.CASH_UP}/:date/:page`;
  }

  public static holidayUrl(dateRange: HolidayDateRanges = HOL_DR_ALL) {
    return `${this.HOLIDAYS}/${dateRange}`;
  }

  public static holidayRoute() {
    return `${this.HOLIDAYS}/:dateRange`;
  }

  public static rotaUrl(date: moment.Moment, type: string) {
    return `${this.ROTA}/${date.format(DateFormats.API_DATE)}/${type}`;
  }

  public static rotaRoute() {
    return `${this.ROTA}/:date/:type(bar|kitchen|ancillary)`;
  }

  public static signInUrl(date: moment.Moment, type: string) {
    return `${this.SIGN_IN_SHEET}/${date.format(DateFormats.API_DATE)}/${type}`;
  }

  public static signInRoute() {
    return `${this.SIGN_IN_SHEET}/:date/:type(bar|kitchen|ancillary)`;
  }

  public static weeklyOverviewUrl(date: moment.Moment) {
    return `${this.WEEKLY_OVERVIEW}/${accountingYear(date)}/${accountingWeek(date)}`;
  }

  public static weeklyOverviewRoute() {
    return `${this.WEEKLY_OVERVIEW}/:year/:weekNumber`;
  }

  public static weeklyRotaUrl(date: moment.Moment) {
    return `${this.WEEKLY_ROTA}/${accountingYear(date)}/${accountingWeek(date)}`;
  }

  public static weeklyRotaRoute() {
    return `${this.WEEKLY_ROTA}/:year/:weekNumber`;
  }

  public static weeklySignInUrl(date: moment.Moment) {
    return `${this.WEEKLY_SIGN_IN}/${accountingYear(date)}/${accountingWeek(date)}`;
  }

  public static weeklySignInRoute() {
    return `${this.WEEKLY_SIGN_IN}/:year/:weekNumber`;
  }

  public static weeklyPlanningUrl(date: moment.Moment) {
    return `${this.WEEKLY_PLANNING}/${accountingYear(date)}/${accountingWeek(date)}`;
  }

  public static weeklyPlanningRoute() {
    return `${this.WEEKLY_PLANNING}/:year/:weekNumber`;
  }
}