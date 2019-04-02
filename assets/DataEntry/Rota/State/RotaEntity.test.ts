import * as moment from 'moment';
import {DateFormats} from "../../../Util/DateFormats";
import {Constants} from "../../Constants/State/Constants";
import {RotaEntity} from "./RotaEntity";

describe('RotaEntity', () => {
  it('calling fromPartial() using an empty object creates a default entity', () => {
    const date = moment.utc();

    const modified = RotaEntity.fromPartial({date: date.format(DateFormats.API)});

    expect(modified).toEqual(RotaEntity.default(date));
  });

  it('calling fromPartial() using a string date returns an object fromPartial a string as a date', () => {
    const date = moment.utc().format(DateFormats.API);

    const modified = RotaEntity.fromPartial({date});

    expect(modified.date).toEqual(date);
  });

  it('calling fromPartial() using constants returns an object fromPartial a string as a date', () => {
    const date = moment.utc();
    const modified = RotaEntity.fromPartial({constants: Constants.default().inputs});

    expect(modified.date).toEqual(RotaEntity.default(date).date);
  });

  it('returns a moment when calling getDate()', () => {
    const date = moment.utc();

    const rotaEntity = RotaEntity.default(date);

    expect(rotaEntity.getDate()).toEqual(moment.utc(rotaEntity.date));
  })
});