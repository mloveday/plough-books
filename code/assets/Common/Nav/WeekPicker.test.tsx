import * as moment from "moment";
import * as React from 'react';
import {mountComponent} from "../../TestHelpers/ComponentMounting";
import {startOfWeek} from "../../Util/DateUtils";
import {Routes} from "../Routing/Routes";
import {WeekPicker} from "./WeekPicker";

describe('WeekPicker component', () => {
  it('Renders links for given week, 4 weeks either side and one month before & after', () => {
    const weekNumber = 30;
    const year = 2018;
    const expectedDates = [
      startOfWeek(year, weekNumber-4),
      startOfWeek(year, weekNumber-3),
      startOfWeek(year, weekNumber-2),
      startOfWeek(year, weekNumber-1),
      startOfWeek(year, weekNumber),
      startOfWeek(year, weekNumber+1),
      startOfWeek(year, weekNumber+2),
      startOfWeek(year, weekNumber+3),
      startOfWeek(year, weekNumber+4),
    ];
    const priorMonth = startOfWeek(year, weekNumber).subtract(1, 'month');
    const nextMonth = startOfWeek(year, weekNumber).add(1, 'month');
    const urlFromDateFn = (date: moment.Moment) => Routes.weeklyOverviewUrl(date);

    const wrapper = mountComponent(<WeekPicker week={weekNumber} year={year} urlFromDate={urlFromDateFn} />);

    expectedDates.forEach(expectedDate =>
      expect(wrapper.find(`.week-link.this-period[href="${urlFromDateFn(expectedDate)}"]`)).toHaveLength(1)
    );

    expect(wrapper.find(`.week-link.prev-period[href="${urlFromDateFn(priorMonth)}"]`)).toHaveLength(1);
    expect(wrapper.find(`.week-link.next-period[href="${urlFromDateFn(nextMonth)}"]`)).toHaveLength(1);
  });
});