import log from 'loglevel';
import * as moment from "moment";
import {DateFormats} from "./DateFormats";

function getStartOfAccountingYear(date: moment.Moment): moment.Moment {
  return date.clone().month(4).date(1).startOf('isoWeek');
}

export const accountingWeek = (date: moment.Moment): number => {
  const startOfYear = getStartOfAccountingYear(date);
  if (date >= startOfYear) {
    return date.diff(startOfYear.startOf('isoWeek'), 'week') + 1;
  } else {
    return date.diff(date.clone().subtract(1, 'year').month(4).date(1).startOf('isoWeek'), 'week') + 1;
  }
};

export const accountingYear = (date: moment.Moment): number => {
  const startOfYear = getStartOfAccountingYear(date);
  if (date >= startOfYear) {
    return date.year();
  } else {
    return date.year() - 1;
  }
};

export const startOfWeek = (year: number, weekNumber: number): moment.Moment => {
  return getStartOfAccountingYear(moment.utc().year(year)).add(weekNumber - 1, "weeks");
};

export const accountingYearString = (date: moment.Moment): string => {
  const accountingYearNumber = accountingYear(date);
  return `${accountingYearNumber}-${accountingYearNumber+1}`;
};

export const weeksDataKey = (date: moment.Moment) => {
  return moment.utc(date).startOf('isoWeek').format(DateFormats.API);
};

export const momentFromDateAndTime = (date: string, time: string, silent: boolean = false) => {
  const pattern = new RegExp(/[\d]{4}-[\d]{2}-[\d]{2} [\d]{2}:[\d]{2}/);
  if (pattern.test(time)) {
    if (!silent) {
      log.error(`Caught time as date (${time})`);
    }
    return moment.utc(time);
  }
  return moment.utc(`${date.toString()}T${time.toString()}Z`);
};