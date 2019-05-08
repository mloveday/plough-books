import * as moment from 'moment';
import {DateFormats} from "../../Util/DateFormats";
import {momentFromDateAndTime} from "../../Util/DateUtils";
import {WorkTypes} from "../Enum/WorkTypes";
import {StaffMember} from "../StaffMember/StaffMember";
import {Shift} from "./Shift";

const defaultShift = () => Shift.default(StaffMember.default(), WorkTypes.BAR, moment.utc().format(DateFormats.API_DATE));

describe('Shift', () => {
  it('stores the raw time input for start time', () => {
    const expected = '00:01';
    const plannedShift = defaultShift();

    const modified = plannedShift.with({startTime: {date: plannedShift.getStartTime().format(DateFormats.API_DATE), time: expected}});

    expect(modified.inputs.startTime).toEqual(expected);
  });

  it('stores the raw time input for end time', () => {
    const expected = '00:01';
    const plannedShift = defaultShift();

    const modified = plannedShift.with({endTime: {date: plannedShift.getStartTime().format(DateFormats.API_DATE), time: expected}});

    expect(modified.inputs.endTime).toEqual(expected);
  });

  it('does not change the input times when editing another field', () => {
    const shift = defaultShift();
    const plannedShift = shift.with({startTime: {date: shift.getStartTime().format(DateFormats.API_DATE), time:'9:00'}, endTime: {date: shift.getStartTime().format(DateFormats.API_DATE), time: '17:00'}});

    const modified = plannedShift.with({hourlyRate: "1"});

    expect(modified.inputs.startTime).toEqual(plannedShift.inputs.startTime);
    expect(modified.inputs.endTime).toEqual(plannedShift.inputs.endTime);
  });

  it('getStartTime() returns a moment including correct date for time after 06:00 and before midnight', () => {
    const today = moment.utc().format(DateFormats.API_DATE);
    const time = `23:45`;
    const plannedShift = defaultShift().with({date: today, startTime: {date: today, time}});

    expect(plannedShift.getStartTime().isSame(momentFromDateAndTime(today, time))).toBeTruthy();
  });

  it('getStartTime() returns a moment including correct date for time after midnight and before 06:00', () => {
    const today = moment.utc().format(DateFormats.API_DATE);
    const tomorrow = moment.utc().add(1, 'day').format(DateFormats.API_DATE);
    const time = `03:45`;
    const plannedShift = defaultShift().with({date: today, startTime: {date: today, time}});

    expect(plannedShift.getStartTime().isSame(momentFromDateAndTime(tomorrow, time))).toBeTruthy();
  });

  it('getEndTime() returns a moment including correct date for time after 06:00 and before midnight', () => {
    const today = moment.utc().format(DateFormats.API_DATE);
    const time = `23:45`;
    const plannedShift = defaultShift().with({date: today, endTime: {date: today, time}});

    expect(plannedShift.getEndTime().isSame(momentFromDateAndTime(today, time))).toBeTruthy();
  });

  it('getEndTime() returns a moment including correct date for time after midnight and before 06:00', () => {
    const today = moment.utc().format(DateFormats.API_DATE);
    const tomorrow = moment.utc().add(1, 'day').format(DateFormats.API_DATE);
    const time = `03:45`;
    const plannedShift = defaultShift().with({date: today, endTime: {date: today, time}});

    expect(plannedShift.getEndTime().isSame(momentFromDateAndTime(tomorrow, time))).toBeTruthy();
  });
});