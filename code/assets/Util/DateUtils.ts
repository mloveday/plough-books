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

export const weeksDataKey = (date: moment.Moment): string => {
  return moment.utc(date).startOf('isoWeek').format(DateFormats.API_DATE);
};

export const momentFromDateAndTime = (date: string, time: string, silent: boolean = false): moment.Moment => {
  const pattern = new RegExp(/[\d]{4}-[\d]{2}-[\d]{2} [\d]{2}:[\d]{2}/);
  if (pattern.test(time)) {
    if (!silent) {
      log.error(`Caught time as date (${time})`);
    }
    return moment.utc(time);
  }
  return moment.utc(`${date.toString()}T${time.toString()}Z`);
};

export const validateDateString = (date: string, existingDate: string): string => {
  return moment.utc(date).isValid() ? moment.utc(date).format(DateFormats.API_DATE) : existingDate;
};

export const DAY_START_HOUR = 6;

export const getTimePeriods = (date: string): moment.Moment[] => {
  const startTime = momentFromDateAndTime(date, `0${DAY_START_HOUR}:00`);
  const endTime = momentFromDateAndTime(date, `0${DAY_START_HOUR}:00`).add(1, 'day');
  const numberOfTimePeriods = endTime.diff(startTime, 'minutes') / 30;
  const timePeriods: moment.Moment[] = [];
  for (let i = 0; i < numberOfTimePeriods; i++) {
    timePeriods.push(startTime.clone().add(i * 30, 'minutes'));
  }
  return timePeriods;
};

export const timeFromHalfHoursPastStart = (halfHoursPastDayStart: number): string => {
  const rawHour = DAY_START_HOUR + halfHoursPastDayStart * 0.5;
  const hour = rawHour >= 24 ? rawHour - 24 : rawHour;
  const time = moment.utc().startOf('day').add(hour, 'hours');
  return time.format(DateFormats.TIME_LEADING_ZERO);
};

export const getShiftStartTimeFromStrings = (value: string, date: string) => {
  let time = momentFromDateAndTime(date, value);
  if (time.hour() < DAY_START_HOUR) {
    time = momentFromDateAndTime(date, '06:00');
  }
  if (time.hour() === 0) {
    time = momentFromDateAndTime(date, '00:00');
  }
  return time;
};

export const getShiftEndTimeFromStrings = (value: string, date: string) => {
  let time = momentFromDateAndTime(date, value);
  if (time.hour() < DAY_START_HOUR) {
    time.add(1, 'day');
  }
  if (time.hour() === 0 || time.hour() === 24) {
    time = momentFromDateAndTime(date, '00:00').add(1, 'day');
  }
  return time;
};

export const dayFromWeekDayNumber = (weekday: number): string => {
  switch (weekday) {
    case 0:
    case 7:
      return 'Sunday';
    case 1:
      return 'Monday';
    case 2:
      return 'Tuesday';
    case 3:
      return 'Wednesday';
    case 4:
      return 'Thursday';
    case 5:
      return 'Friday';
    case 6:
      return 'Saturday';
    default:
      return '?';
  }
};