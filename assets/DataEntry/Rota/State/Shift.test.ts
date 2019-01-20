import * as moment from 'moment';
import {DateFormats} from "../../../Util/DateFormats";
import {momentFromDateAndTime} from "../../../Util/DateUtils";
import {Shift} from "./Shift";

describe('Shift', () => {
  it('stores the raw time input for start time', () => {
    const expected = '00:01';
    const plannedShift = Shift.default();

    const modified = plannedShift.with({startTimeInputValue: expected});

    expect(modified.startTimeInputValue).toEqual(expected);
  });

  it('stores the raw time input for end time', () => {
    const expected = '00:01';
    const plannedShift = Shift.default();

    const modified = plannedShift.with({endTimeInputValue: expected});

    expect(modified.endTimeInputValue).toEqual(expected);
  });

  it('does not change the input times when editing another field', () => {
    const plannedShift = Shift.default().with({startTimeInputValue: '9:00', endTimeInputValue: '17:00'});

    const modified = plannedShift.with({hourlyRate: 1});

    expect(modified.startTimeInputValue).toEqual(plannedShift.startTimeInputValue);
    expect(modified.endTimeInputValue).toEqual(plannedShift.endTimeInputValue);
  });

  it('getStartTime() returns a moment including correct date for time after 06:00 and before midnight', () => {
    const today = moment.utc().format(DateFormats.API);
    const time = '23:45';
    const plannedShift = Shift.default().with({date: today, startTime: time});

    expect(plannedShift.getStartTime().isSame(momentFromDateAndTime(today, time))).toBeTruthy();
  });

  it('getStartTime() returns a moment including correct date for time after midnight and before 06:00', () => {
    const today = moment.utc().format(DateFormats.API);
    const tomorrow = moment.utc().add(1, 'day').format(DateFormats.API);
    const time = '03:45';
    const plannedShift = Shift.default().with({date: today, startTime: time});

    expect(plannedShift.getStartTime().isSame(momentFromDateAndTime(tomorrow, time))).toBeTruthy();
  });

  it('getEndTime() returns a moment including correct date for time after 06:00 and before midnight', () => {
    const today = moment.utc().format(DateFormats.API);
    const time = '23:45';
    const plannedShift = Shift.default().with({date: today, endTime: time});

    expect(plannedShift.getEndTime().isSame(momentFromDateAndTime(today, time))).toBeTruthy();
  });

  it('getEndTime() returns a moment including correct date for time after midnight and before 06:00', () => {
    const today = moment.utc().format(DateFormats.API);
    const tomorrow = moment.utc().add(1, 'day').format(DateFormats.API);
    const time = '03:45';
    const plannedShift = Shift.default().with({date: today, endTime: time});

    expect(plannedShift.getEndTime().isSame(momentFromDateAndTime(tomorrow, time))).toBeTruthy();
  });
});