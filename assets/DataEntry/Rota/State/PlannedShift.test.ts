import {PlannedShift} from "./PlannedShift";
describe('PlannedShift', () => {
  it('stores the raw time input for start time', () => {
    const expected = '00:01';
    const plannedShift = PlannedShift.default();

    const modified = plannedShift.with({startTimeInputValue: expected});

    expect(modified.startTimeInputValue).toEqual(expected);
  });

  it('stores the raw time input for end time', () => {
    const expected = '00:01';
    const plannedShift = PlannedShift.default();

    const modified = plannedShift.with({endTimeInputValue: expected});

    expect(modified.endTimeInputValue).toEqual(expected);
  });

  it('does not change the input times when editing another field', () => {
    const plannedShift = PlannedShift.default().with({startTimeInputValue: '9:00', endTimeInputValue: '17:00'});

    const modified = plannedShift.with({hourlyRate: 1});

    expect(modified.startTimeInputValue).toEqual(plannedShift.startTimeInputValue);
    expect(modified.endTimeInputValue).toEqual(plannedShift.endTimeInputValue);
  });
});