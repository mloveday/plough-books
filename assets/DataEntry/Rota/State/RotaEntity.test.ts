import * as moment from 'moment';
import {WorkTypes} from "../../../Enum/WorkTypes";
import {DateFormats} from "../../../Util/DateFormats";
import {Constants} from "./Constants";
import {RotaEntity} from "./RotaEntity";

describe('RotaEntity', () => {
  it('calling fromApi() using an empty object does not modify the entity', () => {
    const rotaEntity = RotaEntity.default();

    const modified = rotaEntity.with({});

    expect(modified).toEqual(RotaEntity.default());
  });

  it('calling fromApi() using a moment date returns an object fromApi a string as a date', () => {
    const rotaEntity = RotaEntity.default();
    const date = moment.utc();

    const modified = rotaEntity.with({date});

    expect(modified.date).toEqual(date.format(DateFormats.API));
  });

  it('calling fromApi() using a string date returns an object fromApi a string as a date', () => {
    const rotaEntity = RotaEntity.default();
    const date = moment().format(DateFormats.API);

    const modified = rotaEntity.with({date});

    expect(modified.date).toEqual(date);
  });

  it('calling fromApi() using a type and constants returns an object fromApi a string as a date', () => {
    const rotaEntity = RotaEntity.default();

    const modified = rotaEntity.with({type: WorkTypes.BAR, constants: Constants.default()});

    expect(modified.date).toEqual(rotaEntity.date);
  });

  it('returns a moment when calling getDate()', () => {
    const rotaEntity = RotaEntity.default();

    expect(rotaEntity.getDate()).toEqual(moment.utc(rotaEntity.date));
  })
});