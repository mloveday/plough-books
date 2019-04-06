import * as moment from "moment";
import {CashUpSection} from "../../Model/Enum/CashUpSection";
import {DateFormats} from "../../Util/DateFormats";

export interface IUiStateUpdateObject {
  cashUpSection?: CashUpSection;
  currentDateString?: string;
  showingNav?: boolean;
}

export class UiState {
  public static default(): UiState {
    return new UiState();
  }

  public readonly cashUpSection: CashUpSection = CashUpSection.TILLS;
  public readonly showingNav: boolean = false;
  private readonly currentDateString: string = moment.utc().format(DateFormats.API);

  public get currentDate(): moment.Moment {
    return moment.utc(this.currentDateString);
  }

  public isCurrentDateSameAs(date: moment.Moment) {
    return this.currentDate.diff(date, 'days') !== 0;
  }

  public withCurrentDate(date: moment.Moment) {
    return this.with({currentDateString: date.format(DateFormats.API)});
  }

  public withCashUpSection(cashUpSection: CashUpSection) {
    return this.with({cashUpSection});
  }

  public withShouldShowNav(shouldShowNav: boolean) {
    return this.with({showingNav: shouldShowNav});
  }

  private with(obj: IUiStateUpdateObject): UiState {
    return Object.assign(new UiState(), this, obj);
  }
}