import * as moment from 'moment';
import {DateFormats} from "../../Util/DateFormats";
import {momentFromDate} from "../../Util/DateUtils";
import {RotaEntity} from "./RotaEntity";

describe('RotaEntity', () => {
  it('calling fromPartial() using an empty object creates a default entity', () => {
    const date = moment.utc();

    const modified = RotaEntity.default(date);

    expect(modified).toEqual(RotaEntity.default(date));
  });

  it('calling fromPartial() using a string date returns an object fromPartial a string as a date', () => {
    const date = moment.utc().format(DateFormats.API_DATE);

    const modified = RotaEntity.default(momentFromDate(date));

    expect(modified.date).toEqual(date);
  });

  it('returns a moment when calling getDate()', () => {
    const date = moment.utc();

    const rotaEntity = RotaEntity.default(date);

    expect(rotaEntity.getDate()).toEqual(momentFromDate(rotaEntity.date));
  })
});