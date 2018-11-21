import * as moment from "moment";

function getStartOfAccountingYear(date: moment.Moment): moment.Moment {
  return date.clone().month(4).date(1).startOf('isoWeek');
}

export const accountingWeek = (date: moment.Moment): number => {
  const startOfYear = getStartOfAccountingYear(date);
  if (date >= startOfYear) {
    return date.diff(startOfYear.startOf('isoWeek'), 'week') + 1;
  } else {
    return date.diff(date.subtract(1, 'year').month(4).date(1).startOf('isoWeek'), 'week') + 1;
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
  return getStartOfAccountingYear(moment().year(year)).add(weekNumber, "weeks");
};

export const accountingYearString = (date: moment.Moment): string => {
  const accountingYearNumber = accountingYear(date);
  return `${accountingYearNumber}-${accountingYearNumber+1}`;
};