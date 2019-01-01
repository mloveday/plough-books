import * as moment from "moment";
import {DateFormats} from "../Util/DateFormats";

export class UiState {
  public static default(): UiState {
    return new UiState();
  }

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

  private with(obj: any): UiState {
    return Object.assign(new UiState(), this, obj);
  }
}