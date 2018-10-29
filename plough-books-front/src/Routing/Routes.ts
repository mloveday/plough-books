import * as moment from "moment";

export class Routes {
  public static readonly INDEX = "/";
  public static readonly CASH_UP = "/cash-up";
  public static readonly ROTA = "/rota";
  public static readonly SIGN_IN_SHEET = "/sign-in-sheet";
  public static readonly WEEKLY_OVERVIEW = "/weekly-overview";
  public static readonly TEST = "/test";
  public static readonly USERS = "/admin/users";

  public static cashUpUrl(date: moment.Moment) {
    return `${this.CASH_UP}/${date.format("Y-M-D")}`;
  }

  public static cashUpRoute() {
    return `${this.CASH_UP}/:date`;
  }
}