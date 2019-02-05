import * as moment from 'moment';
import {WorkTypes} from "../../../Enum/WorkTypes";
import {DateFormats} from "../../../Util/DateFormats";
import {momentFromDateAndTime} from "../../../Util/DateUtils";
import {StaffMember} from "../../StaffMembers/State/StaffMember";
import {StaffRole} from "../../StaffRoles/State/StaffRole";
import {Shift} from "./Shift";

const defaultRole = () => StaffRole.fromResponse({id: 1});

const defaultShift = () => Shift.defaultFor(StaffMember.fromResponse({role: defaultRole()}), WorkTypes.BAR, moment.utc().format(DateFormats.API));

describe('Shift', () => {
  it('stores the raw time input for start time', () => {
    const expected = '00:01';
    const plannedShift = defaultShift();

    const modified = plannedShift.update({startTimeInputValue: expected});

    expect(modified.startTimeInputValue).toEqual(expected);
  });

  it('stores the raw time input for end time', () => {
    const expected = '00:01';
    const plannedShift = defaultShift();

    const modified = plannedShift.update({endTimeInputValue: expected});

    expect(modified.endTimeInputValue).toEqual(expected);
  });

  it('does not change the input times when editing another field', () => {
    const plannedShift = defaultShift().update({startTimeInputValue: '9:00', endTimeInputValue: '17:00'});

    const modified = plannedShift.update({hourlyRate: 1});

    expect(modified.startTimeInputValue).toEqual(plannedShift.startTimeInputValue);
    expect(modified.endTimeInputValue).toEqual(plannedShift.endTimeInputValue);
  });

  it('getStartTime() returns a moment including correct date for time after 06:00 and before midnight', () => {
    const today = moment.utc().format(DateFormats.API);
    const time = `23:45`;
    const plannedShift = defaultShift().update({date: today, startTime: `${today} ${time}`});

    expect(plannedShift.getStartTime().isSame(momentFromDateAndTime(today, time))).toBeTruthy();
  });

  it('getStartTime() returns a moment including correct date for time after midnight and before 06:00', () => {
    const today = moment.utc().format(DateFormats.API);
    const tomorrow = moment.utc().add(1, 'day').format(DateFormats.API);
    const time = `03:45`;
    const plannedShift = defaultShift().update({date: today, startTime: `${today} ${time}`});

    expect(plannedShift.getStartTime().isSame(momentFromDateAndTime(tomorrow, time))).toBeTruthy();
  });

  it('getEndTime() returns a moment including correct date for time after 06:00 and before midnight', () => {
    const today = moment.utc().format(DateFormats.API);
    const time = `23:45`;
    const plannedShift = defaultShift().update({date: today, endTime: `${today} ${time}`});

    expect(plannedShift.getEndTime().isSame(momentFromDateAndTime(today, time))).toBeTruthy();
  });

  it('getEndTime() returns a moment including correct date for time after midnight and before 06:00', () => {
    const today = moment.utc().format(DateFormats.API);
    const tomorrow = moment.utc().add(1, 'day').format(DateFormats.API);
    const time = `03:45`;
    const plannedShift = defaultShift().update({date: today, endTime: `${today} ${time}`});

    expect(plannedShift.getEndTime().isSame(momentFromDateAndTime(tomorrow, time))).toBeTruthy();
  });
});