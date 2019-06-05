import * as moment from "moment";
import {CashUpSection} from "../../Model/Enum/CashUpSection";
import {WorkTypes} from "../../Model/Enum/WorkTypes";
import {DateFormats} from "../../Util/DateFormats";
import {RotaStaffingTemplateFilters} from "../RotaStaffingTemplates/RotaStaffingTemplateFilters";

export interface IUiStateUpdateObject {
  cashUpSection?: CashUpSection;
  currentDateString?: string;
  showingNav?: boolean;
  rotaShowRates?: boolean;
  rotaStaffingTemplateFilters?: RotaStaffingTemplateFilters;
}

export class UiState {
  public static default(): UiState {
    return new UiState();
  }

  public readonly cashUpSection: CashUpSection = CashUpSection.TILLS;
  public readonly rotaShowRates: boolean = false;
  public readonly showingNav: boolean = false;
  public readonly rotaStaffingTemplateFilters: RotaStaffingTemplateFilters = new RotaStaffingTemplateFilters(1, WorkTypes.BAR);
  private readonly currentDateString: string = moment.utc().format(DateFormats.API_DATE);

  public get currentDate(): moment.Moment {
    return moment.utc(this.currentDateString);
  }

  public isCurrentDateSameAs(date: moment.Moment) {
    return this.currentDate.diff(date, 'days') !== 0;
  }

  public withCurrentDate(date: moment.Moment) {
    return this.with({currentDateString: date.format(DateFormats.API_DATE)});
  }

  public withCashUpSection(cashUpSection: CashUpSection) {
    return this.with({cashUpSection});
  }

  public withShouldShowNav(shouldShowNav: boolean) {
    return this.with({showingNav: shouldShowNav});
  }

  public withShouldShowRotaRates(shouldShowRates: boolean) {
    return this.with({rotaShowRates: shouldShowRates});
  }

  public withRotaStaffingTemplateFilters(rstf: RotaStaffingTemplateFilters) {
    return this.with({rotaStaffingTemplateFilters: rstf});
  }

  private with(obj: IUiStateUpdateObject): UiState {
    return Object.assign(new UiState(), this, obj);
  }
}