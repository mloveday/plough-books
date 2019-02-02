import * as moment from 'moment';
import {WorkTypes} from "../../../Enum/WorkTypes";
import {DateFormats} from "../../../Util/DateFormats";
import {Constants} from "./Constants";
import {RotaEntity} from "./RotaEntity";

describe('RotaEntity', () => {
  it('calling fromApi() using an empty object creates a default entity', () => {
    const date = moment.utc();

    const modified = RotaEntity.fromApi({date: date.format(DateFormats.API)});

    expect(modified).toEqual(RotaEntity.default(date));
  });

  it('calling fromApi() using a moment date returns an object fromApi a string as a date', () => {
    const date = moment.utc();

    const modified = RotaEntity.fromApi({date});

    expect(modified.date).toEqual(date.format(DateFormats.API));
  });

  it('calling fromApi() using a string date returns an object fromApi a string as a date', () => {
    const date = moment().format(DateFormats.API);

    const modified = RotaEntity.fromApi({date});

    expect(modified.date).toEqual(date);
  });

  it('calling fromApi() using a type and constants returns an object fromApi a string as a date', () => {
    const date = moment.utc();
    const modified = RotaEntity.fromApi({type: WorkTypes.BAR, constants: Constants.default()});

    expect(modified.date).toEqual(RotaEntity.default(date).date);
  });

  it('returns a moment when calling getDate()', () => {
    const date = moment.utc();

    const rotaEntity = RotaEntity.default(date);

    expect(rotaEntity.getDate()).toEqual(moment.utc(rotaEntity.date));
  })
});