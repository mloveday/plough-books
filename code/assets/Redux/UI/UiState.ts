import * as moment from "moment";
import {RotaStaffingTemplateStatus} from "../../Model/Enum/RotaStaffingTemplateStatus";
import {WorkTypes} from "../../Model/Enum/WorkTypes";
import {DateFormats} from "../../Util/DateFormats";
import {momentFromDate} from "../../Util/DateUtils";
import {RotaStaffingTemplateFilters} from "../RotaStaffingTemplates/RotaStaffingTemplateFilters";

export interface IUiStateUpdateObject {
  currentDateString?: string;
  showingNav?: boolean;
  rotaShowRates?: boolean;
  rotaStaffingTemplateFilters?: RotaStaffingTemplateFilters;
}

export class UiState {
  public static default(): UiState {
    return new UiState();
  }

  public readonly rotaShowRates: boolean = false;
  public readonly showingNav: boolean = false;
  public readonly rotaStaffingTemplateFilters: RotaStaffingTemplateFilters = new RotaStaffingTemplateFilters(1, WorkTypes.BAR, RotaStaffingTemplateStatus.ACTIVE);
  private readonly currentDateString: string = moment.utc().format(DateFormats.API_DATE);

  public get currentDate(): moment.Moment {
    return momentFromDate(this.currentDateString);
  }

  public isCurrentDateSameAs(date: moment.Moment) {
    return this.currentDate.diff(date, 'days') !== 0;
  }

  public withCurrentDate(date: moment.Moment) {
    return this.with({currentDateString: date.format(DateFormats.API_DATE)});
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