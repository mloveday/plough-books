import * as moment from 'moment';
import {DateFormats} from "../../../Util/DateFormats";
import {RotaEntity} from "./RotaEntity";
import {RotasForWeek} from "./RotasForWeek";

describe('RotasForWeek', () => {
  it('should populate fromApi default rotas for week', () => {
    const date = moment.utc().startOf('isoWeek');
    const rotas = RotasForWeek.default();

    const modified = rotas.populateWeekFromApi(date, []);

    const datesInWeek = [
      date.clone(),
      date.clone().add(1, 'days'),
      date.clone().add(2, 'days'),
      date.clone().add(3, 'days'),
      date.clone().add(4, 'days'),
      date.clone().add(5, 'days'),
      date.clone().add(6, 'days'),
    ];
    datesInWeek.forEach(dateInWeek => {
      expect(modified.hasRotaForDate(dateInWeek)).toBeTruthy();
      expect(modified.getRotaForDate(dateInWeek)).toEqual(RotaEntity.fromApi({date: dateInWeek.format(DateFormats.API)}));
    });
  });

  it('should re-populate fromApi default rotas for week', () => {
    const date = moment.utc().startOf('isoWeek');
    const rotas = RotasForWeek.default().populateWeekFromApi(date, []);

    const modified = rotas.populateWeekFromApi(date, []);

    const datesInWeek = [
      date.clone(),
      date.clone().add(1, 'days'),
      date.clone().add(2, 'days'),
      date.clone().add(3, 'days'),
      date.clone().add(4, 'days'),
      date.clone().add(5, 'days'),
      date.clone().add(6, 'days'),
    ];
    datesInWeek.forEach(dateInWeek => {
      expect(modified.hasRotaForDate(dateInWeek)).toBeTruthy();
      expect(modified.getRotaForDate(dateInWeek)).toEqual(RotaEntity.fromApi({date: dateInWeek.format(DateFormats.API)}));
    });
  });
  // it('', () => {});
});